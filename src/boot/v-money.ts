import { boot } from 'quasar/wrappers'
import { Money3Directive } from 'v-money3'

export default boot(({ app }) => {
  // Sua configuração única
  const globalConfig = {
    decimal: ',',
    thousands: '.',
    precision: 2,
    masked: false
  }

  app.directive('money', {
    mounted(el, binding) {
      // Encontra o input real dentro do q-input do Quasar
      const input = el.tagName === 'INPUT' ? el : el.querySelector('input')
      if (input) {
        // Usa a config global, mas permite sobrescrever se passar algo no v-money3="..."
        binding.value = binding.value || globalConfig
        Money3Directive.mounted(input, binding)
      }
    },
    updated(el, binding) {
      const input = el.tagName === 'INPUT' ? el : el.querySelector('input')
      if (input) {
        binding.value = binding.value || globalConfig
        Money3Directive.updated(input, binding)
      }
    },
    unmounted(el) {
      const input = el.tagName === 'INPUT' ? el : el.querySelector('input')
      if (input) {
        Money3Directive.beforeUnmount(input)
      }
    }
  })
})
