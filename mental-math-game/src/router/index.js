import { createRouter, createWebHistory } from 'vue-router'
import HomeComponent from '@/components/HomeComponent.vue'
import GameComponent from '@/components/GameComponent.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeComponent
    },
    {
        path: '/game',
        name: 'Game', // Это имя, которое используется в $router.push
        component: GameComponent,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
