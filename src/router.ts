import {
	createRouter,
	createWebHistory,
	Router,
	RouteLocationNormalized,
	NavigationGuardNext
} from "vue-router";

import * as helper from '@/app-lib/helper/session-helper';
import { storageNames } from "@/app-lib/helper/session-helper";

const router: Router = createRouter({
	routes: [
		{
			path: '',
			component: () => import('@/components/screens/HomeScreen.vue'),
			beforeEnter(to: RouteLocationNormalized,
				from: RouteLocationNormalized, next: NavigationGuardNext){
				if(helper.hasSession(storageNames.account)){
					if ( helper.hasSession(storageNames.account)) {
						next(`/game`);
					} else {
						helper.clearAllSessionValues();
						next('');
					}
				} else {
					next();
				}
			},
		},
		{
			path: '/credits',
			component: () => import('@/components/screens/CreditScreen.vue'),
		},
		{
			path: '/mainstage',
			component:  () => import('@/components/screens/game-screens/MainStageScreen.vue'),
			beforeEnter(to: RouteLocationNormalized,
				from: RouteLocationNormalized, next: NavigationGuardNext){
					if(helper.hasSession(storageNames.account)){
						next();
					} else {
						helper.clearAllSessionValues();
						next('/');
					}
			}
		},
		{
			path: '/game',
			component:  () => import('@/components/screens/GameScreen.vue'),
			beforeEnter(to: RouteLocationNormalized,
				from: RouteLocationNormalized, next: NavigationGuardNext){
					if(helper.hasSession(storageNames.account)){
						next();
					} else {
						helper.clearAllSessionValues();
						next('/');
					}
			},
			children:[
				{
					path: '',
					component: () => import('@/components/screens/game-screens/CharacterLayoutScreen.vue'),
					beforeEnter(to: RouteLocationNormalized,
						from: RouteLocationNormalized, next: NavigationGuardNext){
							if(helper.hasSession(storageNames.account)){
								next();
							} else {
								helper.clearAllSessionValues();
								next('');
							}
					},
					props: true,
					children:[
						{
							path: '/game/character',
							component: () => import('@/components/screens/game-screens/CharacterInfoScreen.vue'),
							props: true
						},
						{
							path: '/game/inventory',
							component: () => import('@/components/screens/game-screens/InventoryScreen.vue'),
							props: true
						},
						{
							path: '/game/skills',
							component: () => import('@/components/screens/game-screens/SkillsScreen.vue'),
							props: true
						},
						{
							path:'',
							redirect: '/game/character'
						},
						{
							path: '/:catchAll(.*)',
							redirect: '/game/character'
						}
					]
				},
				{
					path: '/game/battle',
					component: () => import('@/components/screens/game-screens/BattleScreen.vue'),
					props: true
				},
				{
					path: '/game/fightresult',
					component: () => import('@/components/screens/game-screens/FightResultScreen.vue'),
					props: true
				},
				{
					path: '/:catchAll(.*)',
					component: () => import('@/components/screens/security/NotFound.vue')
				},
			]
		},
		{
			path: '/:catchAll(.*)',
			redirect: '/game/character'
		}
	],
	history: createWebHistory(),
	linkActiveClass: 'active',
});

router.beforeEach((to: RouteLocationNormalized,
	from: RouteLocationNormalized,
	next: NavigationGuardNext) => {
		next();
});
export default router;