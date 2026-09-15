import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        clientes: resolve(__dirname, 'src/views/clientes.html'),
        dinero: resolve(__dirname, 'src/views/dinero.html'),
        loanDetails: resolve(__dirname, 'src/views/loan-details.html'),
      },
    },
  },
});
