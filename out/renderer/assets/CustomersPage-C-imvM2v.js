import { Bi as createVNode, Ca as reactive, Di as withKeys, Fi as createBlock, G as ElInput, Ii as createCommentVNode, Ka as toDisplayString, Li as createElementBlock, M as ElButton, Na as unref, Ni as computed, Pi as createBaseVNode, S as ElOption, Ta as ref, Vi as defineComponent, _ as ElDescriptions, a as vLoading, c as ElTableColumn, d as ElDialog, dt as ElIcon, ea as onMounted, ga as withDirectives, ha as withCtx, i as ElMessage, k as ElTag, n as api, pa as watch, r as ElMessageBox, ra as openBlock, s as ElTable, sa as resolveComponent, t as _plugin_vue_export_helper_default, u as ElPagination, v as ElDescriptionsItem, w as ElSelect, zi as createTextVNode } from "./css-C8sLGSMG.js";
import { i as ElAlert, n as ElForm, r as ElFormItem, t as useAppStore } from "./css-FW2B8AwG.js";
import { i as ElRadioGroup, n as ElRadio, t as ElSwitch } from "./css-Cm8xdbuv.js";
import "./css-DSzxzpYd.js";
//#region src/renderer/pages/customers/components/CustomersToolbar.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$5 = { class: "customers-toolbar" };
var _hoisted_2$2 = { class: "toolbar-filters" };
var _hoisted_3$2 = { class: "toolbar-actions" };
//#endregion
//#region src/renderer/pages/customers/components/CustomersToolbar.vue
var CustomersToolbar_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "CustomersToolbar",
	props: {
		keyword: {},
		status: {},
		dataCompleteness: {}
	},
	emits: [
		"update:keyword",
		"update:status",
		"update:dataCompleteness",
		"search",
		"reset",
		"refresh",
		"add",
		"initial-import"
	],
	setup(__props) {
		const appStore = useAppStore();
		return (_ctx, _cache) => {
			const _component_ElInput = ElInput;
			const _component_ElOption = ElOption;
			const _component_ElSelect = ElSelect;
			const _component_ElButton = ElButton;
			const _component_Plus = resolveComponent("Plus");
			const _component_ElIcon = ElIcon;
			const _component_Upload = resolveComponent("Upload");
			return openBlock(), createElementBlock("div", _hoisted_1$5, [createBaseVNode("div", _hoisted_2$2, [
				createVNode(_component_ElInput, {
					"model-value": __props.keyword,
					placeholder: "客户名称、简码、税号、电话、银行账号",
					clearable: "",
					style: { "width": "300px" },
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:keyword", $event)),
					onKeyup: _cache[1] || (_cache[1] = withKeys(($event) => _ctx.$emit("search"), ["enter"]))
				}, null, 8, ["model-value"]),
				createVNode(_component_ElSelect, {
					"model-value": __props.status,
					placeholder: "客户状态",
					style: { "width": "120px" },
					"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => _ctx.$emit("update:status", $event))
				}, {
					default: withCtx(() => [
						createVNode(_component_ElOption, {
							label: "全部",
							value: "all"
						}),
						createVNode(_component_ElOption, {
							label: "启用",
							value: "active"
						}),
						createVNode(_component_ElOption, {
							label: "停用",
							value: "inactive"
						})
					]),
					_: 1
				}, 8, ["model-value"]),
				createVNode(_component_ElSelect, {
					"model-value": __props.dataCompleteness,
					placeholder: "资料完整度",
					style: { "width": "140px" },
					"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => _ctx.$emit("update:dataCompleteness", $event))
				}, {
					default: withCtx(() => [
						createVNode(_component_ElOption, {
							label: "全部",
							value: "all"
						}),
						createVNode(_component_ElOption, {
							label: "完整",
							value: "complete"
						}),
						createVNode(_component_ElOption, {
							label: "待补",
							value: "incomplete"
						})
					]),
					_: 1
				}, 8, ["model-value"]),
				createVNode(_component_ElButton, {
					type: "primary",
					onClick: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("search"))
				}, {
					default: withCtx(() => [..._cache[9] || (_cache[9] = [createTextVNode("搜索", -1)])]),
					_: 1
				}),
				createVNode(_component_ElButton, { onClick: _cache[5] || (_cache[5] = ($event) => _ctx.$emit("reset")) }, {
					default: withCtx(() => [..._cache[10] || (_cache[10] = [createTextVNode("重置", -1)])]),
					_: 1
				}),
				createVNode(_component_ElButton, {
					style: { "margin-left": "auto" },
					onClick: _cache[6] || (_cache[6] = ($event) => _ctx.$emit("refresh"))
				}, {
					default: withCtx(() => [..._cache[11] || (_cache[11] = [createTextVNode("刷新", -1)])]),
					_: 1
				})
			]), createBaseVNode("div", _hoisted_3$2, [createVNode(_component_ElButton, {
				type: "success",
				onClick: _cache[7] || (_cache[7] = ($event) => _ctx.$emit("add"))
			}, {
				default: withCtx(() => [createVNode(_component_ElIcon, null, {
					default: withCtx(() => [createVNode(_component_Plus)]),
					_: 1
				}), _cache[12] || (_cache[12] = createTextVNode("新增客户 ", -1))]),
				_: 1
			}), !unref(appStore).customerImportDone ? (openBlock(), createBlock(_component_ElButton, {
				key: 0,
				type: "warning",
				onClick: _cache[8] || (_cache[8] = ($event) => _ctx.$emit("initial-import"))
			}, {
				default: withCtx(() => [createVNode(_component_ElIcon, null, {
					default: withCtx(() => [createVNode(_component_Upload)]),
					_: 1
				}), _cache[13] || (_cache[13] = createTextVNode("客户首次导入 ", -1))]),
				_: 1
			})) : createCommentVNode("", true)])]);
		};
	}
}), [["__scopeId", "data-v-19295959"]]);
//#endregion
//#region src/renderer/pages/customers/components/CustomersTable.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$4 = { class: "table-container" };
var _hoisted_2$1 = { key: 1 };
var _hoisted_3$1 = { class: "pagination-container" };
//#endregion
//#region src/renderer/pages/customers/components/CustomersTable.vue
var CustomersTable_default = /* @__PURE__ */ defineComponent({
	__name: "CustomersTable",
	props: {
		rows: {},
		loading: { type: Boolean },
		page: {},
		pageSize: {},
		total: {}
	},
	emits: [
		"view",
		"edit",
		"toggle-status",
		"history",
		"page-change",
		"size-change"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const currentPage = computed({
			get: () => props.page,
			set: (val) => {}
		});
		const currentPageSize = computed({
			get: () => props.pageSize,
			set: (val) => {}
		});
		const tableMaxHeight = ref(600);
		function formatTime(iso) {
			try {
				return new Date(iso).toLocaleString("zh-CN");
			} catch {
				return iso;
			}
		}
		return (_ctx, _cache) => {
			const _component_ElTableColumn = ElTableColumn;
			const _component_ElTag = ElTag;
			const _component_ElButton = ElButton;
			const _component_ElTable = ElTable;
			const _component_ElPagination = ElPagination;
			const _directive_loading = vLoading;
			return openBlock(), createElementBlock("div", _hoisted_1$4, [withDirectives((openBlock(), createBlock(_component_ElTable, {
				data: __props.rows,
				border: "",
				stripe: "",
				size: "default",
				style: { "width": "100%" },
				"max-height": tableMaxHeight.value
			}, {
				default: withCtx(() => [
					createVNode(_component_ElTableColumn, {
						prop: "name",
						label: "客户名称",
						"min-width": "150",
						"show-overflow-tooltip": ""
					}),
					createVNode(_component_ElTableColumn, {
						prop: "taxId",
						label: "纳税人识别号",
						"min-width": "180",
						"show-overflow-tooltip": ""
					}),
					createVNode(_component_ElTableColumn, {
						prop: "shortCode",
						label: "简码",
						width: "100"
					}),
					createVNode(_component_ElTableColumn, {
						prop: "address",
						label: "地址",
						"min-width": "200",
						"show-overflow-tooltip": ""
					}),
					createVNode(_component_ElTableColumn, {
						prop: "phone",
						label: "电话",
						width: "130",
						"show-overflow-tooltip": ""
					}),
					createVNode(_component_ElTableColumn, {
						prop: "bankName",
						label: "开户行",
						"min-width": "150",
						"show-overflow-tooltip": ""
					}),
					createVNode(_component_ElTableColumn, {
						prop: "bankAccount",
						label: "银行账号",
						"min-width": "160",
						"show-overflow-tooltip": ""
					}),
					createVNode(_component_ElTableColumn, {
						prop: "email",
						label: "邮箱",
						"min-width": "150",
						"show-overflow-tooltip": ""
					}),
					createVNode(_component_ElTableColumn, {
						prop: "isDefaultAddress",
						label: "默认地址",
						width: "90",
						align: "center"
					}, {
						default: withCtx(({ row }) => [row.isDefaultAddress ? (openBlock(), createBlock(_component_ElTag, {
							key: 0,
							type: "success",
							size: "small"
						}, {
							default: withCtx(() => [..._cache[4] || (_cache[4] = [createTextVNode("是", -1)])]),
							_: 1
						})) : (openBlock(), createElementBlock("span", _hoisted_2$1, "否"))]),
						_: 1
					}),
					createVNode(_component_ElTableColumn, {
						prop: "status",
						label: "状态",
						width: "80",
						align: "center"
					}, {
						default: withCtx(({ row }) => [createVNode(_component_ElTag, {
							type: row.status === "active" ? "success" : "danger",
							size: "small"
						}, {
							default: withCtx(() => [createTextVNode(toDisplayString(row.status === "active" ? "启用" : "停用"), 1)]),
							_: 2
						}, 1032, ["type"])]),
						_: 1
					}),
					createVNode(_component_ElTableColumn, {
						prop: "updatedAt",
						label: "最近更新",
						width: "160"
					}, {
						default: withCtx(({ row }) => [createTextVNode(toDisplayString(formatTime(row.updatedAt)), 1)]),
						_: 1
					}),
					createVNode(_component_ElTableColumn, {
						label: "操作",
						width: "240",
						fixed: "right"
					}, {
						default: withCtx(({ row }) => [
							createVNode(_component_ElButton, {
								link: "",
								type: "primary",
								size: "small",
								onClick: ($event) => _ctx.$emit("view", row)
							}, {
								default: withCtx(() => [..._cache[5] || (_cache[5] = [createTextVNode("查看", -1)])]),
								_: 1
							}, 8, ["onClick"]),
							createVNode(_component_ElButton, {
								link: "",
								type: "primary",
								size: "small",
								onClick: ($event) => _ctx.$emit("edit", row)
							}, {
								default: withCtx(() => [..._cache[6] || (_cache[6] = [createTextVNode("编辑", -1)])]),
								_: 1
							}, 8, ["onClick"]),
							createVNode(_component_ElButton, {
								link: "",
								type: row.status === "active" ? "warning" : "success",
								size: "small",
								onClick: ($event) => _ctx.$emit("toggle-status", row)
							}, {
								default: withCtx(() => [createTextVNode(toDisplayString(row.status === "active" ? "停用" : "恢复"), 1)]),
								_: 2
							}, 1032, ["type", "onClick"]),
							createVNode(_component_ElButton, {
								link: "",
								type: "info",
								size: "small",
								onClick: ($event) => _ctx.$emit("history", row)
							}, {
								default: withCtx(() => [..._cache[7] || (_cache[7] = [createTextVNode("历史", -1)])]),
								_: 1
							}, 8, ["onClick"])
						]),
						_: 1
					})
				]),
				_: 1
			}, 8, ["data", "max-height"])), [[_directive_loading, __props.loading]]), createBaseVNode("div", _hoisted_3$1, [createVNode(_component_ElPagination, {
				"current-page": currentPage.value,
				"onUpdate:currentPage": _cache[0] || (_cache[0] = ($event) => currentPage.value = $event),
				"page-size": currentPageSize.value,
				"onUpdate:pageSize": _cache[1] || (_cache[1] = ($event) => currentPageSize.value = $event),
				total: __props.total,
				"page-sizes": [
					20,
					50,
					100
				],
				layout: "total, sizes, prev, pager, next, jumper",
				onCurrentChange: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("page-change", $event)),
				onSizeChange: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("size-change", $event))
			}, null, 8, [
				"current-page",
				"page-size",
				"total"
			])])]);
		};
	}
});
//#endregion
//#region src/renderer/pages/customers/modals/CustomerFormDialog.vue
var CustomerFormDialog_default = /* @__PURE__ */ defineComponent({
	__name: "CustomerFormDialog",
	props: {
		visible: { type: Boolean },
		customer: {}
	},
	emits: ["close", "saved"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const formRef = ref();
		const saving = ref(false);
		const formChanged = ref(false);
		const form = reactive({
			id: void 0,
			name: "",
			taxId: "",
			shortCode: "",
			address: "",
			phone: "",
			bankName: "",
			bankAccount: "",
			email: "",
			isDefaultAddress: false,
			status: "active"
		});
		const rules = {
			name: [{
				required: true,
				message: "请输入客户名称",
				trigger: "blur"
			}],
			taxId: [{
				required: true,
				message: "请输入纳税人识别号",
				trigger: "blur"
			}],
			email: [{
				type: "email",
				message: "邮箱格式不正确",
				trigger: "blur"
			}]
		};
		watch(() => props.visible, (val) => {
			if (val) {
				if (props.customer) Object.assign(form, props.customer);
				else Object.assign(form, {
					id: void 0,
					name: "",
					taxId: "",
					shortCode: "",
					address: "",
					phone: "",
					bankName: "",
					bankAccount: "",
					email: "",
					isDefaultAddress: false,
					status: "active"
				});
				formChanged.value = false;
			}
		}, { immediate: true });
		watch(form, () => {
			formChanged.value = true;
		}, { deep: true });
		async function handleSave() {
			if (!formRef.value) return;
			try {
				await formRef.value.validate();
				saving.value = true;
				if (form.id) await api.customers.update(form);
				else await api.customers.create(form);
				ElMessage.success("保存成功");
				emit("saved");
			} catch (err) {
				ElMessage.error(`保存失败: ${err.message}`);
			} finally {
				saving.value = false;
			}
		}
		function handleCancel() {
			emit("close");
		}
		function handleBeforeClose(done) {
			if (formChanged.value) ElMessageBox.confirm("存在未保存的更改，确认放弃？", "提示", { type: "warning" }).then(() => done()).catch(() => {});
			else done();
		}
		return (_ctx, _cache) => {
			const _component_ElInput = ElInput;
			const _component_ElFormItem = ElFormItem;
			const _component_ElSwitch = ElSwitch;
			const _component_ElRadio = ElRadio;
			const _component_ElRadioGroup = ElRadioGroup;
			const _component_ElForm = ElForm;
			const _component_ElButton = ElButton;
			const _component_ElDialog = ElDialog;
			return openBlock(), createBlock(_component_ElDialog, {
				"model-value": __props.visible,
				title: "客户信息",
				width: "760px",
				"close-on-click-modal": false,
				"before-close": handleBeforeClose,
				onClose: _cache[10] || (_cache[10] = ($event) => _ctx.$emit("close"))
			}, {
				footer: withCtx(() => [createVNode(_component_ElButton, { onClick: handleCancel }, {
					default: withCtx(() => [..._cache[13] || (_cache[13] = [createTextVNode("取消", -1)])]),
					_: 1
				}), createVNode(_component_ElButton, {
					type: "primary",
					loading: saving.value,
					onClick: handleSave
				}, {
					default: withCtx(() => [..._cache[14] || (_cache[14] = [createTextVNode("保存", -1)])]),
					_: 1
				}, 8, ["loading"])]),
				default: withCtx(() => [createVNode(_component_ElForm, {
					ref_key: "formRef",
					ref: formRef,
					model: form,
					rules,
					"label-width": "120px",
					"label-position": "right"
				}, {
					default: withCtx(() => [
						createVNode(_component_ElFormItem, {
							label: "客户名称",
							prop: "name",
							required: ""
						}, {
							default: withCtx(() => [createVNode(_component_ElInput, {
								modelValue: form.name,
								"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.name = $event),
								maxlength: "100"
							}, null, 8, ["modelValue"])]),
							_: 1
						}),
						createVNode(_component_ElFormItem, {
							label: "纳税人识别号",
							prop: "taxId",
							required: ""
						}, {
							default: withCtx(() => [createVNode(_component_ElInput, {
								modelValue: form.taxId,
								"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.taxId = $event)
							}, null, 8, ["modelValue"])]),
							_: 1
						}),
						createVNode(_component_ElFormItem, {
							label: "简码",
							prop: "shortCode"
						}, {
							default: withCtx(() => [createVNode(_component_ElInput, {
								modelValue: form.shortCode,
								"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.shortCode = $event)
							}, null, 8, ["modelValue"])]),
							_: 1
						}),
						createVNode(_component_ElFormItem, {
							label: "地址",
							prop: "address"
						}, {
							default: withCtx(() => [createVNode(_component_ElInput, {
								modelValue: form.address,
								"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.address = $event)
							}, null, 8, ["modelValue"])]),
							_: 1
						}),
						createVNode(_component_ElFormItem, {
							label: "电话",
							prop: "phone"
						}, {
							default: withCtx(() => [createVNode(_component_ElInput, {
								modelValue: form.phone,
								"onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.phone = $event)
							}, null, 8, ["modelValue"])]),
							_: 1
						}),
						createVNode(_component_ElFormItem, {
							label: "开户行名称",
							prop: "bankName"
						}, {
							default: withCtx(() => [createVNode(_component_ElInput, {
								modelValue: form.bankName,
								"onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => form.bankName = $event)
							}, null, 8, ["modelValue"])]),
							_: 1
						}),
						createVNode(_component_ElFormItem, {
							label: "银行账号",
							prop: "bankAccount"
						}, {
							default: withCtx(() => [createVNode(_component_ElInput, {
								modelValue: form.bankAccount,
								"onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => form.bankAccount = $event)
							}, null, 8, ["modelValue"])]),
							_: 1
						}),
						createVNode(_component_ElFormItem, {
							label: "联系邮箱",
							prop: "email"
						}, {
							default: withCtx(() => [createVNode(_component_ElInput, {
								modelValue: form.email,
								"onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => form.email = $event)
							}, null, 8, ["modelValue"])]),
							_: 1
						}),
						createVNode(_component_ElFormItem, { label: "是否默认地址" }, {
							default: withCtx(() => [createVNode(_component_ElSwitch, {
								modelValue: form.isDefaultAddress,
								"onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => form.isDefaultAddress = $event)
							}, null, 8, ["modelValue"])]),
							_: 1
						}),
						createVNode(_component_ElFormItem, { label: "状态" }, {
							default: withCtx(() => [createVNode(_component_ElRadioGroup, {
								modelValue: form.status,
								"onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => form.status = $event)
							}, {
								default: withCtx(() => [createVNode(_component_ElRadio, { value: "active" }, {
									default: withCtx(() => [..._cache[11] || (_cache[11] = [createTextVNode("启用", -1)])]),
									_: 1
								}), createVNode(_component_ElRadio, { value: "inactive" }, {
									default: withCtx(() => [..._cache[12] || (_cache[12] = [createTextVNode("停用", -1)])]),
									_: 1
								})]),
								_: 1
							}, 8, ["modelValue"])]),
							_: 1
						})
					]),
					_: 1
				}, 8, ["model"])]),
				_: 1
			}, 8, ["model-value"]);
		};
	}
});
//#endregion
//#region src/renderer/pages/customers/modals/CustomerDetailDialog.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$3 = {
	key: 0,
	class: "detail-content"
};
//#endregion
//#region src/renderer/pages/customers/modals/CustomerDetailDialog.vue
var CustomerDetailDialog_default = /* @__PURE__ */ defineComponent({
	__name: "CustomerDetailDialog",
	props: {
		visible: { type: Boolean },
		customer: {}
	},
	emits: ["close"],
	setup(__props) {
		function formatTime(iso) {
			try {
				return new Date(iso).toLocaleString("zh-CN");
			} catch {
				return iso;
			}
		}
		return (_ctx, _cache) => {
			const _component_ElDescriptionsItem = ElDescriptionsItem;
			const _component_ElTag = ElTag;
			const _component_ElDescriptions = ElDescriptions;
			const _component_ElButton = ElButton;
			const _component_ElDialog = ElDialog;
			return openBlock(), createBlock(_component_ElDialog, {
				"model-value": __props.visible,
				title: "客户详情",
				width: "760px",
				onClose: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("close"))
			}, {
				footer: withCtx(() => [createVNode(_component_ElButton, { onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close")) }, {
					default: withCtx(() => [..._cache[2] || (_cache[2] = [createTextVNode("关闭", -1)])]),
					_: 1
				})]),
				default: withCtx(() => [__props.customer ? (openBlock(), createElementBlock("div", _hoisted_1$3, [createVNode(_component_ElDescriptions, {
					column: 2,
					border: ""
				}, {
					default: withCtx(() => [
						createVNode(_component_ElDescriptionsItem, { label: "客户名称" }, {
							default: withCtx(() => [createTextVNode(toDisplayString(__props.customer.name), 1)]),
							_: 1
						}),
						createVNode(_component_ElDescriptionsItem, { label: "纳税人识别号" }, {
							default: withCtx(() => [createTextVNode(toDisplayString(__props.customer.taxId), 1)]),
							_: 1
						}),
						createVNode(_component_ElDescriptionsItem, { label: "简码" }, {
							default: withCtx(() => [createTextVNode(toDisplayString(__props.customer.shortCode || "-"), 1)]),
							_: 1
						}),
						createVNode(_component_ElDescriptionsItem, { label: "地址" }, {
							default: withCtx(() => [createTextVNode(toDisplayString(__props.customer.address || "-"), 1)]),
							_: 1
						}),
						createVNode(_component_ElDescriptionsItem, { label: "电话" }, {
							default: withCtx(() => [createTextVNode(toDisplayString(__props.customer.phone || "-"), 1)]),
							_: 1
						}),
						createVNode(_component_ElDescriptionsItem, { label: "开户行" }, {
							default: withCtx(() => [createTextVNode(toDisplayString(__props.customer.bankName || "-"), 1)]),
							_: 1
						}),
						createVNode(_component_ElDescriptionsItem, { label: "银行账号" }, {
							default: withCtx(() => [createTextVNode(toDisplayString(__props.customer.bankAccount || "-"), 1)]),
							_: 1
						}),
						createVNode(_component_ElDescriptionsItem, { label: "邮箱" }, {
							default: withCtx(() => [createTextVNode(toDisplayString(__props.customer.email || "-"), 1)]),
							_: 1
						}),
						createVNode(_component_ElDescriptionsItem, { label: "默认地址" }, {
							default: withCtx(() => [createTextVNode(toDisplayString(__props.customer.isDefaultAddress ? "是" : "否"), 1)]),
							_: 1
						}),
						createVNode(_component_ElDescriptionsItem, { label: "状态" }, {
							default: withCtx(() => [createVNode(_component_ElTag, {
								type: __props.customer.status === "active" ? "success" : "danger",
								size: "small"
							}, {
								default: withCtx(() => [createTextVNode(toDisplayString(__props.customer.status === "active" ? "启用" : "停用"), 1)]),
								_: 1
							}, 8, ["type"])]),
							_: 1
						}),
						createVNode(_component_ElDescriptionsItem, { label: "最近更新" }, {
							default: withCtx(() => [createTextVNode(toDisplayString(formatTime(__props.customer.updatedAt)), 1)]),
							_: 1
						})
					]),
					_: 1
				})])) : createCommentVNode("", true)]),
				_: 1
			}, 8, ["model-value"]);
		};
	}
});
//#endregion
//#region src/renderer/pages/customers/modals/CustomerHistoryDialog.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$2 = { class: "pagination-container" };
//#endregion
//#region src/renderer/pages/customers/modals/CustomerHistoryDialog.vue
var CustomerHistoryDialog_default = /* @__PURE__ */ defineComponent({
	__name: "CustomerHistoryDialog",
	props: {
		visible: { type: Boolean },
		entityId: {}
	},
	emits: ["close"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const dialogVisible = computed({
			get: () => props.visible,
			set: () => emit("close")
		});
		const loading = ref(false);
		const rows = ref([]);
		const total = ref(0);
		const page = ref(1);
		const pageSize = ref(50);
		/** 字段路径中文映射 */
		const FIELD_LABELS = {
			status: "启用状态",
			name: "客户名称",
			taxId: "纳税人识别号",
			shortCode: "简码",
			address: "地址",
			phone: "电话",
			bankName: "开户行",
			bankAccount: "银行账号",
			email: "邮箱",
			isDefaultAddress: "是否默认地址"
		};
		function fieldLabel(path) {
			if (path === "*") return "-";
			return FIELD_LABELS[path] ?? path;
		}
		watch(() => props.visible, (val) => {
			if (val && props.entityId) {
				page.value = 1;
				loadData();
			}
		}, { immediate: true });
		async function loadData() {
			loading.value = true;
			try {
				const result = await api.customers.history({
					entityType: "customer",
					entityId: props.entityId,
					page: page.value,
					pageSize: pageSize.value
				});
				rows.value = result.rows;
				total.value = result.total;
			} catch (err) {
				ElMessage.error(`加载失败: ${err.message}`);
			} finally {
				loading.value = false;
			}
		}
		function formatTime(iso) {
			if (!iso) return "-";
			const d = new Date(iso);
			if (isNaN(d.getTime())) return iso;
			return d.toLocaleString("zh-CN");
		}
		return (_ctx, _cache) => {
			const _component_ElTableColumn = ElTableColumn;
			const _component_ElTable = ElTable;
			const _component_ElPagination = ElPagination;
			const _component_ElButton = ElButton;
			const _component_ElDialog = ElDialog;
			const _directive_loading = vLoading;
			return openBlock(), createBlock(_component_ElDialog, {
				modelValue: dialogVisible.value,
				"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => dialogVisible.value = $event),
				title: "字段历史",
				width: "90vw",
				top: "5vh",
				"destroy-on-close": "",
				onClose: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("close"))
			}, {
				footer: withCtx(() => [createVNode(_component_ElButton, { onClick: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("close")) }, {
					default: withCtx(() => [..._cache[5] || (_cache[5] = [createTextVNode("关闭", -1)])]),
					_: 1
				})]),
				default: withCtx(() => [withDirectives((openBlock(), createBlock(_component_ElTable, {
					data: rows.value,
					border: "",
					stripe: "",
					size: "small",
					"max-height": "500"
				}, {
					default: withCtx(() => [
						createVNode(_component_ElTableColumn, {
							prop: "createdAt",
							label: "变更时间",
							width: "180"
						}, {
							default: withCtx(({ row }) => [createTextVNode(toDisplayString(formatTime(row.createdAt)), 1)]),
							_: 1
						}),
						createVNode(_component_ElTableColumn, {
							label: "操作摘要",
							"min-width": "220",
							"show-overflow-tooltip": ""
						}, {
							default: withCtx(({ row }) => [createTextVNode(toDisplayString(row.summary || "-"), 1)]),
							_: 1
						}),
						createVNode(_component_ElTableColumn, {
							label: "字段",
							width: "130"
						}, {
							default: withCtx(({ row }) => [createTextVNode(toDisplayString(fieldLabel(row.fieldPath)), 1)]),
							_: 1
						}),
						createVNode(_component_ElTableColumn, {
							label: "变更前",
							"min-width": "150",
							"show-overflow-tooltip": ""
						}, {
							default: withCtx(({ row }) => [createTextVNode(toDisplayString(row.oldValue ?? "-"), 1)]),
							_: 1
						}),
						createVNode(_component_ElTableColumn, {
							label: "变更后",
							"min-width": "150",
							"show-overflow-tooltip": ""
						}, {
							default: withCtx(({ row }) => [createTextVNode(toDisplayString(row.newValue ?? "-"), 1)]),
							_: 1
						})
					]),
					_: 1
				}, 8, ["data"])), [[_directive_loading, loading.value]]), createBaseVNode("div", _hoisted_1$2, [createVNode(_component_ElPagination, {
					"current-page": page.value,
					"onUpdate:currentPage": _cache[0] || (_cache[0] = ($event) => page.value = $event),
					"page-size": pageSize.value,
					"onUpdate:pageSize": _cache[1] || (_cache[1] = ($event) => pageSize.value = $event),
					total: total.value,
					"page-sizes": [
						20,
						50,
						100
					],
					layout: "total, sizes, prev, pager, next",
					onCurrentChange: loadData,
					onSizeChange: loadData
				}, null, 8, [
					"current-page",
					"page-size",
					"total"
				])])]),
				_: 1
			}, 8, ["modelValue"]);
		};
	}
});
//#endregion
//#region src/renderer/pages/customers/modals/CustomerModalHost.vue
var CustomerModalHost_default = /* @__PURE__ */ defineComponent({
	__name: "CustomerModalHost",
	props: {
		modalType: {},
		editingCustomer: {},
		viewingCustomer: {},
		historyEntityId: {}
	},
	emits: ["update:modalType", "saved"],
	setup(__props, { emit: __emit }) {
		const emit = __emit;
		function handleClose() {
			emit("update:modalType", "none");
		}
		function handleSaved() {
			emit("saved");
			handleClose();
		}
		return (_ctx, _cache) => {
			return __props.modalType === "form" ? (openBlock(), createBlock(CustomerFormDialog_default, {
				key: 0,
				visible: __props.modalType === "form",
				customer: __props.editingCustomer,
				onClose: handleClose,
				onSaved: handleSaved
			}, null, 8, ["visible", "customer"])) : __props.modalType === "detail" ? (openBlock(), createBlock(CustomerDetailDialog_default, {
				key: 1,
				visible: __props.modalType === "detail",
				customer: __props.viewingCustomer,
				onClose: handleClose
			}, null, 8, ["visible", "customer"])) : __props.modalType === "history" ? (openBlock(), createBlock(CustomerHistoryDialog_default, {
				key: 2,
				visible: __props.modalType === "history",
				"entity-id": __props.historyEntityId,
				onClose: handleClose
			}, null, 8, ["visible", "entity-id"])) : createCommentVNode("", true);
		};
	}
});
//#endregion
//#region src/renderer/pages/customers/modals/CustomerInitialImportDialog.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$1 = { class: "import-content" };
var _hoisted_2 = {
	key: 0,
	class: "step-content"
};
var _hoisted_3 = { class: "file-actions" };
var _hoisted_4 = {
	key: 1,
	class: "step-content"
};
var _hoisted_5 = { class: "preview-summary" };
var _hoisted_6 = { class: "error-text" };
var _hoisted_7 = {
	key: 2,
	class: "step-content"
};
//#endregion
//#region src/renderer/pages/customers/modals/CustomerInitialImportDialog.vue
var CustomerInitialImportDialog_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "CustomerInitialImportDialog",
	props: { visible: { type: Boolean } },
	emits: ["update:visible", "success"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const dialogVisible = computed({
			get: () => props.visible,
			set: (val) => emit("update:visible", val)
		});
		const step = ref("select");
		const preview = ref(null);
		const previewToken = ref("");
		const importing = ref(false);
		const selecting = ref(false);
		async function handleDownloadTemplate() {
			try {
				if ((await api.customers.downloadTemplate()).saved) ElMessage.success("模板已保存");
			} catch (err) {
				ElMessage.error(`下载失败: ${err.message}`);
			}
		}
		async function handleSelectFile() {
			selecting.value = true;
			try {
				const result = await api.system.selectFile({
					extensions: ["xlsx"],
					title: "选择客户导入文件"
				});
				if (result.canceled || !result.filePath) return;
				const previewResult = await api.customers.initialImportPreview(result.filePath);
				preview.value = previewResult.preview;
				previewToken.value = previewResult.token;
				step.value = "preview";
			} catch (err) {
				ElMessage.error(`解析失败: ${err.message}`);
			} finally {
				selecting.value = false;
			}
		}
		async function handleConfirm() {
			importing.value = true;
			step.value = "importing";
			try {
				const result = await api.customers.initialImportConfirm(previewToken.value);
				ElMessage.success(`成功导入 ${result.imported} 条客户`);
				emit("success");
			} catch (err) {
				ElMessage.error(`导入失败: ${err.message}`);
				step.value = "preview";
			} finally {
				importing.value = false;
			}
		}
		function handleClose() {
			dialogVisible.value = false;
			setTimeout(() => {
				step.value = "select";
				preview.value = null;
				previewToken.value = "";
			}, 300);
		}
		return (_ctx, _cache) => {
			const _component_ElAlert = ElAlert;
			const _component_ElButton = ElButton;
			const _component_ElTag = ElTag;
			const _component_ElTableColumn = ElTableColumn;
			const _component_ElTable = ElTable;
			const _component_ElDialog = ElDialog;
			return openBlock(), createBlock(_component_ElDialog, {
				modelValue: dialogVisible.value,
				"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => dialogVisible.value = $event),
				title: "客户首次批量导入",
				width: "90vw",
				top: "5vh",
				"close-on-click-modal": false,
				"destroy-on-close": "",
				onClose: handleClose
			}, {
				footer: withCtx(() => [
					createVNode(_component_ElButton, { onClick: handleClose }, {
						default: withCtx(() => [..._cache[7] || (_cache[7] = [createTextVNode("取消", -1)])]),
						_: 1
					}),
					step.value === "preview" ? (openBlock(), createBlock(_component_ElButton, {
						key: 0,
						onClick: _cache[0] || (_cache[0] = ($event) => step.value = "select")
					}, {
						default: withCtx(() => [..._cache[8] || (_cache[8] = [createTextVNode("重新选择", -1)])]),
						_: 1
					})) : createCommentVNode("", true),
					step.value === "preview" ? (openBlock(), createBlock(_component_ElButton, {
						key: 1,
						type: "primary",
						disabled: preview.value?.hasErrors,
						loading: importing.value,
						onClick: handleConfirm
					}, {
						default: withCtx(() => [..._cache[9] || (_cache[9] = [createTextVNode(" 确认导入 ", -1)])]),
						_: 1
					}, 8, ["disabled", "loading"])) : createCommentVNode("", true)
				]),
				default: withCtx(() => [createBaseVNode("div", _hoisted_1$1, [step.value === "select" ? (openBlock(), createElementBlock("div", _hoisted_2, [createVNode(_component_ElAlert, {
					type: "info",
					closable: false,
					"show-icon": ""
				}, {
					default: withCtx(() => [..._cache[2] || (_cache[2] = [createTextVNode(" 请下载系统模板，填写客户信息后上传。税号、电话和银行账号按文本格式填写。 ", -1)])]),
					_: 1
				}), createBaseVNode("div", _hoisted_3, [createVNode(_component_ElButton, { onClick: handleDownloadTemplate }, {
					default: withCtx(() => [..._cache[3] || (_cache[3] = [createTextVNode("下载模板", -1)])]),
					_: 1
				}), createVNode(_component_ElButton, {
					type: "primary",
					loading: selecting.value,
					onClick: handleSelectFile
				}, {
					default: withCtx(() => [..._cache[4] || (_cache[4] = [createTextVNode("选择文件", -1)])]),
					_: 1
				}, 8, ["loading"])])])) : step.value === "preview" ? (openBlock(), createElementBlock("div", _hoisted_4, [
					createBaseVNode("div", _hoisted_5, [
						createVNode(_component_ElTag, { type: "success" }, {
							default: withCtx(() => [createTextVNode("新增 " + toDisplayString(preview.value?.newCount) + " 条", 1)]),
							_: 1
						}),
						preview.value && preview.value.duplicateTaxIdCount > 0 ? (openBlock(), createBlock(_component_ElTag, {
							key: 0,
							type: "danger"
						}, {
							default: withCtx(() => [createTextVNode("重复税号 " + toDisplayString(preview.value.duplicateTaxIdCount) + " 条", 1)]),
							_: 1
						})) : createCommentVNode("", true),
						preview.value && preview.value.errorCount > 0 ? (openBlock(), createBlock(_component_ElTag, {
							key: 1,
							type: "danger"
						}, {
							default: withCtx(() => [createTextVNode("错误 " + toDisplayString(preview.value.errorCount) + " 条", 1)]),
							_: 1
						})) : createCommentVNode("", true)
					]),
					preview.value?.hasErrors ? (openBlock(), createBlock(_component_ElAlert, {
						key: 0,
						type: "error",
						closable: false,
						"show-icon": "",
						class: "error-alert"
					}, {
						default: withCtx(() => [..._cache[5] || (_cache[5] = [createTextVNode(" 存在错误行，整批无法导入。请修正后重新选择文件。 ", -1)])]),
						_: 1
					})) : createCommentVNode("", true),
					createVNode(_component_ElTable, {
						data: preview.value?.rows || [],
						border: "",
						stripe: "",
						size: "small",
						"max-height": "400"
					}, {
						default: withCtx(() => [
							createVNode(_component_ElTableColumn, {
								prop: "rowIndex",
								label: "行号",
								width: "70"
							}),
							createVNode(_component_ElTableColumn, {
								prop: "name",
								label: "客户名称",
								"min-width": "150"
							}),
							createVNode(_component_ElTableColumn, {
								prop: "taxId",
								label: "纳税人识别号",
								"min-width": "180"
							}),
							createVNode(_component_ElTableColumn, {
								prop: "phone",
								label: "电话",
								width: "130"
							}),
							createVNode(_component_ElTableColumn, {
								prop: "bankAccount",
								label: "银行账号",
								"min-width": "160"
							}),
							createVNode(_component_ElTableColumn, {
								label: "状态",
								width: "100"
							}, {
								default: withCtx(({ row }) => [createVNode(_component_ElTag, {
									type: row.errors.length > 0 ? "danger" : "success",
									size: "small"
								}, {
									default: withCtx(() => [createTextVNode(toDisplayString(row.errors.length > 0 ? "错误" : "正常"), 1)]),
									_: 2
								}, 1032, ["type"])]),
								_: 1
							}),
							createVNode(_component_ElTableColumn, {
								label: "错误信息",
								"min-width": "200"
							}, {
								default: withCtx(({ row }) => [createBaseVNode("span", _hoisted_6, toDisplayString(row.errors.join("; ")), 1)]),
								_: 1
							})
						]),
						_: 1
					}, 8, ["data"])
				])) : step.value === "importing" ? (openBlock(), createElementBlock("div", _hoisted_7, [createVNode(_component_ElAlert, {
					type: "info",
					closable: false,
					"show-icon": ""
				}, {
					default: withCtx(() => [..._cache[6] || (_cache[6] = [createTextVNode("正在导入，请稍候...", -1)])]),
					_: 1
				})])) : createCommentVNode("", true)])]),
				_: 1
			}, 8, ["modelValue"]);
		};
	}
}), [["__scopeId", "data-v-1d155274"]]);
//#endregion
//#region src/renderer/pages/customers/CustomersPage.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "content-card" };
//#endregion
//#region src/renderer/pages/customers/CustomersPage.vue
var CustomersPage_default = /* @__PURE__ */ defineComponent({
	__name: "CustomersPage",
	setup(__props) {
		const appStore = useAppStore();
		const loading = ref(false);
		const rows = ref([]);
		const total = ref(0);
		const query = reactive({
			keyword: "",
			status: "all",
			dataCompleteness: "all",
			page: 1,
			pageSize: 50
		});
		const modalType = ref("none");
		const editingCustomer = ref(null);
		const viewingCustomer = ref(null);
		const historyEntityId = ref("");
		const initialImportVisible = ref(false);
		onMounted(() => {
			loadData();
		});
		async function loadData() {
			loading.value = true;
			try {
				const result = await api.customers.list(query);
				rows.value = result.rows;
				total.value = result.total;
			} catch (err) {
				ElMessage.error(`加载失败: ${err.message}`);
			} finally {
				loading.value = false;
			}
		}
		function handleSearch() {
			query.page = 1;
			loadData();
		}
		function handleReset() {
			query.keyword = "";
			query.status = "all";
			query.dataCompleteness = "all";
			query.page = 1;
			loadData();
		}
		function handlePageChange(page) {
			query.page = page;
			loadData();
		}
		function handleSizeChange(size) {
			query.pageSize = size;
			query.page = 1;
			loadData();
		}
		function handleAdd() {
			editingCustomer.value = null;
			modalType.value = "form";
		}
		function handleEdit(row) {
			editingCustomer.value = row;
			modalType.value = "form";
		}
		function handleView(row) {
			viewingCustomer.value = row;
			modalType.value = "detail";
		}
		function handleHistory(row) {
			historyEntityId.value = row.id;
			modalType.value = "history";
		}
		async function handleToggleStatus(row) {
			try {
				await ElMessageBox.confirm(`确认${row.status === "active" ? "停用" : "恢复"}客户「${row.name}」？`, "确认操作", { type: "warning" });
				await api.customers.toggleStatus(row.id);
				ElMessage.success("操作成功");
				loadData();
			} catch (err) {
				if (err !== "cancel") ElMessage.error(`操作失败: ${err.message}`);
			}
		}
		function handleInitialImport() {
			initialImportVisible.value = true;
		}
		function handleInitialImportSuccess() {
			initialImportVisible.value = false;
			appStore.loadInitStatus();
			loadData();
			ElMessage.success("客户首次导入成功");
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [
				createVNode(CustomersToolbar_default, {
					keyword: query.keyword,
					"onUpdate:keyword": _cache[0] || (_cache[0] = ($event) => query.keyword = $event),
					status: query.status,
					"onUpdate:status": _cache[1] || (_cache[1] = ($event) => query.status = $event),
					dataCompleteness: query.dataCompleteness,
					"onUpdate:dataCompleteness": _cache[2] || (_cache[2] = ($event) => query.dataCompleteness = $event),
					onSearch: handleSearch,
					onReset: handleReset,
					onRefresh: loadData,
					onAdd: handleAdd,
					onInitialImport: handleInitialImport
				}, null, 8, [
					"keyword",
					"status",
					"dataCompleteness"
				]),
				createVNode(CustomersTable_default, {
					rows: rows.value,
					loading: loading.value,
					page: query.page,
					"page-size": query.pageSize,
					total: total.value,
					onView: handleView,
					onEdit: handleEdit,
					onToggleStatus: handleToggleStatus,
					onHistory: handleHistory,
					onPageChange: handlePageChange,
					onSizeChange: handleSizeChange
				}, null, 8, [
					"rows",
					"loading",
					"page",
					"page-size",
					"total"
				]),
				createVNode(CustomerModalHost_default, {
					"modal-type": modalType.value,
					"onUpdate:modalType": _cache[3] || (_cache[3] = ($event) => modalType.value = $event),
					"editing-customer": editingCustomer.value,
					"viewing-customer": viewingCustomer.value,
					"history-entity-id": historyEntityId.value,
					onSaved: loadData
				}, null, 8, [
					"modal-type",
					"editing-customer",
					"viewing-customer",
					"history-entity-id"
				]),
				createVNode(CustomerInitialImportDialog_default, {
					visible: initialImportVisible.value,
					"onUpdate:visible": _cache[4] || (_cache[4] = ($event) => initialImportVisible.value = $event),
					onSuccess: handleInitialImportSuccess
				}, null, 8, ["visible"])
			]);
		};
	}
});
//#endregion
export { CustomersPage_default as default };
