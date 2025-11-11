<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import IconEvStation from './components/icons/IconEvStation.vue'
</script>

<template>
  <div class="app-container">
    <header>
      <IconEvStation />
      <div class="wrapper">
        <HelloWorld msg="EV Charger" />
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
        </nav>
      </div>
    </header>

    <main class="router-content-wrapper">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}

header {
  line-height: 1.5;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 0;
  width: 100%;
}

header .wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.router-content-wrapper {
  width: 100%;
  max-width: 600px;
  margin-top: 2rem;
  padding: 0 1rem;
  text-align: left;
}

@media (min-width: 1024px) {
  .app-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    width: 100%;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding-right: 0;
    width: 100%;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  header .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    flex-direction: column;
    width: 100%;
  }

  nav {
    text-align: center;
    margin-left: 0;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }

  .router-content-wrapper {
    width: 100%;
    max-width: 600px;
    margin-top: 2rem;
    padding: 0 1rem;
    text-align: left;
    margin-left: auto; /* Pushes the left edge to the right */
    margin-right: auto; /* Pushes the right edge to the left */
  }
}
</style>
