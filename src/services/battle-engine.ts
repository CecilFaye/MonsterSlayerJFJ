import { GetterTypes } from "@/store/modules/game/getters";
import { MutationTypes } from "@/store/modules/game/mutations";
import { ActivityStateOptions, IAction, ICharacter, IEnemy, IPersonState, ISkills, PersonType } from "@/store/types";
import { useStore } from "vuex";
import { useMonsterEngine } from "./monster-engine";
import useMonsterSlayerService from "./monster-slayer-service";

const defaultCharacterState = {
    id: 1,
    name: '',
    personType: PersonType.Player,
    maxHealth: 999,
    maxMana: 999,
    turn: false,
    currentState: {
        health: 0,
        mana: 0,
        activityState: ActivityStateOptions.Idle,
        activityStateOptions: Object.keys(ActivityStateOptions).map(_ => _),
    },
    attacking: false,
    toSelf: false
} as IPersonState;


export enum ActionResult {
    'miss' = 'MISS',
    'success' = 'SUCCESS'
}

export interface IActionResultStatus {
    skill: ISkills;
    result: ActionResult;
    damage: number;
    isCritical: boolean;
}

export enum AttackType {
    M = 'magic',
    P = 'Physical'
}

export interface IFightStat {
    critRatePercentage: number; // critical rate percentage
    defReductionPercentage: number; // defensive reduction percentage
    evaHitRatePercentage: number; // evasion rate percentage
}

export interface IActionStat extends IFightStat {
    skill: ISkills;
    normalDamage: number;
    critDamage: number;
}

export interface IBattleEngine {
    initBattle: () => void;
    initCharacter: (charType:  PersonType, char: ICharacter | IEnemy) => void;
    battleStart: () => void;
    isBattleStarted: () => boolean;
    prepareAttack: (charType: PersonType, char: IPersonState, skill: ISkills) => IActionStat ;
    action: (act: IAction) => void;
    isAttacking: (pType: PersonType) => boolean;
    toSelf: (pType: PersonType) => boolean;
}

export const useBattleEngine = (): IBattleEngine => {
    const store = useStore();
    const service = useMonsterSlayerService();
    const monsService = useMonsterEngine();
    const initBattle = (): void => {
        initCharacter(PersonType.Player, service.getCharacterDetails());
        initCharacter(PersonType.Monsters, monsService.genMonsterData());
        store.commit('game/' + MutationTypes.reset);
    };
    const initCharacter = (charType:  PersonType, char: ICharacter | IEnemy): void => {
        const charState = Object.assign({},defaultCharacterState) as IPersonState;
        charState.currentState = Object.assign({},defaultCharacterState.currentState);
        charState._raw =  JSON.parse(JSON.stringify(char));
        charState.name = char.name;
        charState.maxHealth = char.stats.health;
        charState.maxMana = char.stats.mana;
        charState.currentState.health = 100; // This is percentage
        charState.currentState.mana = 100; // This is percentage
        if (charType === PersonType.Player) {
            const equipment = (char as ICharacter).equipment;
            charState.maxHealth += (equipment.armor?.bonus?.health ?? 0 ) + (equipment.weapon?.bonus?.health ?? 0);
            charState.maxMana += (equipment.armor?.bonus?.mana ?? 0 ) + (equipment.weapon?.bonus?.mana ?? 0);
        }
        store.commit('game/' + (charType === PersonType.Player ? MutationTypes.initializePlayer: MutationTypes.initializeMonster), charState);

    };
    const battleStart = (): void => {
        // Note: should be called in the fight screen only
        store.commit('game/' + MutationTypes.initFirstTurn);
    };
    const isBattleStarted = (): boolean => store.state.battleStart;
    const action = (act: IAction): void => {

        const actor = act.personType as PersonType;
        const receiver = actor === PersonType.Player ? PersonType.Monsters : PersonType.Player;
        const actorState: IPersonState  = store.getters['game/' + (actor === PersonType.Player ? GetterTypes.getPlayerState : GetterTypes.getEnemyState)]();
        const receiverState: IPersonState  = store.getters['game/' + (receiver === PersonType.Player ? GetterTypes.getPlayerState : GetterTypes.getEnemyState)]();

        store?.commit('game/' + MutationTypes.acting, { personType: actor, actionTaken: act.actionTaken });

        const manaCost = act.actionTaken.skill.cost;
        const actorHealth = actorState.currentState.health;
        const actorMana = actorState.currentState.mana;
        const receiverHealth = receiverState.currentState.health;
        const receiverMana = receiverState.currentState.mana;

        let actorActualMana = (actorMana/100)*actorState.maxMana;
        let actorActualHealth = (actorHealth/100)*actorState.maxHealth;
        let receiverActualHealth = (receiverHealth/100)*receiverState.maxHealth;
        const receiverActualMana = (receiverMana/100)*receiverState.maxMana;

        if (actorActualMana > manaCost) {
            if (act.actionTaken.skill.target === 'self') {
                const attackDetails = prepareAttack(actor, actorState, act.actionTaken.skill);
                const maxHealth = actorState.maxHealth;
                const maxMana = actorState.maxMana;
                actorActualHealth = actorActualHealth + Math.abs(attackDetails.normalDamage);
                actorActualHealth = actorActualHealth > maxHealth ? maxHealth :actorActualHealth;
                actorActualMana = actorActualMana - manaCost;
                actorActualMana = actorActualMana > maxMana ? maxMana :actorActualMana;

                const attackerName = (actorState.name).toUpperCase();
                store?.commit('game/' + MutationTypes.actionLogGeneric, attackerName +" use " + act.actionTaken.skill.name +  ".");
            } else {
                const attack = processAttack(actor, act, actorState, receiverState);
                if (attack.result === ActionResult.success) {
                    receiverActualHealth = receiverActualHealth - attack.damage;
                }
                actorActualMana = actorActualMana - manaCost;
                store?.commit('game/' + MutationTypes.actionLog, { personType: actor, actionTaken: attack });
            }

            const remainingReceiverHealthPercentage = (receiverActualHealth/receiverState.maxHealth)*100;
            const remainingReceiverManaPercentage = (receiverActualMana/receiverState.maxMana)*100;
            const remainingActorHealthPercentage = (actorActualHealth/actorState.maxHealth)*100;
            const remainingActorManaPercentage = (actorActualMana/actorState.maxMana)*100;

            store?.commit('game/' + MutationTypes.updatePersonState, {
                charType: actor,
                health: remainingActorHealthPercentage,
                mana: remainingActorManaPercentage
            });
            store?.commit('game/' + MutationTypes.updatePersonState, {
                charType: receiver,
                health: remainingReceiverHealthPercentage,
                mana: remainingReceiverManaPercentage
            });
        } else {
            const attackerName = (actorState.name).toUpperCase();
            const skillName = act.actionTaken.skill.name.toUpperCase();
            store?.commit('game/' + MutationTypes.actionLogGeneric, attackerName +" failed to use " + skillName +  ". Not enough mana!");
        }
        setTimeout(() => {
            store?.commit('game/' + MutationTypes.stopActing, actor);
            if (receiver === PersonType.Monsters && receiverActualHealth > 0) {
                store?.commit('game/' + MutationTypes.initTurn, receiver);
            } else if (receiverActualHealth <= 0) {
                service.dungeonRaidResult()
                .then(() => service.gameResult());
            }
        }, 2000);
    };
    const prepareAttack = (charType: PersonType, char: IPersonState, skill: ISkills): IActionStat => {
        const character = char._raw;
        const skillToUse = skill;  //character.skills[service.randomAction(character.skills?.length)];
        const charStats = service.statCompute(charType, character) as IActionStat;
        charStats.skill = skillToUse;
        return service.damageCompute(charType, character, charStats);
    };
    const prepareDefense  = (charType: PersonType, receiver: IPersonState): IFightStat => {
        return service.statCompute(charType, receiver._raw);
    };
    const processAttack = (charType: PersonType, action: IAction, actor: IPersonState, receiver: IPersonState): IActionResultStatus => {
        const result = { skill: action.actionTaken.skill, damage: 0, result: ActionResult.success, isCritical: false } as IActionResultStatus;
        const attackDetails = prepareAttack(charType, actor, action.actionTaken.skill);
        const defensiveDetails = prepareDefense(charType === PersonType.Player ? PersonType.Player : PersonType.Monsters, receiver);
        const levelDiffAdditional = actor._raw.level - receiver._raw.level;

        const criticalSucceeded = service.randomAction(100) <= (attackDetails.critRatePercentage + levelDiffAdditional);
        if (criticalSucceeded) {
            result.damage = attackDetails.critDamage - ((defensiveDetails.defReductionPercentage/100)*attackDetails.critDamage);
            result.isCritical = true;
        } else {
            result.damage = attackDetails.normalDamage - ((defensiveDetails.defReductionPercentage/100)*attackDetails.normalDamage);

            const isMissed = service.randomAction(100) <= (attackDetails.evaHitRatePercentage + levelDiffAdditional);
            if (isMissed) {
                result.damage = 0;
                result.result = ActionResult.miss;
            }
        }
        return result;
    };
    const isAttacking = (pType: PersonType): boolean => {
        return store.state.game[pType].attacking;
    };
    const toSelf = (pType: PersonType): boolean => {
        return store.state.game[pType].toSelf;
    };
    return {
        initBattle,
        initCharacter,
        prepareAttack,
        battleStart,
        isBattleStarted,
        action,
        isAttacking,
        toSelf,
    };
}

export default useBattleEngine;