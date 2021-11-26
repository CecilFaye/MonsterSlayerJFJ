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
			name: 'home',
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
			name: 'credits',
			path: '/credits',
			component: () => import('@/components/screens/CreditScreen.vue'),
		},
		{
			name: 'mainstage',
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
							name: 'character',
							component: () => import('@/components/screens/game-screens/CharacterInfoScreen.vue'),
							props: true
						},
						{
							name: 'inventory',
							path: '/game/inventory',
							component: () => import('@/components/screens/game-screens/InventoryScreen.vue'),
							props: true
						},
						{
							name: 'skills',
							path: '/game/skills',
							component: () => import('@/components/screens/game-screens/SkillsScreen.vue'),
							props: true
						},
						{
							path:'',
							redirect: '/mainstage'
						},
						{
							path: '/:catchAll(.*)',
							redirect: '/mainstage'
						}
					]
				},
				{
					name: 'battle',
					path: '/game/battle',
					component: () => import('@/components/screens/game-screens/BattleScreen.vue'),
					props: true
				},
				{
					name: 'fightresult',
					path: '/game/fightresult',
					component: () => import('@/components/screens/game-screens/FightResultScreen.vue'),
					props: true
				},
				{
					name: 'transition',
					path: '/game/transition',
					component: () => import('@/components/screens/game-screens/TransitionScreen.vue'),
					props: true
				},
				{
					path: '/:catchAll(.*)',
					redirect: '/mainstage'
				},
			]
		},
		{
			path: '/:catchAll(.*)',
			redirect: '/mainstage'
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