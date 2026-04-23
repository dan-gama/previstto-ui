import { SelectOptions } from '../dtos/select-options';

export function useSelectFilter() {
  /**
   * @param val: Valor informado pelo usuário
   * @param update: Callback do Quasar
   * @param originalOptions: Ref ou Array com os dados da API
   * @param targetOptions: Ref ou Array que o q-select está usando para exibir
   */

  const filterFn = (
    val: string,
    update: (cb: () => void) => void,
    originalOptions: SelectOptions[],
    updateSelect: (filtered: SelectOptions[]) => void
  ) => {
    if (val === '') {
      update(() => {
        updateSelect(originalOptions);
      })
      return;
    }

    update(() => {
      const needle = val.toLowerCase();
      updateSelect(
        originalOptions.filter(v => v.label.toLowerCase().includes(needle))
      )
    })
  };

  return { filterFn };
}
