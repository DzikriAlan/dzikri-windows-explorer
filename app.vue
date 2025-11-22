<template>
  <div>
    <NuxtPage />
  </div>
</template>

<style>
@import '~/assets/css/main.css';

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Remove default button styles */
button {
  font-family: inherit;
}
</style>