import { create } from "zustand";

const initialFormData = {
  judulPekerjaan: "",
  type: "MEAL",
  category: "",
  dropPoint: "",
  supervisor: {
    name: "",
    subBidang: "",
    nomorHp: "",
  },
  pic: {
    name: "",
    nomorHp: "",
  },
  selectedEntities: {
    PLNIP: false,
    IPS: false,
    KOP: false,
    RSU: false,
    MITRA: false,
    OTHER: false,
  },
  entityCounts: {
    PLNIP: 0,
    IPS: 0,
    KOP: 0,
    RSU: 0,
    MITRA: 0,
    OTHER: 0,
  },
  orderType: null,
  employeeOrders: [],
  bulkOrder: {
    menuItemId: "",
    note: "",
  },
};

export const useMealOrderStore = create((set) => ({
  currentStep: 0,
  formData: initialFormData,
  setCurrentStep: (step) => set({ currentStep: step }),
  resetStep: () => set({ currentStep: 0, formData: initialFormData }),
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  toggleEntity: (entity) =>
    set((state) => ({
      formData: {
        ...state.formData,
        selectedEntities: {
          ...state.formData.selectedEntities,
          [entity]: !state.formData.selectedEntities[entity],
        },
        // Reset employee orders when toggling entity
        employeeOrders: state.formData.employeeOrders.filter(
          (order) => order.entity !== entity
        ),
      },
    })),
  updateEntityCount: (entity, count) =>
    set((state) => ({
      formData: {
        ...state.formData,
        entityCounts: {
          ...state.formData.entityCounts,
          [entity]: count,
        },
        // Reset employee orders when changing count
        employeeOrders: state.formData.employeeOrders.filter(
          (order) => order.entity !== entity
        ),
      },
    })),
  setOrderType: (type) =>
    set((state) => ({
      formData: {
        ...state.formData,
        orderType: type,
        // Reset orders when changing type
        employeeOrders: [],
        bulkOrder: {
          menuItemId: "",
          note: "",
        },
      },
    })),
  updateEmployeeOrders: (orders) =>
    set((state) => ({
      formData: {
        ...state.formData,
        employeeOrders: orders,
      },
    })),
  updateBulkOrder: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        bulkOrder: { ...state.formData.bulkOrder, ...data },
      },
    })),
  updatePIC: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        pic: { ...state.formData.pic, ...data },
      },
    })),
  updateSupervisor: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        supervisor: { ...state.formData.supervisor, ...data },
      },
    })),
}));

export const isDetailStepValid = (formData) => {
  return (
    formData.category !== "" &&
    formData.judulPekerjaan.trim() !== "" &&
    formData.dropPoint.trim() !== "" &&
    formData.pic.name.trim() !== "" &&
    formData.pic.nomorHp.trim() !== "" &&
    formData.supervisor.name.trim() !== "" &&
    formData.supervisor.nomorHp.trim() !== "" &&
    formData.supervisor.subBidang.trim() !== ""
  );
};

export const isPemesanStepValid = (formData) => {
  const hasSelectedEntities = Object.values(formData.selectedEntities).some(
    (isSelected) => isSelected
  );
  const hasValidCounts = Object.entries(formData.selectedEntities).every(
    ([entity, isSelected]) => !isSelected || formData.entityCounts[entity] > 0
  );
  return hasSelectedEntities && hasValidCounts;
};

export const isMenuStepValid = (formData) => {
  if (formData.orderType === "bulk") {
    return formData.bulkOrder.menuItemId.trim() !== "";
  } else if (formData.orderType === "detail") {
    // Check if each selected entity has the correct number of orders
    return Object.entries(formData.selectedEntities)
      .filter(([entity, isSelected]) => isSelected)
      .every(([entity]) => {
        const orders = formData.employeeOrders.filter(
          (o) => o.entity === entity
        );
        return (
          orders.length === formData.entityCounts[entity] &&
          orders.every(
            (order) =>
              order.employeeName?.trim() && order.items?.[0]?.menuItemId?.trim()
          )
        );
      });
  }
  return false;
};
