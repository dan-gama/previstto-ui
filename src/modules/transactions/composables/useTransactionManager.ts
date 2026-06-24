import { computed, ref } from 'vue'
import type { QTableColumn } from 'quasar'
import { FinancialType } from '@/shared/domain/types/FinancialType'
import { TransactionForm, TransactionItem } from '../models/transaction.model'
import { transactionService } from '../services/transaction.service'

const createEmptyTransactionForm = (type: FinancialType): TransactionForm => ({
  id: null,
  type,
  sourceId: '',
  destinationId: '',
  tag: null,
  transactionDate: null,
  dueDate: null,
  paymentDate: null,
  status: 'paid',
  description: null,
  installment: null,
  amount: 0,
  person: null,
})

export function useTransactionManager() {
  const financialType = ref<FinancialType>('expense')
  const filter = ref('')
  const rows = ref<TransactionItem[]>([])

  const model = ref<TransactionForm>(createEmptyTransactionForm(financialType.value))

  const columns: QTableColumn[] = [
    { name: 'description', label: 'Descrição', field: 'description', align: 'left', sortable: true },
    { name: 'amount', label: 'Valor', field: 'amount', align: 'left', sortable: true },
    { name: 'status', label: 'Status', field: 'status', align: 'left' },
    { name: 'actions', label: 'Acoes', field: 'actions', align: 'center', sortable: false },
  ]

  const filteredTableRows = computed(() => {
    return rows.value.filter((item) => item.type === financialType.value)
  })

  async function loadTransactions() {
    rows.value = await transactionService.findAll()
  }

  async function loadInitialData() {
    await Promise.all([
      loadTransactions()
    ])
  }

  async function editRow(id: string) {
    model.value = await transactionService.findById(id)
    //model.value.startingOn = formatDateInput(model.value.startingOn)
  }

  return {
    /* Table */
    columns,
    filter,
    filteredTableRows,
    financialType,
    editRow,

    /* Delete dialog */
    // deleteDialog,
    // deleting,
    // confirmDelete,

    /* Form */
    // filteredCategoryOptions,
    // bankAccountOptionsOriginal,
    // creditCardOptionsOriginal,
    // formDialog,
    // formTitle,
    model,
    // personOptions,
    // personOptionsOriginal,
    // recurrenceOptions,
    // saving,
    // tagOptions,
    // tagOptionsOriginal,
    // transactionSourceOptions,
    // loadTags,
    // onDelete,
    // saveSchedule,
    // filterCategoryOptions,

    /* Summary */
    // installmentCount,
    // pendingCount,
    // recurringCount,
    // totalAmount,

    /* Principal */
    // loadCategoriesSelect,
    loadInitialData,
    // newEntry,
  }
}
