import { computed, ref } from 'vue'
import type { QTableColumn } from 'quasar'
import { bankAccountService } from '@/modules/bank-accounts/services/bank-account.service'
import { categoryService } from '@/modules/categories/services/category.service'
import { creditCardService } from '@/modules/credit-cards/services/credit-card.service'
import { personService } from '@/modules/persons/services/person.service'
import { SelectOptions } from '@/shared/dtos/select-options'
import { CategoryOption, CategorySelect } from '@/shared/domain/interfaces/CategorySelect'
import { FinancialType } from '@/shared/domain/types/FinancialType'
import { formatDateInput } from '@/shared/utils/date.utils'
import { notify } from '@/shared/utils/notify.utils'
import { ScheduleMapper } from '../mappers/schedule.mapper'
import { ScheduleForm, ScheduleItem } from '../models/schedule.model'
import { scheduleService } from '../services/schedule.services'
import { RecurrenceType, RecurrenceTypeLabel } from '../types/RecurrenceType'

const createEmptyScheduleForm = (type: FinancialType): ScheduleForm => ({
  id: null,
  type,
  description: '',
  amount: 0,
  category: null,
  creditBank: null,
  person: null,
  startingOn: '',
  recurrence: 'monthly',
  installment: null,
  active: true,
  tag: null,
})

export function useScheduleManager() {
  const deleteDialog = ref(false)
  const deleting = ref(false)
  const selectedDeleteId = ref<string | null>(null)
  const financialType = ref<FinancialType>('expense')
  const filter = ref('')
  const saving = ref(false)
  const formDialog = ref(false)
  const rows = ref<ScheduleItem[]>([])
  const searchFilter = ref('')

  const model = ref<ScheduleForm>(createEmptyScheduleForm(financialType.value))

  const transactionSourceOptions = ref<SelectOptions[]>([])
  const bankAccountOptionsOriginal = ref<SelectOptions[]>([])
  const creditCardOptionsOriginal = ref<SelectOptions[]>([])
  const personOptions = ref<SelectOptions[]>([])
  const personOptionsOriginal = ref<SelectOptions[]>([])
  const tagOptions = ref<SelectOptions[]>([])
  const tagOptionsOriginal = ref<SelectOptions[]>([])
  const categorySelects = ref<CategorySelect[]>([])
  const categorySelectsOriginal = ref<CategorySelect[]>([])

  const columns: QTableColumn[] = [
    { name: 'description', label: 'Lancamento', field: 'description', align: 'left', sortable: true },
    { name: 'amount', label: 'Valor', field: 'amount', align: 'left', sortable: true },
    { name: 'startingOn', label: 'Comecando em', field: 'startingOn', align: 'left', sortable: true },
    { name: 'recurrence', label: 'Recorrencia', field: 'recurrenceType', align: 'left' },
    { name: 'active', label: 'Status', field: 'active', align: 'left' },
    { name: 'actions', label: 'Acoes', field: 'actions', align: 'center', sortable: false },
  ]

  const recurrenceOptions = Object.entries(RecurrenceTypeLabel).map(([key, value]) => ({
    value: key as RecurrenceType,
    label: value,
  }))

  const filteredTableRows = computed(() => {
    return rows.value.filter((item) => item.type === financialType.value)
  })

  const totalAmount = computed(() => {
    return filteredTableRows.value.reduce((total, item) => total + item.amount, 0)
  })

  const pendingCount = computed(() => {
    return 0
  })

  const recurringCount = computed(() => {
    return filteredTableRows.value.filter((item) => item.recurrence !== 'none').length
  })

  const installmentCount = computed(() => {
    return filteredTableRows.value.filter((item) => item.recurrence === 'installment').length
  })

  const formTitle = computed(() => {
    if (model.value.id) {
      return financialType.value === 'expense'
        ? 'Editar despesa futura'
        : 'Editar receita futura'
    }

    return financialType.value === 'expense'
      ? 'Nova despesa futura'
      : 'Nova receita futura'
  })

  const flattenedOptions = computed<CategoryOption[]>(() => {
    const options: CategoryOption[] = []

    categorySelects.value.forEach((cat: CategorySelect) => {
      const hasSub = cat.subCategories && cat.subCategories.length > 0

      if (hasSub) {
        options.push({
          label: cat.name.toLowerCase(),
          pureLabel: cat.name,
          value: cat.id,
          disable: true,
          isSub: false,
          tags: cat.tags,
        })

        cat.subCategories.forEach((sub) => {
          options.push({
            label: `${cat.name} ${sub.name}`.toLowerCase(),
            pureLabel: sub.name,
            value: sub.id,
            isSub: true,
            parentName: cat.name,
            tags: cat.tags,
          })
        })

        return
      }

      options.push({
        label: cat.name.toLowerCase(),
        pureLabel: cat.name,
        value: cat.id,
        isSub: false,
        tags: cat.tags,
      })
    })

    return options
  })

  const filteredCategoryOptions = computed<CategoryOption[]>(() => {
    const needle = searchFilter.value.toLowerCase().trim()

    if (!needle) return flattenedOptions.value

    const parentMatch = categorySelects.value.find((cat: CategorySelect) =>
      cat.name.toLowerCase().includes(needle) && cat.subCategories?.length > 0
    )

    if (parentMatch) {
      return flattenedOptions.value.filter((option) => option.parentName === parentMatch.name)
    }

    return flattenedOptions.value.filter((option) => option.label.includes(needle))
  })

  function filterCategoryOptions(val: string, update: (callback: () => void) => void): void {
    update(() => {
      searchFilter.value = val
    })
  }

  async function loadSchedules() {
    rows.value = await scheduleService.findAll()
  }

  async function loadCategoriesSelect() {
    categorySelects.value = await categoryService.getSelect(financialType.value)
    categorySelectsOriginal.value = categorySelects.value
  }

  async function loadPersonsSelect() {
    personOptions.value = await personService.getSelect()
    personOptionsOriginal.value = personOptions.value
  }

  async function loadTransactionSourceSelect() {
    const [bankAccounts, creditCards] = await Promise.all([
      bankAccountService.getSelect(),
      creditCardService.getSelect(),
    ]);

    bankAccountOptionsOriginal.value = bankAccounts
    creditCardOptionsOriginal.value = creditCards
    transactionSourceOptions.value = bankAccounts
  }

  async function loadInitialData() {
    await Promise.all([
      loadSchedules(),
      loadCategoriesSelect(),
      loadTransactionSourceSelect(),
      loadPersonsSelect(),
    ])
  }

  function newFutureEntry() {
    model.value = createEmptyScheduleForm(financialType.value)
    formDialog.value = true
  }

  async function editRow(id: string) {
    model.value = await scheduleService.findById(id)
    model.value.startingOn = formatDateInput(model.value.startingOn)
    loadTags(true);
    formDialog.value = true
  }

  async function saveSchedule() {
    saving.value = true

    try {
      model.value.amount = Number(model.value.amount)

      if (!model.value.id) {
        await scheduleService.create(ScheduleMapper.toCreate(model.value))
        notify.success('Agendamento criado com sucesso.')
      } else {
        await scheduleService.update(model.value.id, ScheduleMapper.toUpdate(model.value))
        notify.success('Agendamento atualizado com sucesso.')
      }

      await loadSchedules()
      formDialog.value = false
    } finally {
      saving.value = false
    }
  }

  function loadTags(edit = false) {
    if (!edit) {
      model.value.tag = null
    }

    tagOptions.value = []
    tagOptionsOriginal.value = []

    if (!model.value.category) {
      return
    }

    for (const category of categorySelectsOriginal.value) {
      const categoryMatches = category.id === model.value.category
      const subCategoryMatches = category.subCategories?.some((sub) => sub.id === model.value.category)

      if (categoryMatches || subCategoryMatches) {
        tagOptions.value = category.tags.map((tag) => ({
          label: tag,
          value: tag,
        }))

        tagOptionsOriginal.value = tagOptions.value
        return
      }
    }
  }

  function onDelete(id: string) {
    selectedDeleteId.value = id
    deleteDialog.value = true
  }

  async function confirmDelete() {
    if (!selectedDeleteId.value) return

    deleting.value = true

    try {
      await scheduleService.delete(selectedDeleteId.value)
      await loadSchedules()

      deleteDialog.value = false
      formDialog.value = false
      selectedDeleteId.value = null

      notify.success('Agendamento excluido com sucesso.')
    } finally {
      deleting.value = false
    }
  }

  return {
    /* Table */
    columns,
    filter,
    filteredTableRows,
    financialType,
    editRow,

    /* Delete dialog */
    deleteDialog,
    deleting,
    confirmDelete,

    /* Form */
    filteredCategoryOptions,
    bankAccountOptionsOriginal,
    creditCardOptionsOriginal,
    formDialog,
    formTitle,
    model,
    personOptions,
    personOptionsOriginal,
    recurrenceOptions,
    saving,
    tagOptions,
    tagOptionsOriginal,
    transactionSourceOptions,
    loadTags,
    onDelete,
    saveSchedule,
    filterCategoryOptions,

    /* Summary */
    installmentCount,
    pendingCount,
    recurringCount,
    totalAmount,

    /* Principal */
    loadCategoriesSelect,
    loadInitialData,
    newFutureEntry,
  }
}
