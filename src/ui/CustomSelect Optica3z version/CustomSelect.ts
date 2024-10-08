import BaseSelect from './BaseSelect/BaseSelect'
import SingleSelect from './SingleSelect/SingleSelect'
import MultipleSelect from './MultipleSelect/MultipleSelect'
import FilterSelect from './FilterSelect/FilterSelect'

export default class CustomSelect {
  static selectsMap = new Map<HTMLElement, BaseSelect>()

  static selectClasses = {
    single: SingleSelect,
    multiple: MultipleSelect,
    filter: FilterSelect
  }

  static closeAllSelects() {
    CustomSelect.selectsMap.forEach((select) => {
      select.handleCloseSelect()
    })
  }

  static resetCustomSelect(select: HTMLElement) {
    const selectInstance = this.getSelectInstance(select)
    selectInstance.resetSelect()
  }

  static initCustomSelect() {
    document
      .querySelectorAll('[data-select]')
      .forEach((select: HTMLElement) => {
        CustomSelect.selectsMap.set(select, this.getSelectInstance(select))
      })
  }

  static getSelectInstance(parent: HTMLElement): BaseSelect {
    const selectInstance = CustomSelect.selectsMap.get(parent)
    if (selectInstance) return selectInstance

    const selectType = parent.dataset.selectType
    const SelectClass =
      this.selectClasses[selectType as keyof typeof this.selectClasses]
    return new SelectClass(parent)
  }
}

window.initCustomSelect = CustomSelect.initCustomSelect
