// vDrag.js
export const vDrag = {
  mounted(el) {
    // 1. Busca especificamente a classe do seu header
    const header = el.querySelector('.dialog-header') || el;
    header.style.cursor = 'move';

    header.onmousedown = (e) => {
      // Ignora o clique se o usuário estiver clicando no botão de fechar ou em ícones
      if (e.target.closest('.q-btn') || e.target.closest('.q-icon')) {
        return;
      }

      e.preventDefault();

      // Pega a posição atual do mouse
      const startX = e.clientX;
      const startY = e.clientY;

      // Posição atual do card na tela antes de mover
      const rect = el.getBoundingClientRect();
      const initialX = rect.left;
      const initialY = rect.top;

      // Desativa as travas de layout do Quasar transformando em fixed
      el.style.position = 'fixed';
      el.style.margin = '0';
      el.style.transform = 'none'; // Mata o transform original do Quasar

      // Define a posição inicial fixa baseada na posição atual real
      el.style.left = `${initialX}px`;
      el.style.top = `${initialY}px`;

      const onMouseMove = (moveEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;

        // Calcula a nova posição
        el.style.left = `${initialX + deltaX}px`;
        el.style.top = `${initialY + deltaY}px`;
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };
  },
};
