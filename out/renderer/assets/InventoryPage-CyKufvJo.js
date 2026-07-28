import { Ai as Fragment, Bi as createVNode, Ca as reactive, Di as withKeys, Fi as createBlock, G as ElInput, Ii as createCommentVNode, Ka as toDisplayString, Li as createElementBlock, M as ElButton, Na as unref, Ni as computed, Pi as createBaseVNode, S as ElOption, Ta as ref, Ua as normalizeClass, Vi as defineComponent, _ as ElDescriptions, a as vLoading, aa as renderList, ba as isRef, c as ElTableColumn, d as ElDialog, dt as ElIcon, ea as onMounted, ga as withDirectives, ha as withCtx, i as ElMessage, k as ElTag, n as api, pa as watch, r as ElMessageBox, ra as openBlock, s as ElTable, sa as resolveComponent, t as _plugin_vue_export_helper_default, ta as onUnmounted, u as ElPagination, v as ElDescriptionsItem, w as ElSelect, zi as createTextVNode } from "./css-DpRyt22U.js";
import { a as ElForm, i as ElRadioGroup, n as ElRadio, o as ElFormItem, s as ElAlert, t as useAppStore, u as defineStore } from "./css-ZZEPHGOo.js";
import { n as ElTabs, r as ElInputNumber, t as ElTabPane } from "./css-_jBveQ-o.js";
import "./css-6gC5bciY.js";
import { i as centToDisplay, n as calcTaxCent, r as calcTotalCent, t as calcAmountCent } from "./money-DRED0fdN.js";
//#region src/renderer/pages/inventory/components/InventoryToolbar.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$11 = { class: "inventory-toolbar" };
var _hoisted_2$10 = { class: "toolbar-filters" };
var _hoisted_3$6 = { class: "toolbar-actions" };
var _hoisted_4$4 = { class: "action-col" };
var _hoisted_5$3 = { class: "action-col-btns" };
var _hoisted_6$3 = { class: "action-col" };
var _hoisted_7 = { class: "action-col-btns" };
var _hoisted_8 = { class: "action-col" };
var _hoisted_9 = { class: "action-col-btns" };
//#endregion
//#region src/renderer/pages/inventory/components/InventoryToolbar.vue
var InventoryToolbar_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "InventoryToolbar",
	props: {
		keyword: {},
		stockStatus: {},
		productStatus: {}
	},
	emits: [
		"update:keyword",
		"update:stockStatus",
		"update:productStatus",
		"search",
		"reset",
		"refresh",
		"outbound",
		"add-product",
		"initial-import",
		"daily-import",
		"month-end-export",
		"month-beginning-import",
		"import-records",
		"view-history"
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
			const _component_Ticket = resolveComponent("Ticket");
			const _component_Download = resolveComponent("Download");
			const _component_List = resolveComponent("List");
			const _component_Notebook = resolveComponent("Notebook");
			const _component_WarningFilled = resolveComponent("WarningFilled");
			return openBlock(), createElementBlock("div", _hoisted_1$11, [createBaseVNode("div", _hoisted_2$10, [
				createVNode(_component_ElInput, {
					"model-value": __props.keyword,
					placeholder: "项目名称、型号、税收分类编码",
					clearable: "",
					style: { "width": "260px" },
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:keyword", $event)),
					onKeyup: _cache[1] || (_cache[1] = withKeys(($event) => _ctx.$emit("search"), ["enter"]))
				}, null, 8, ["model-value"]),
				createVNode(_component_ElSelect, {
					"model-value": __props.stockStatus,
					placeholder: "库存状态",
					style: { "width": "110px" },
					"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => _ctx.$emit("update:stockStatus", $event))
				}, {
					default: withCtx(() => [
						createVNode(_component_ElOption, {
							label: "全部",
							value: "all"
						}),
						createVNode(_component_ElOption, {
							label: "有余量",
							value: "positive"
						}),
						createVNode(_component_ElOption, {
							label: "已平衡",
							value: "zero"
						}),
						createVNode(_component_ElOption, {
							label: "待补票",
							value: "negative"
						})
					]),
					_: 1
				}, 8, ["model-value"]),
				createVNode(_component_ElSelect, {
					"model-value": __props.productStatus,
					placeholder: "启用状态",
					style: { "width": "110px" },
					"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => _ctx.$emit("update:productStatus", $event))
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
				createVNode(_component_ElButton, {
					type: "primary",
					onClick: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("search"))
				}, {
					default: withCtx(() => [..._cache[15] || (_cache[15] = [createTextVNode("搜索", -1)])]),
					_: 1
				}),
				createVNode(_component_ElButton, { onClick: _cache[5] || (_cache[5] = ($event) => _ctx.$emit("reset")) }, {
					default: withCtx(() => [..._cache[16] || (_cache[16] = [createTextVNode("重置", -1)])]),
					_: 1
				}),
				createVNode(_component_ElButton, {
					style: { "margin-left": "auto" },
					onClick: _cache[6] || (_cache[6] = ($event) => _ctx.$emit("refresh"))
				}, {
					default: withCtx(() => [..._cache[17] || (_cache[17] = [createTextVNode("刷新", -1)])]),
					_: 1
				})
			]), createBaseVNode("div", _hoisted_3$6, [
				createBaseVNode("div", _hoisted_4$4, [_cache[20] || (_cache[20] = createBaseVNode("div", { class: "action-col-title" }, "商品管理", -1)), createBaseVNode("div", _hoisted_5$3, [createVNode(_component_ElButton, {
					type: "success",
					onClick: _cache[7] || (_cache[7] = ($event) => _ctx.$emit("add-product"))
				}, {
					default: withCtx(() => [createVNode(_component_ElIcon, null, {
						default: withCtx(() => [createVNode(_component_Plus)]),
						_: 1
					}), _cache[18] || (_cache[18] = createTextVNode("新增商品 ", -1))]),
					_: 1
				}), createVNode(_component_ElButton, { onClick: _cache[8] || (_cache[8] = ($event) => _ctx.$emit("daily-import")) }, {
					default: withCtx(() => [createVNode(_component_ElIcon, null, {
						default: withCtx(() => [createVNode(_component_Upload)]),
						_: 1
					}), _cache[19] || (_cache[19] = createTextVNode("商品导入 ", -1))]),
					_: 1
				})])]),
				createBaseVNode("div", _hoisted_6$3, [_cache[24] || (_cache[24] = createBaseVNode("div", { class: "action-col-title" }, "库存与开票", -1)), createBaseVNode("div", _hoisted_7, [
					createVNode(_component_ElButton, {
						type: "primary",
						onClick: _cache[9] || (_cache[9] = ($event) => _ctx.$emit("outbound"))
					}, {
						default: withCtx(() => [createVNode(_component_ElIcon, null, {
							default: withCtx(() => [createVNode(_component_Ticket)]),
							_: 1
						}), _cache[21] || (_cache[21] = createTextVNode("销项开票 ", -1))]),
						_: 1
					}),
					createVNode(_component_ElButton, {
						type: "warning",
						onClick: _cache[10] || (_cache[10] = ($event) => _ctx.$emit("month-end-export"))
					}, {
						default: withCtx(() => [createVNode(_component_ElIcon, null, {
							default: withCtx(() => [createVNode(_component_Download)]),
							_: 1
						}), _cache[22] || (_cache[22] = createTextVNode("月底导出 ", -1))]),
						_: 1
					}),
					createVNode(_component_ElButton, {
						type: "info",
						onClick: _cache[11] || (_cache[11] = ($event) => _ctx.$emit("month-beginning-import"))
					}, {
						default: withCtx(() => [createVNode(_component_ElIcon, null, {
							default: withCtx(() => [createVNode(_component_Upload)]),
							_: 1
						}), _cache[23] || (_cache[23] = createTextVNode("月初进项 ", -1))]),
						_: 1
					})
				])]),
				createBaseVNode("div", _hoisted_8, [_cache[28] || (_cache[28] = createBaseVNode("div", { class: "action-col-title" }, "记录与工具", -1)), createBaseVNode("div", _hoisted_9, [
					createVNode(_component_ElButton, { onClick: _cache[12] || (_cache[12] = ($event) => _ctx.$emit("import-records")) }, {
						default: withCtx(() => [createVNode(_component_ElIcon, null, {
							default: withCtx(() => [createVNode(_component_List)]),
							_: 1
						}), _cache[25] || (_cache[25] = createTextVNode("导入记录 ", -1))]),
						_: 1
					}),
					createVNode(_component_ElButton, { onClick: _cache[13] || (_cache[13] = ($event) => _ctx.$emit("view-history")) }, {
						default: withCtx(() => [createVNode(_component_ElIcon, null, {
							default: withCtx(() => [createVNode(_component_Notebook)]),
							_: 1
						}), _cache[26] || (_cache[26] = createTextVNode("历史记录 ", -1))]),
						_: 1
					}),
					!unref(appStore).productImportDone ? (openBlock(), createBlock(_component_ElButton, {
						key: 0,
						type: "danger",
						onClick: _cache[14] || (_cache[14] = ($event) => _ctx.$emit("initial-import"))
					}, {
						default: withCtx(() => [createVNode(_component_ElIcon, null, {
							default: withCtx(() => [createVNode(_component_WarningFilled)]),
							_: 1
						}), _cache[27] || (_cache[27] = createTextVNode("初始化导入 ", -1))]),
						_: 1
					})) : createCommentVNode("", true)
				])])
			])]);
		};
	}
}), [["__scopeId", "data-v-a6259766"]]);
//#endregion
//#region src/shared/contracts/types/common.ts
/** 库存状态判定 */
function getStockStatus(balance) {
	if (balance > 0) return "positive";
	if (balance < 0) return "negative";
	return "zero";
}
/** 库存状态显示文本 */
function getStockStatusText(balance) {
	switch (getStockStatus(balance)) {
		case "positive": return `有余量 ${balance}`;
		case "negative": return `待补 ${Math.abs(balance)}`;
		case "zero": return "已平衡";
	}
}
//#endregion
//#region src/renderer/pages/inventory/components/InventoryTable.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$10 = { class: "table-container" };
var _hoisted_2$9 = { class: "pagination-container" };
//#endregion
//#region src/renderer/pages/inventory/components/InventoryTable.vue
var InventoryTable_default = /* @__PURE__ */ defineComponent({
	__name: "InventoryTable",
	props: {
		rows: {},
		loading: { type: Boolean },
		page: {},
		pageSize: {},
		total: {}
	},
	emits: [
		"viewHistory",
		"editProduct",
		"toggleProductStatus",
		"togglePriceVersionStatus",
		"adjustStock",
		"pageChange",
		"sizeChange",
		"selectionChange"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const currentPage = computed({
			get: () => props.page,
			set: () => {}
		});
		const currentPageSize = computed({
			get: () => props.pageSize,
			set: () => {}
		});
		const tableMaxHeight = ref(550);
		function handleSelectionChange(selectedRows) {
			const selectedIds = new Set(selectedRows.map((r) => r.priceVersionId));
			for (const row of props.rows) emit("selectionChange", row, selectedIds.has(row.priceVersionId));
		}
		function stockTagType(balance) {
			if (balance > 0) return "success";
			if (balance < 0) return "danger";
			return "info";
		}
		function stockStatusText(balance) {
			return getStockStatusText(balance);
		}
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
			return openBlock(), createElementBlock("div", _hoisted_1$10, [withDirectives((openBlock(), createBlock(_component_ElTable, {
				data: __props.rows,
				border: "",
				stripe: "",
				size: "default",
				"row-key": "priceVersionId",
				"max-height": tableMaxHeight.value,
				onSelectionChange: handleSelectionChange
			}, {
				default: withCtx(() => [
					createVNode(_component_ElTableColumn, {
						type: "selection",
						width: "50",
						"reserve-selection": true
					}),
					createVNode(_component_ElTableColumn, {
						prop: "name",
						label: "项目名称",
						"min-width": "180",
						"show-overflow-tooltip": ""
					}),
					createVNode(_component_ElTableColumn, {
						prop: "model",
						label: "型号",
						width: "120",
						"show-overflow-tooltip": ""
					}),
					createVNode(_component_ElTableColumn, {
						prop: "unit",
						label: "单位",
						width: "80"
					}),
					createVNode(_component_ElTableColumn, {
						prop: "taxClassificationCode",
						label: "税收分类编码",
						"min-width": "150",
						"show-overflow-tooltip": ""
					}),
					createVNode(_component_ElTableColumn, {
						prop: "unitPriceDecimal",
						label: "不含税单价",
						width: "130"
					}),
					createVNode(_component_ElTableColumn, {
						label: "当前库存",
						width: "120"
					}, {
						default: withCtx(({ row }) => [createVNode(_component_ElTag, {
							type: stockTagType(row.stockBalance),
							size: "small"
						}, {
							default: withCtx(() => [createTextVNode(toDisplayString(stockStatusText(row.stockBalance)), 1)]),
							_: 2
						}, 1032, ["type"])]),
						_: 1
					}),
					createVNode(_component_ElTableColumn, {
						label: "启用状态",
						width: "90",
						align: "center"
					}, {
						default: withCtx(({ row }) => [createVNode(_component_ElTag, {
							type: row.productStatus === "active" ? "success" : "danger",
							size: "small"
						}, {
							default: withCtx(() => [createTextVNode(toDisplayString(row.productStatus === "active" ? "启用" : "停用"), 1)]),
							_: 2
						}, 1032, ["type"])]),
						_: 1
					}),
					createVNode(_component_ElTableColumn, {
						prop: "updatedAt",
						label: "最近变更",
						width: "160"
					}, {
						default: withCtx(({ row }) => [createTextVNode(toDisplayString(formatTime(row.updatedAt)), 1)]),
						_: 1
					}),
					createVNode(_component_ElTableColumn, {
						label: "操作",
						width: "270",
						fixed: "right"
					}, {
						default: withCtx(({ row }) => [
							createVNode(_component_ElButton, {
								link: "",
								type: "info",
								size: "small",
								onClick: ($event) => _ctx.$emit("viewHistory", row)
							}, {
								default: withCtx(() => [..._cache[4] || (_cache[4] = [createTextVNode("历史记录", -1)])]),
								_: 1
							}, 8, ["onClick"]),
							createVNode(_component_ElButton, {
								link: "",
								type: "primary",
								size: "small",
								onClick: ($event) => _ctx.$emit("editProduct", row)
							}, {
								default: withCtx(() => [..._cache[5] || (_cache[5] = [createTextVNode("编辑", -1)])]),
								_: 1
							}, 8, ["onClick"]),
							createVNode(_component_ElButton, {
								link: "",
								type: row.productStatus === "active" ? "warning" : "success",
								size: "small",
								onClick: ($event) => _ctx.$emit("toggleProductStatus", row)
							}, {
								default: withCtx(() => [createTextVNode(toDisplayString(row.productStatus === "active" ? "停用" : "启用"), 1)]),
								_: 2
							}, 1032, ["type", "onClick"]),
							createVNode(_component_ElButton, {
								link: "",
								type: "primary",
								size: "small",
								onClick: ($event) => _ctx.$emit("adjustStock", row)
							}, {
								default: withCtx(() => [..._cache[6] || (_cache[6] = [createTextVNode("库存调整", -1)])]),
								_: 1
							}, 8, ["onClick"])
						]),
						_: 1
					})
				]),
				_: 1
			}, 8, ["data", "max-height"])), [[_directive_loading, __props.loading]]), createBaseVNode("div", _hoisted_2$9, [createVNode(_component_ElPagination, {
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
				onCurrentChange: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("pageChange", $event)),
				onSizeChange: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("sizeChange", $event))
			}, null, 8, [
				"current-page",
				"page-size",
				"total"
			])])]);
		};
	}
});
//#endregion
//#region src/renderer/stores/selection.ts
/**
* 页面二跨分页选择 Store。
* 以 priceVersionId 为键保存跨页选择；翻页、改变每页数量和改变筛选条件只更新当前页数据，不清空 Store。
* 离开 /inventory 或开票成功后清空，取消开票 Dialog 时保留。
*/
var useSelectionStore = defineStore("selection", () => {
	const selectedPriceVersions = ref(/* @__PURE__ */ new Map());
	/** 获取已选数量 */
	function selectedCount() {
		return selectedPriceVersions.value.size;
	}
	/** 切换勾选 */
	function toggleSelection(row, selected) {
		if (selected) selectedPriceVersions.value.set(row.priceVersionId, row);
		else selectedPriceVersions.value.delete(row.priceVersionId);
		selectedPriceVersions.value = new Map(selectedPriceVersions.value);
	}
	/** 批量设置勾选 */
	function setSelection(rows, selected) {
		if (selected) for (const row of rows) selectedPriceVersions.value.set(row.priceVersionId, row);
		else for (const row of rows) selectedPriceVersions.value.delete(row.priceVersionId);
		selectedPriceVersions.value = new Map(selectedPriceVersions.value);
	}
	/** 检查是否已选 */
	function isSelected(priceVersionId) {
		return selectedPriceVersions.value.has(priceVersionId);
	}
	/** 获取全部已选 */
	function getSelected() {
		return Array.from(selectedPriceVersions.value.values());
	}
	/** 获取全部已选 ID */
	function getSelectedIds() {
		return Array.from(selectedPriceVersions.value.keys());
	}
	/** 从已选中移除失效项 */
	function removeInvalid(ids) {
		for (const id of ids) selectedPriceVersions.value.delete(id);
		selectedPriceVersions.value = new Map(selectedPriceVersions.value);
	}
	/** 清空已选 */
	function clearSelection() {
		selectedPriceVersions.value = /* @__PURE__ */ new Map();
	}
	return {
		selectedPriceVersions,
		selectedCount,
		toggleSelection,
		setSelection,
		isSelected,
		getSelected,
		getSelectedIds,
		removeInvalid,
		clearSelection
	};
});
//#endregion
//#region src/renderer/pages/inventory/modals/OutboundLineTable.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$9 = { class: "line-table-container" };
var _hoisted_2$8 = { class: "summary-bar" };
var _hoisted_3$5 = { class: "total" };
//#endregion
//#region src/renderer/pages/inventory/modals/OutboundLineTable.vue
var OutboundLineTable_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "OutboundLineTable",
	props: { lines: {} },
	emits: ["change", "remove"],
	setup(__props) {
		const props = __props;
		const totalQuantity = computed(() => props.lines.reduce((sum, l) => sum + l.quantity, 0));
		const totalAmountCent = computed(() => props.lines.reduce((sum, l) => sum + calcAmountCent(l.quantity, l.unitPriceDecimal), 0));
		const totalTaxCent = computed(() => props.lines.reduce((sum, l) => sum + calcTaxCent(calcAmountCent(l.quantity, l.unitPriceDecimal)), 0));
		const totalCent = computed(() => totalAmountCent.value + totalTaxCent.value);
		function stockTagType(balance) {
			if (balance > 0) return "success";
			if (balance < 0) return "danger";
			return "info";
		}
		return (_ctx, _cache) => {
			const _component_ElTableColumn = ElTableColumn;
			const _component_ElTag = ElTag;
			const _component_ElInputNumber = ElInputNumber;
			const _component_ElButton = ElButton;
			const _component_ElTable = ElTable;
			return openBlock(), createElementBlock("div", _hoisted_1$9, [createVNode(_component_ElTable, {
				data: __props.lines,
				border: "",
				stripe: "",
				size: "small",
				"max-height": "400"
			}, {
				default: withCtx(() => [
					createVNode(_component_ElTableColumn, {
						prop: "name",
						label: "项目名称",
						"min-width": "150"
					}),
					createVNode(_component_ElTableColumn, {
						prop: "model",
						label: "型号",
						width: "100"
					}),
					createVNode(_component_ElTableColumn, {
						prop: "unit",
						label: "单位",
						width: "70"
					}),
					createVNode(_component_ElTableColumn, {
						prop: "unitPriceDecimal",
						label: "单价",
						width: "120"
					}),
					createVNode(_component_ElTableColumn, {
						label: "当前库存",
						width: "100"
					}, {
						default: withCtx(({ row }) => [createVNode(_component_ElTag, {
							type: stockTagType(row.stockBalance),
							size: "small"
						}, {
							default: withCtx(() => [createTextVNode(toDisplayString(row.stockBalance), 1)]),
							_: 2
						}, 1032, ["type"])]),
						_: 1
					}),
					createVNode(_component_ElTableColumn, {
						label: "数量",
						width: "140"
					}, {
						default: withCtx(({ row }) => [createVNode(_component_ElInputNumber, {
							modelValue: row.quantity,
							"onUpdate:modelValue": ($event) => row.quantity = $event,
							min: 1,
							step: 1,
							precision: 0,
							size: "small",
							onChange: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("change"))
						}, null, 8, ["modelValue", "onUpdate:modelValue"])]),
						_: 1
					}),
					createVNode(_component_ElTableColumn, {
						label: "金额",
						width: "110"
					}, {
						default: withCtx(({ row }) => [createTextVNode(toDisplayString(unref(centToDisplay)(unref(calcAmountCent)(row.quantity, row.unitPriceDecimal))), 1)]),
						_: 1
					}),
					createVNode(_component_ElTableColumn, {
						label: "税额",
						width: "110"
					}, {
						default: withCtx(({ row }) => [createTextVNode(toDisplayString(unref(centToDisplay)(unref(calcTaxCent)(unref(calcAmountCent)(row.quantity, row.unitPriceDecimal)))), 1)]),
						_: 1
					}),
					createVNode(_component_ElTableColumn, {
						label: "价税合计",
						width: "120"
					}, {
						default: withCtx(({ row }) => [createTextVNode(toDisplayString(unref(centToDisplay)(unref(calcTotalCent)(unref(calcAmountCent)(row.quantity, row.unitPriceDecimal), unref(calcTaxCent)(unref(calcAmountCent)(row.quantity, row.unitPriceDecimal))))), 1)]),
						_: 1
					}),
					createVNode(_component_ElTableColumn, {
						label: "操作",
						width: "80",
						fixed: "right"
					}, {
						default: withCtx(({ $index }) => [createVNode(_component_ElButton, {
							link: "",
							type: "danger",
							size: "small",
							onClick: ($event) => _ctx.$emit("remove", $index)
						}, {
							default: withCtx(() => [..._cache[1] || (_cache[1] = [createTextVNode("移除", -1)])]),
							_: 1
						}, 8, ["onClick"])]),
						_: 1
					})
				]),
				_: 1
			}, 8, ["data"]), createBaseVNode("div", _hoisted_2$8, [
				createBaseVNode("span", null, "行数：" + toDisplayString(__props.lines.length), 1),
				createBaseVNode("span", null, "数量合计：" + toDisplayString(totalQuantity.value), 1),
				createBaseVNode("span", null, "金额：" + toDisplayString(unref(centToDisplay)(totalAmountCent.value)), 1),
				createBaseVNode("span", null, "税额：" + toDisplayString(unref(centToDisplay)(totalTaxCent.value)), 1),
				createBaseVNode("span", _hoisted_3$5, "价税合计：" + toDisplayString(unref(centToDisplay)(totalCent.value)), 1)
			])]);
		};
	}
}), [["__scopeId", "data-v-9738d8ea"]]);
//#endregion
//#region src/renderer/pages/inventory/modals/OutboundExportDialog.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$8 = { class: "outbound-content" };
//#endregion
//#region src/renderer/pages/inventory/modals/OutboundExportDialog.vue
var OutboundExportDialog_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "OutboundExportDialog",
	props: {
		visible: { type: Boolean },
		initialLines: {}
	},
	emits: ["close", "success"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const dialogVisible = computed({
			get: () => props.visible,
			set: () => emit("close")
		});
		const selectionStore = useSelectionStore();
		const selectedCustomerId = ref("");
		const customerOptions = ref([]);
		const customerLoading = ref(false);
		const exporting = ref(false);
		const lines = reactive([]);
		watch(() => props.visible, (val) => {
			if (val) {
				lines.length = 0;
				for (const pv of props.initialLines) lines.push({
					priceVersionId: pv.priceVersionId,
					name: pv.name,
					model: pv.model,
					unit: pv.unit,
					unitPriceDecimal: pv.unitPriceDecimal,
					stockBalance: pv.stockBalance,
					quantity: 1
				});
				loadCustomers();
			}
		}, { immediate: true });
		async function loadCustomers() {
			customerLoading.value = true;
			try {
				const result = await api.customers.list({
					page: 1,
					pageSize: 100,
					status: "active"
				});
				customerOptions.value = result.rows;
			} finally {
				customerLoading.value = false;
			}
		}
		async function searchCustomers(query) {
			customerLoading.value = true;
			try {
				const result = await api.customers.list({
					page: 1,
					pageSize: 100,
					keyword: query,
					status: "active"
				});
				customerOptions.value = result.rows;
			} finally {
				customerLoading.value = false;
			}
		}
		function removeLine(index) {
			lines.splice(index, 1);
		}
		function recalculate() {}
		async function handleExport() {
			if (lines.length > 2e3) {
				ElMessage.error("单次最多 2000 条明细");
				return;
			}
			try {
				exporting.value = true;
				const input = {
					customerId: selectedCustomerId.value,
					lines: lines.map((l) => ({
						priceVersionId: l.priceVersionId,
						quantity: l.quantity
					}))
				};
				const draft = await api.outbound.validateDraft(input);
				if (draft.invalidPriceVersionIds.length > 0) {
					selectionStore.removeInvalid(draft.invalidPriceVersionIds);
					ElMessage.warning(`部分价格版本已失效并从已选中移除：${draft.errors.join("; ")}`);
					if (draft.validLines.length === 0) {
						exporting.value = false;
						return;
					}
					input.lines = draft.validLines.map((l) => ({
						priceVersionId: l.priceVersionId,
						quantity: l.quantity
					}));
				}
				const result = await api.outbound.export(input);
				if (result.saved) {
					ElMessage.success(`导出成功，批次号: ${result.batchNo}`);
					selectionStore.clearSelection();
					emit("success");
				} else ElMessage.warning("导出已取消");
			} catch (err) {
				ElMessage.error(`导出失败: ${err.message}`);
			} finally {
				exporting.value = false;
			}
		}
		function handleClose() {
			emit("close");
		}
		return (_ctx, _cache) => {
			const _component_ElOption = ElOption;
			const _component_ElSelect = ElSelect;
			const _component_ElFormItem = ElFormItem;
			const _component_ElForm = ElForm;
			const _component_ElButton = ElButton;
			const _component_ElDialog = ElDialog;
			return openBlock(), createBlock(_component_ElDialog, {
				modelValue: dialogVisible.value,
				"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => dialogVisible.value = $event),
				title: "销项开票",
				width: "90vw",
				top: "5vh",
				"close-on-click-modal": false,
				"destroy-on-close": "",
				onClose: handleClose
			}, {
				footer: withCtx(() => [createVNode(_component_ElButton, { onClick: handleClose }, {
					default: withCtx(() => [..._cache[2] || (_cache[2] = [createTextVNode("取消", -1)])]),
					_: 1
				}), createVNode(_component_ElButton, {
					type: "primary",
					loading: exporting.value,
					disabled: !selectedCustomerId.value || lines.length === 0,
					onClick: handleExport
				}, {
					default: withCtx(() => [..._cache[3] || (_cache[3] = [createTextVNode(" 确认导出 ", -1)])]),
					_: 1
				}, 8, ["loading", "disabled"])]),
				default: withCtx(() => [createBaseVNode("div", _hoisted_1$8, [createVNode(_component_ElForm, {
					inline: true,
					class: "customer-form"
				}, {
					default: withCtx(() => [createVNode(_component_ElFormItem, {
						label: "开票客户",
						required: ""
					}, {
						default: withCtx(() => [createVNode(_component_ElSelect, {
							modelValue: selectedCustomerId.value,
							"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => selectedCustomerId.value = $event),
							filterable: "",
							remote: "",
							"remote-method": searchCustomers,
							loading: customerLoading.value,
							placeholder: "选择启用客户",
							style: { "width": "300px" }
						}, {
							default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(customerOptions.value, (c) => {
								return openBlock(), createBlock(_component_ElOption, {
									key: c.id,
									label: `${c.name} (${c.taxId})`,
									value: c.id
								}, null, 8, ["label", "value"]);
							}), 128))]),
							_: 1
						}, 8, ["modelValue", "loading"])]),
						_: 1
					})]),
					_: 1
				}), createVNode(OutboundLineTable_default, {
					lines,
					onChange: recalculate,
					onRemove: removeLine
				}, null, 8, ["lines"])])]),
				_: 1
			}, 8, ["modelValue"]);
		};
	}
}), [["__scopeId", "data-v-30d8eac6"]]);
//#endregion
//#region src/renderer/pages/inventory/modals/PriceVersionList.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$7 = { class: "price-versions" };
var _hoisted_2$7 = { class: "section-header" };
//#endregion
//#region src/renderer/pages/inventory/modals/PriceVersionList.vue
var PriceVersionList_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "PriceVersionList",
	props: { productId: {} },
	emits: ["reload"],
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const priceVersions = ref([]);
		const showAddPrice = ref(false);
		const newPrice = ref("");
		/** 加载价格版本列表 */
		async function loadPriceVersions() {
			if (!props.productId) return;
			try {
				priceVersions.value = await api.catalog.getPriceVersionsByIds([props.productId]);
			} catch {
				priceVersions.value = [];
			}
		}
		/** 新增价格版本 */
		async function handleAddPriceVersion() {
			if (!newPrice.value || !props.productId) return;
			try {
				await api.catalog.createPriceVersion({
					productId: props.productId,
					unitPriceDecimal: newPrice.value
				});
				ElMessage.success("价格版本已创建");
				showAddPrice.value = false;
				newPrice.value = "";
				await loadPriceVersions();
				emit("reload");
			} catch (err) {
				ElMessage.error(`创建失败: ${err.message}`);
			}
		}
		/** 切换价格版本状态 */
		async function togglePvStatus(id) {
			try {
				await api.catalog.togglePriceVersionStatus(id);
				await loadPriceVersions();
			} catch (err) {
				ElMessage.error(`操作失败: ${err.message}`);
			}
		}
		__expose({ loadPriceVersions });
		return (_ctx, _cache) => {
			const _component_ElButton = ElButton;
			const _component_ElTableColumn = ElTableColumn;
			const _component_ElTag = ElTag;
			const _component_ElTable = ElTable;
			const _component_ElInput = ElInput;
			const _component_ElFormItem = ElFormItem;
			const _component_ElForm = ElForm;
			const _component_ElDialog = ElDialog;
			return openBlock(), createElementBlock("div", _hoisted_1$7, [
				createBaseVNode("div", _hoisted_2$7, [_cache[5] || (_cache[5] = createBaseVNode("span", null, "价格版本", -1)), createVNode(_component_ElButton, {
					type: "primary",
					size: "small",
					onClick: _cache[0] || (_cache[0] = ($event) => showAddPrice.value = true)
				}, {
					default: withCtx(() => [..._cache[4] || (_cache[4] = [createTextVNode("新增价格版本", -1)])]),
					_: 1
				})]),
				createVNode(_component_ElTable, {
					data: priceVersions.value,
					border: "",
					size: "small"
				}, {
					default: withCtx(() => [
						createVNode(_component_ElTableColumn, {
							prop: "unitPriceDecimal",
							label: "不含税单价"
						}),
						createVNode(_component_ElTableColumn, {
							prop: "taxRate",
							label: "税率",
							width: "80"
						}),
						createVNode(_component_ElTableColumn, {
							prop: "stockBalance",
							label: "当前库存",
							width: "100"
						}),
						createVNode(_component_ElTableColumn, {
							label: "状态",
							width: "80"
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
							label: "操作",
							width: "100"
						}, {
							default: withCtx(({ row }) => [createVNode(_component_ElButton, {
								link: "",
								type: row.status === "active" ? "warning" : "success",
								size: "small",
								onClick: ($event) => togglePvStatus(row.id)
							}, {
								default: withCtx(() => [createTextVNode(toDisplayString(row.status === "active" ? "停用" : "启用"), 1)]),
								_: 2
							}, 1032, ["type", "onClick"])]),
							_: 1
						})
					]),
					_: 1
				}, 8, ["data"]),
				createVNode(_component_ElDialog, {
					modelValue: showAddPrice.value,
					"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => showAddPrice.value = $event),
					title: "新增价格版本",
					width: "400px",
					"append-to-body": ""
				}, {
					footer: withCtx(() => [createVNode(_component_ElButton, { onClick: _cache[2] || (_cache[2] = ($event) => showAddPrice.value = false) }, {
						default: withCtx(() => [..._cache[6] || (_cache[6] = [createTextVNode("取消", -1)])]),
						_: 1
					}), createVNode(_component_ElButton, {
						type: "primary",
						onClick: handleAddPriceVersion
					}, {
						default: withCtx(() => [..._cache[7] || (_cache[7] = [createTextVNode("确认", -1)])]),
						_: 1
					})]),
					default: withCtx(() => [createVNode(_component_ElForm, { "label-width": "120px" }, {
						default: withCtx(() => [createVNode(_component_ElFormItem, {
							label: "不含税单价",
							required: ""
						}, {
							default: withCtx(() => [createVNode(_component_ElInput, {
								modelValue: newPrice.value,
								"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => newPrice.value = $event),
								placeholder: "最多 13 位小数"
							}, null, 8, ["modelValue"])]),
							_: 1
						})]),
						_: 1
					})]),
					_: 1
				}, 8, ["modelValue"])
			]);
		};
	}
}), [["__scopeId", "data-v-fe092f94"]]);
//#endregion
//#region src/renderer/pages/inventory/modals/ProductFormDialog.vue
var ProductFormDialog_default = /* @__PURE__ */ defineComponent({
	__name: "ProductFormDialog",
	props: {
		visible: { type: Boolean },
		productId: {}
	},
	emits: ["close", "saved"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const formRef = ref();
		const pvListRef = ref();
		const saving = ref(false);
		const form = reactive({
			id: void 0,
			name: "",
			model: "",
			unit: "",
			taxClassificationCode: "",
			status: "active",
			remark: ""
		});
		const rules = {
			name: [{
				required: true,
				message: "请输入项目名称",
				trigger: "blur"
			}],
			model: [{
				required: true,
				message: "请输入规格型号",
				trigger: "blur"
			}],
			unit: [{
				required: true,
				message: "请输入单位",
				trigger: "blur"
			}],
			taxClassificationCode: [{
				required: true,
				message: "请输入税收分类编码",
				trigger: "blur"
			}]
		};
		watch(() => props.visible, async (val) => {
			if (val) if (props.productId) {
				const product = await api.catalog.getProductById(props.productId);
				if (product) Object.assign(form, product);
				setTimeout(() => pvListRef.value?.loadPriceVersions(), 0);
			} else Object.assign(form, {
				id: void 0,
				name: "",
				model: "",
				unit: "",
				taxClassificationCode: "",
				status: "active",
				remark: ""
			});
		}, { immediate: true });
		async function handleSave() {
			if (!formRef.value) return;
			try {
				await formRef.value.validate();
				saving.value = true;
				if (form.id) await api.catalog.updateProduct(form);
				else await api.catalog.createProduct(form);
				ElMessage.success("保存成功");
				emit("saved");
			} catch (err) {
				ElMessage.error(`保存失败: ${err.message}`);
			} finally {
				saving.value = false;
			}
		}
		return (_ctx, _cache) => {
			const _component_ElInput = ElInput;
			const _component_ElFormItem = ElFormItem;
			const _component_ElRadio = ElRadio;
			const _component_ElRadioGroup = ElRadioGroup;
			const _component_ElForm = ElForm;
			const _component_ElButton = ElButton;
			const _component_ElDialog = ElDialog;
			return openBlock(), createBlock(_component_ElDialog, {
				"model-value": __props.visible,
				title: __props.productId ? "编辑商品" : "新增商品",
				width: "680px",
				"close-on-click-modal": false,
				"destroy-on-close": "",
				onClose: _cache[8] || (_cache[8] = ($event) => _ctx.$emit("close"))
			}, {
				footer: withCtx(() => [createVNode(_component_ElButton, { onClick: _cache[7] || (_cache[7] = ($event) => _ctx.$emit("close")) }, {
					default: withCtx(() => [..._cache[11] || (_cache[11] = [createTextVNode("取消", -1)])]),
					_: 1
				}), createVNode(_component_ElButton, {
					type: "primary",
					loading: saving.value,
					onClick: handleSave
				}, {
					default: withCtx(() => [..._cache[12] || (_cache[12] = [createTextVNode("保存", -1)])]),
					_: 1
				}, 8, ["loading"])]),
				default: withCtx(() => [createVNode(_component_ElForm, {
					ref_key: "formRef",
					ref: formRef,
					model: form,
					rules,
					"label-width": "120px"
				}, {
					default: withCtx(() => [
						createVNode(_component_ElFormItem, {
							label: "项目名称",
							prop: "name",
							required: ""
						}, {
							default: withCtx(() => [createVNode(_component_ElInput, {
								modelValue: form.name,
								"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.name = $event)
							}, null, 8, ["modelValue"])]),
							_: 1
						}),
						createVNode(_component_ElFormItem, {
							label: "规格型号",
							prop: "model",
							required: ""
						}, {
							default: withCtx(() => [createVNode(_component_ElInput, {
								modelValue: form.model,
								"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.model = $event)
							}, null, 8, ["modelValue"])]),
							_: 1
						}),
						createVNode(_component_ElFormItem, {
							label: "单位",
							prop: "unit",
							required: ""
						}, {
							default: withCtx(() => [createVNode(_component_ElInput, {
								modelValue: form.unit,
								"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.unit = $event),
								maxlength: "20"
							}, null, 8, ["modelValue"])]),
							_: 1
						}),
						createVNode(_component_ElFormItem, {
							label: "税收分类编码",
							prop: "taxClassificationCode",
							required: ""
						}, {
							default: withCtx(() => [createVNode(_component_ElInput, {
								modelValue: form.taxClassificationCode,
								"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.taxClassificationCode = $event),
								maxlength: "19"
							}, null, 8, ["modelValue"])]),
							_: 1
						}),
						createVNode(_component_ElFormItem, { label: "状态" }, {
							default: withCtx(() => [createVNode(_component_ElRadioGroup, {
								modelValue: form.status,
								"onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.status = $event)
							}, {
								default: withCtx(() => [createVNode(_component_ElRadio, { value: "active" }, {
									default: withCtx(() => [..._cache[9] || (_cache[9] = [createTextVNode("启用", -1)])]),
									_: 1
								}), createVNode(_component_ElRadio, { value: "inactive" }, {
									default: withCtx(() => [..._cache[10] || (_cache[10] = [createTextVNode("停用", -1)])]),
									_: 1
								})]),
								_: 1
							}, 8, ["modelValue"])]),
							_: 1
						}),
						createVNode(_component_ElFormItem, { label: "备注" }, {
							default: withCtx(() => [createVNode(_component_ElInput, {
								modelValue: form.remark,
								"onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => form.remark = $event),
								type: "textarea"
							}, null, 8, ["modelValue"])]),
							_: 1
						})
					]),
					_: 1
				}, 8, ["model"]), __props.productId ? (openBlock(), createBlock(PriceVersionList_default, {
					key: 0,
					ref_key: "pvListRef",
					ref: pvListRef,
					"product-id": __props.productId,
					onReload: _cache[6] || (_cache[6] = ($event) => _ctx.$emit("saved"))
				}, null, 8, ["product-id"])) : createCommentVNode("", true)]),
				_: 1
			}, 8, ["model-value", "title"]);
		};
	}
});
//#endregion
//#region src/renderer/pages/inventory/modals/HistoryRecordDialog.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$6 = {
	key: 0,
	class: "history-header"
};
var _hoisted_2$6 = { class: "pagination-container" };
var _hoisted_3$4 = { class: "pagination-container" };
//#endregion
//#region src/renderer/pages/inventory/modals/HistoryRecordDialog.vue
var HistoryRecordDialog_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "HistoryRecordDialog",
	props: {
		visible: { type: Boolean },
		priceVersionId: {}
	},
	emits: ["close"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const dialogVisible = computed({
			get: () => props.visible,
			set: () => emit("close")
		});
		const priceVersion = ref(null);
		const productName = ref("");
		const productModel = ref("");
		const activeTab = ref("ledger");
		const ledgerLoading = ref(false);
		const ledgerRows = ref([]);
		const ledgerTotal = ref(0);
		const ledgerPage = ref(1);
		const ledgerPageSize = ref(50);
		const fieldLoading = ref(false);
		const fieldRows = ref([]);
		const fieldTotal = ref(0);
		const fieldPage = ref(1);
		const fieldPageSize = ref(50);
		const fieldLoaded = ref(false);
		/** 字段路径中文映射 */
		const FIELD_LABELS = {
			status: "启用状态",
			stockBalance: "库存余额",
			unitPriceDecimal: "不含税单价",
			name: "项目名称",
			model: "规格型号",
			unit: "单位",
			taxClassificationCode: "税收分类编码",
			dataStatus: "资料状态",
			remark: "备注"
		};
		function fieldLabel(path) {
			if (path === "*") return "—";
			return FIELD_LABELS[path] ?? path;
		}
		watch(() => props.visible, async (val) => {
			if (val && props.priceVersionId) {
				activeTab.value = "ledger";
				fieldLoaded.value = false;
				ledgerPage.value = 1;
				fieldPage.value = 1;
				try {
					const pv = (await api.catalog.getPriceVersionsByIds([props.priceVersionId]))[0] || null;
					priceVersion.value = pv;
					if (pv) {
						const product = await api.catalog.getProductById(pv.productId);
						productName.value = product?.name ?? "";
						productModel.value = product?.model ?? "";
					} else {
						productName.value = "";
						productModel.value = "";
					}
				} catch {
					priceVersion.value = null;
					productName.value = "";
					productModel.value = "";
				}
				await loadLedger();
			}
		}, { immediate: true });
		watch(activeTab, (tab) => {
			if (tab === "fields" && !fieldLoaded.value && props.priceVersionId) loadFields();
		});
		async function loadLedger() {
			ledgerLoading.value = true;
			try {
				const result = await api.inventory.ledger(props.priceVersionId, ledgerPage.value, ledgerPageSize.value);
				ledgerRows.value = result.rows;
				ledgerTotal.value = result.total;
			} catch (err) {
				ElMessage.error(`加载失败: ${err.message}`);
			} finally {
				ledgerLoading.value = false;
			}
		}
		async function loadFields() {
			fieldLoading.value = true;
			try {
				const result = await api.catalog.fieldHistory({
					entityType: "price_version",
					entityId: props.priceVersionId,
					page: fieldPage.value,
					pageSize: fieldPageSize.value
				});
				fieldRows.value = result.rows;
				fieldTotal.value = result.total;
				fieldLoaded.value = true;
			} catch (err) {
				ElMessage.error(`加载失败: ${err.message}`);
			} finally {
				fieldLoading.value = false;
			}
		}
		function sourceTypeText(type) {
			return {
				initialization: "初始化",
				outbound: "销项开票",
				outbound_void: "销项作废",
				inbound: "进项导入",
				inbound_void: "进项作废",
				adjustment: "人工调整"
			}[type] || type;
		}
		function sourceTypeTag(type) {
			return [
				"initialization",
				"outbound_void",
				"inbound",
				"adjustment"
			].includes(type) ? "success" : "danger";
		}
		function stockTagType(balance) {
			if (balance > 0) return "success";
			if (balance < 0) return "danger";
			return "info";
		}
		function formatTime(iso) {
			if (!iso) return "-";
			const d = new Date(iso);
			if (isNaN(d.getTime())) return iso;
			return d.toLocaleString("zh-CN");
		}
		return (_ctx, _cache) => {
			const _component_ElDescriptionsItem = ElDescriptionsItem;
			const _component_ElTag = ElTag;
			const _component_ElDescriptions = ElDescriptions;
			const _component_ElTableColumn = ElTableColumn;
			const _component_ElTable = ElTable;
			const _component_ElPagination = ElPagination;
			const _component_ElTabPane = ElTabPane;
			const _component_ElTabs = ElTabs;
			const _component_ElButton = ElButton;
			const _component_ElDialog = ElDialog;
			const _directive_loading = vLoading;
			return openBlock(), createBlock(_component_ElDialog, {
				modelValue: dialogVisible.value,
				"onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => dialogVisible.value = $event),
				title: "历史记录",
				width: "90vw",
				top: "5vh",
				"destroy-on-close": "",
				onClose: _cache[7] || (_cache[7] = ($event) => _ctx.$emit("close"))
			}, {
				footer: withCtx(() => [createVNode(_component_ElButton, { onClick: _cache[5] || (_cache[5] = ($event) => _ctx.$emit("close")) }, {
					default: withCtx(() => [..._cache[8] || (_cache[8] = [createTextVNode("关闭", -1)])]),
					_: 1
				})]),
				default: withCtx(() => [priceVersion.value ? (openBlock(), createElementBlock("div", _hoisted_1$6, [createVNode(_component_ElDescriptions, {
					column: 3,
					border: "",
					size: "small"
				}, {
					default: withCtx(() => [
						createVNode(_component_ElDescriptionsItem, { label: "商品" }, {
							default: withCtx(() => [createTextVNode(toDisplayString(productName.value || "-"), 1)]),
							_: 1
						}),
						createVNode(_component_ElDescriptionsItem, { label: "型号" }, {
							default: withCtx(() => [createTextVNode(toDisplayString(productModel.value || "-"), 1)]),
							_: 1
						}),
						createVNode(_component_ElDescriptionsItem, { label: "当前库存" }, {
							default: withCtx(() => [createVNode(_component_ElTag, {
								type: stockTagType(priceVersion.value.stockBalance),
								size: "small"
							}, {
								default: withCtx(() => [createTextVNode(toDisplayString(priceVersion.value.stockBalance), 1)]),
								_: 1
							}, 8, ["type"])]),
							_: 1
						})
					]),
					_: 1
				})])) : createCommentVNode("", true), createVNode(_component_ElTabs, {
					modelValue: activeTab.value,
					"onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => activeTab.value = $event),
					class: "history-tabs"
				}, {
					default: withCtx(() => [createVNode(_component_ElTabPane, {
						label: "库存流水",
						name: "ledger"
					}, {
						default: withCtx(() => [withDirectives((openBlock(), createBlock(_component_ElTable, {
							data: ledgerRows.value,
							border: "",
							stripe: "",
							size: "small",
							"max-height": "400"
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
									label: "变更类型",
									width: "120"
								}, {
									default: withCtx(({ row }) => [createVNode(_component_ElTag, {
										type: sourceTypeTag(row.sourceType),
										size: "small"
									}, {
										default: withCtx(() => [createTextVNode(toDisplayString(sourceTypeText(row.sourceType)), 1)]),
										_: 2
									}, 1032, ["type"])]),
									_: 1
								}),
								createVNode(_component_ElTableColumn, {
									prop: "changeQuantity",
									label: "变更数量",
									width: "100",
									align: "center"
								}, {
									default: withCtx(({ row }) => [createBaseVNode("span", { class: normalizeClass(row.changeQuantity > 0 ? "stock-tag-positive" : "stock-tag-negative") }, toDisplayString(row.changeQuantity > 0 ? "+" : "") + toDisplayString(row.changeQuantity), 3)]),
									_: 1
								}),
								createVNode(_component_ElTableColumn, {
									prop: "balanceBefore",
									label: "变更前余额",
									width: "110",
									align: "center"
								}),
								createVNode(_component_ElTableColumn, {
									prop: "balanceAfter",
									label: "变更后余额",
									width: "110",
									align: "center"
								}),
								createVNode(_component_ElTableColumn, {
									prop: "reason",
									label: "原因",
									"min-width": "200",
									"show-overflow-tooltip": ""
								}, {
									default: withCtx(({ row }) => [createTextVNode(toDisplayString(row.reason || "-"), 1)]),
									_: 1
								})
							]),
							_: 1
						}, 8, ["data"])), [[_directive_loading, ledgerLoading.value]]), createBaseVNode("div", _hoisted_2$6, [createVNode(_component_ElPagination, {
							"current-page": ledgerPage.value,
							"onUpdate:currentPage": _cache[0] || (_cache[0] = ($event) => ledgerPage.value = $event),
							"page-size": ledgerPageSize.value,
							"onUpdate:pageSize": _cache[1] || (_cache[1] = ($event) => ledgerPageSize.value = $event),
							total: ledgerTotal.value,
							"page-sizes": [
								20,
								50,
								100
							],
							layout: "total, sizes, prev, pager, next",
							onCurrentChange: loadLedger,
							onSizeChange: loadLedger
						}, null, 8, [
							"current-page",
							"page-size",
							"total"
						])])]),
						_: 1
					}), createVNode(_component_ElTabPane, {
						label: "字段变更",
						name: "fields"
					}, {
						default: withCtx(() => [withDirectives((openBlock(), createBlock(_component_ElTable, {
							data: fieldRows.value,
							border: "",
							stripe: "",
							size: "small",
							"max-height": "400"
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
						}, 8, ["data"])), [[_directive_loading, fieldLoading.value]]), createBaseVNode("div", _hoisted_3$4, [createVNode(_component_ElPagination, {
							"current-page": fieldPage.value,
							"onUpdate:currentPage": _cache[2] || (_cache[2] = ($event) => fieldPage.value = $event),
							"page-size": fieldPageSize.value,
							"onUpdate:pageSize": _cache[3] || (_cache[3] = ($event) => fieldPageSize.value = $event),
							total: fieldTotal.value,
							"page-sizes": [
								20,
								50,
								100
							],
							layout: "total, sizes, prev, pager, next",
							onCurrentChange: loadFields,
							onSizeChange: loadFields
						}, null, 8, [
							"current-page",
							"page-size",
							"total"
						])])]),
						_: 1
					})]),
					_: 1
				}, 8, ["modelValue"])]),
				_: 1
			}, 8, ["modelValue"]);
		};
	}
}), [["__scopeId", "data-v-d247c98a"]]);
//#endregion
//#region src/renderer/pages/inventory/modals/InventoryAdjustDialog.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$5 = {
	key: 0,
	class: "adjust-content"
};
var _hoisted_2$5 = { class: "preview-balance" };
//#endregion
//#region src/renderer/pages/inventory/modals/InventoryAdjustDialog.vue
var InventoryAdjustDialog_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "InventoryAdjustDialog",
	props: {
		visible: { type: Boolean },
		priceVersionId: {}
	},
	emits: ["close", "saved"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const dialogVisible = computed({
			get: () => props.visible,
			set: () => emit("close")
		});
		const formRef = ref();
		const saving = ref(false);
		const priceVersion = ref(null);
		const productName = ref("");
		const form = reactive({
			changeQuantity: 0,
			reason: ""
		});
		const rules = {
			changeQuantity: [{
				required: true,
				message: "请输入调整量",
				trigger: "blur"
			}, {
				validator: (_rule, value, callback) => {
					if (value === 0) callback(/* @__PURE__ */ new Error("调整量不能为 0"));
					else if (!Number.isInteger(value)) callback(/* @__PURE__ */ new Error("调整量必须为整数"));
					else callback();
				},
				trigger: "blur"
			}],
			reason: [{
				required: true,
				message: "请填写调整原因",
				trigger: "blur"
			}]
		};
		watch(() => props.visible, async (val) => {
			if (val && props.priceVersionId) {
				try {
					const pv = (await api.catalog.getPriceVersionsByIds([props.priceVersionId]))[0] || null;
					priceVersion.value = pv;
					if (pv) {
						const product = await api.catalog.getProductById(pv.productId);
						productName.value = product?.name ?? "";
					} else productName.value = "";
				} catch {
					priceVersion.value = null;
					productName.value = "";
				}
				form.changeQuantity = 0;
				form.reason = "";
			}
		}, { immediate: true });
		async function handleSave() {
			if (!formRef.value) return;
			try {
				await formRef.value.validate();
				saving.value = true;
				await api.inventory.adjust({
					priceVersionId: props.priceVersionId,
					changeQuantity: form.changeQuantity,
					reason: form.reason
				});
				ElMessage.success("调整成功");
				emit("saved");
			} catch (err) {
				ElMessage.error(`调整失败: ${err.message}`);
			} finally {
				saving.value = false;
			}
		}
		return (_ctx, _cache) => {
			const _component_ElDescriptionsItem = ElDescriptionsItem;
			const _component_ElDescriptions = ElDescriptions;
			const _component_ElInputNumber = ElInputNumber;
			const _component_ElFormItem = ElFormItem;
			const _component_ElInput = ElInput;
			const _component_ElForm = ElForm;
			const _component_ElButton = ElButton;
			const _component_ElDialog = ElDialog;
			return openBlock(), createBlock(_component_ElDialog, {
				modelValue: dialogVisible.value,
				"onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => dialogVisible.value = $event),
				title: "库存调整",
				width: "500px",
				"close-on-click-modal": false,
				"destroy-on-close": "",
				onClose: _cache[4] || (_cache[4] = ($event) => _ctx.$emit("close"))
			}, {
				footer: withCtx(() => [createVNode(_component_ElButton, { onClick: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("close")) }, {
					default: withCtx(() => [..._cache[7] || (_cache[7] = [createTextVNode("取消", -1)])]),
					_: 1
				}), createVNode(_component_ElButton, {
					type: "primary",
					loading: saving.value,
					onClick: handleSave
				}, {
					default: withCtx(() => [..._cache[8] || (_cache[8] = [createTextVNode("确认调整", -1)])]),
					_: 1
				}, 8, ["loading"])]),
				default: withCtx(() => [priceVersion.value ? (openBlock(), createElementBlock("div", _hoisted_1$5, [
					createVNode(_component_ElDescriptions, {
						column: 1,
						border: "",
						size: "small"
					}, {
						default: withCtx(() => [createVNode(_component_ElDescriptionsItem, { label: "商品" }, {
							default: withCtx(() => [createTextVNode(toDisplayString(productName.value || "—"), 1)]),
							_: 1
						}), createVNode(_component_ElDescriptionsItem, { label: "当前库存" }, {
							default: withCtx(() => [createTextVNode(toDisplayString(priceVersion.value.stockBalance), 1)]),
							_: 1
						})]),
						_: 1
					}),
					createVNode(_component_ElForm, {
						ref_key: "formRef",
						ref: formRef,
						model: form,
						rules,
						"label-width": "100px",
						style: { "margin-top": "16px" }
					}, {
						default: withCtx(() => [createVNode(_component_ElFormItem, {
							label: "调整量",
							prop: "changeQuantity",
							required: ""
						}, {
							default: withCtx(() => [createVNode(_component_ElInputNumber, {
								modelValue: form.changeQuantity,
								"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.changeQuantity = $event),
								step: 1,
								precision: 0
							}, null, 8, ["modelValue"]), _cache[5] || (_cache[5] = createBaseVNode("span", { class: "hint" }, "正数增加，负数减少，不可为 0", -1))]),
							_: 1
						}), createVNode(_component_ElFormItem, {
							label: "原因",
							prop: "reason",
							required: ""
						}, {
							default: withCtx(() => [createVNode(_component_ElInput, {
								modelValue: form.reason,
								"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.reason = $event),
								type: "textarea",
								rows: 3
							}, null, 8, ["modelValue"])]),
							_: 1
						})]),
						_: 1
					}, 8, ["model"]),
					createBaseVNode("div", _hoisted_2$5, [_cache[6] || (_cache[6] = createTextVNode(" 调整后库存：", -1)), createBaseVNode("strong", null, toDisplayString(priceVersion.value.stockBalance + (form.changeQuantity || 0)), 1)])
				])) : createCommentVNode("", true)]),
				_: 1
			}, 8, ["modelValue"]);
		};
	}
}), [["__scopeId", "data-v-b1d4058a"]]);
//#endregion
//#region src/renderer/pages/inventory/modals/InventoryModalHost.vue
var InventoryModalHost_default = /* @__PURE__ */ defineComponent({
	__name: "InventoryModalHost",
	props: {
		modalType: {},
		editingProductId: {},
		historyPriceVersionId: {},
		adjustPriceVersionId: {},
		outboundLines: {}
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
		function handleOutboundSuccess() {
			emit("saved");
			handleClose();
		}
		return (_ctx, _cache) => {
			return __props.modalType === "outbound" ? (openBlock(), createBlock(OutboundExportDialog_default, {
				key: 0,
				visible: __props.modalType === "outbound",
				"initial-lines": __props.outboundLines,
				onClose: handleClose,
				onSuccess: handleOutboundSuccess
			}, null, 8, ["visible", "initial-lines"])) : __props.modalType === "product-form" ? (openBlock(), createBlock(ProductFormDialog_default, {
				key: 1,
				visible: __props.modalType === "product-form",
				"product-id": __props.editingProductId,
				onClose: handleClose,
				onSaved: handleSaved
			}, null, 8, ["visible", "product-id"])) : __props.modalType === "history" ? (openBlock(), createBlock(HistoryRecordDialog_default, {
				key: 2,
				visible: __props.modalType === "history",
				"price-version-id": __props.historyPriceVersionId,
				onClose: handleClose
			}, null, 8, ["visible", "price-version-id"])) : __props.modalType === "adjust" ? (openBlock(), createBlock(InventoryAdjustDialog_default, {
				key: 3,
				visible: __props.modalType === "adjust",
				"price-version-id": __props.adjustPriceVersionId,
				onClose: handleClose,
				onSaved: handleSaved
			}, null, 8, ["visible", "price-version-id"])) : createCommentVNode("", true);
		};
	}
});
//#endregion
//#region src/renderer/pages/inventory/modals/CatalogInitialImportDialog.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$4 = { class: "import-content" };
var _hoisted_2$4 = {
	key: 0,
	class: "step-content"
};
var _hoisted_3$3 = { class: "file-actions" };
var _hoisted_4$3 = {
	key: 1,
	class: "step-content"
};
var _hoisted_5$2 = { class: "preview-summary" };
var _hoisted_6$2 = { class: "error-text" };
//#endregion
//#region src/renderer/pages/inventory/modals/CatalogInitialImportDialog.vue
var CatalogInitialImportDialog_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "CatalogInitialImportDialog",
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
				if ((await api.catalog.downloadTemplate(true)).saved) ElMessage.success("模板已保存");
			} catch (err) {
				ElMessage.error(`下载失败: ${err.message}`);
			}
		}
		async function handleSelectFile() {
			selecting.value = true;
			try {
				const result = await api.system.selectFile({
					extensions: ["xlsx"],
					title: "选择商品导入文件"
				});
				if (result.canceled || !result.filePath) return;
				const previewResult = await api.catalog.initialImportPreview(result.filePath);
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
			try {
				const result = await api.catalog.initialImportConfirm(previewToken.value);
				ElMessage.success(`成功导入 ${result.products} 个商品，${result.priceVersions} 个价格版本`);
				emit("success");
			} catch (err) {
				ElMessage.error(`导入失败: ${err.message}`);
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
				title: "商品首次初始化导入",
				width: "90vw",
				top: "5vh",
				"close-on-click-modal": false,
				"destroy-on-close": "",
				onClose: handleClose
			}, {
				footer: withCtx(() => [
					createVNode(_component_ElButton, { onClick: handleClose }, {
						default: withCtx(() => [..._cache[6] || (_cache[6] = [createTextVNode("取消", -1)])]),
						_: 1
					}),
					step.value === "preview" ? (openBlock(), createBlock(_component_ElButton, {
						key: 0,
						onClick: _cache[0] || (_cache[0] = ($event) => step.value = "select")
					}, {
						default: withCtx(() => [..._cache[7] || (_cache[7] = [createTextVNode("重新选择", -1)])]),
						_: 1
					})) : createCommentVNode("", true),
					step.value === "preview" ? (openBlock(), createBlock(_component_ElButton, {
						key: 1,
						type: "primary",
						disabled: preview.value?.hasErrors,
						loading: importing.value,
						onClick: handleConfirm
					}, {
						default: withCtx(() => [..._cache[8] || (_cache[8] = [createTextVNode(" 确认导入 ", -1)])]),
						_: 1
					}, 8, ["disabled", "loading"])) : createCommentVNode("", true)
				]),
				default: withCtx(() => [createBaseVNode("div", _hoisted_1$4, [step.value === "select" ? (openBlock(), createElementBlock("div", _hoisted_2$4, [createVNode(_component_ElAlert, {
					type: "info",
					closable: false,
					"show-icon": ""
				}, {
					default: withCtx(() => [..._cache[2] || (_cache[2] = [createTextVNode(" 下载系统模板，填写商品、型号、单位、税收分类编码、单价和初始库存。初始库存允许正数、0 或负数。 ", -1)])]),
					_: 1
				}), createBaseVNode("div", _hoisted_3$3, [createVNode(_component_ElButton, { onClick: handleDownloadTemplate }, {
					default: withCtx(() => [..._cache[3] || (_cache[3] = [createTextVNode("下载模板", -1)])]),
					_: 1
				}), createVNode(_component_ElButton, {
					type: "primary",
					loading: selecting.value,
					onClick: handleSelectFile
				}, {
					default: withCtx(() => [..._cache[4] || (_cache[4] = [createTextVNode("选择文件", -1)])]),
					_: 1
				}, 8, ["loading"])])])) : step.value === "preview" ? (openBlock(), createElementBlock("div", _hoisted_4$3, [
					createBaseVNode("div", _hoisted_5$2, [
						createVNode(_component_ElTag, { type: "success" }, {
							default: withCtx(() => [createTextVNode("新增商品 " + toDisplayString(preview.value?.newProductCount) + " 个", 1)]),
							_: 1
						}),
						createVNode(_component_ElTag, { type: "success" }, {
							default: withCtx(() => [createTextVNode("新增价格版本 " + toDisplayString(preview.value?.newPriceVersionCount) + " 个", 1)]),
							_: 1
						}),
						createVNode(_component_ElTag, null, {
							default: withCtx(() => [createTextVNode("库存合计 " + toDisplayString(preview.value?.totalStockSum), 1)]),
							_: 1
						}),
						preview.value && preview.value.errorCount > 0 ? (openBlock(), createBlock(_component_ElTag, {
							key: 0,
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
						"show-icon": ""
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
								label: "项目名称",
								"min-width": "150"
							}),
							createVNode(_component_ElTableColumn, {
								prop: "model",
								label: "型号",
								width: "100"
							}),
							createVNode(_component_ElTableColumn, {
								prop: "unit",
								label: "单位",
								width: "70"
							}),
							createVNode(_component_ElTableColumn, {
								prop: "taxClassificationCode",
								label: "税收编码",
								"min-width": "130"
							}),
							createVNode(_component_ElTableColumn, {
								prop: "unitPriceDecimal",
								label: "单价",
								width: "110"
							}),
							createVNode(_component_ElTableColumn, {
								prop: "initialStock",
								label: "初始库存",
								width: "90"
							}),
							createVNode(_component_ElTableColumn, {
								label: "状态",
								width: "80"
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
								default: withCtx(({ row }) => [createBaseVNode("span", _hoisted_6$2, toDisplayString(row.errors.join("; ")), 1)]),
								_: 1
							})
						]),
						_: 1
					}, 8, ["data"])
				])) : createCommentVNode("", true)])]),
				_: 1
			}, 8, ["modelValue"]);
		};
	}
}), [["__scopeId", "data-v-1eb6437e"]]);
//#endregion
//#region src/renderer/pages/inventory/modals/CatalogDailyImportDialog.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$3 = { class: "import-content" };
var _hoisted_2$3 = {
	key: 0,
	class: "step-content"
};
var _hoisted_3$2 = { class: "file-actions" };
var _hoisted_4$2 = {
	key: 1,
	class: "step-content"
};
var _hoisted_5$1 = { class: "preview-summary" };
var _hoisted_6$1 = { class: "error-text" };
//#endregion
//#region src/renderer/pages/inventory/modals/CatalogDailyImportDialog.vue
var CatalogDailyImportDialog_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "CatalogDailyImportDialog",
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
				if ((await api.catalog.downloadTemplate(false)).saved) ElMessage.success("模板已保存");
			} catch (err) {
				ElMessage.error(`下载失败: ${err.message}`);
			}
		}
		async function handleSelectFile() {
			selecting.value = true;
			try {
				const result = await api.system.selectFile({
					extensions: ["xlsx"],
					title: "选择商品导入文件"
				});
				if (result.canceled || !result.filePath) return;
				const previewResult = await api.catalog.dailyImportPreview(result.filePath);
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
			try {
				const result = await api.catalog.dailyImportConfirm(previewToken.value);
				ElMessage.success(`成功导入 ${result.products} 个商品，${result.priceVersions} 个价格版本`);
				emit("success");
			} catch (err) {
				ElMessage.error(`导入失败: ${err.message}`);
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
				title: "商品日常导入",
				width: "90vw",
				top: "5vh",
				"close-on-click-modal": false,
				"destroy-on-close": "",
				onClose: handleClose
			}, {
				footer: withCtx(() => [
					createVNode(_component_ElButton, { onClick: handleClose }, {
						default: withCtx(() => [..._cache[6] || (_cache[6] = [createTextVNode("取消", -1)])]),
						_: 1
					}),
					step.value === "preview" ? (openBlock(), createBlock(_component_ElButton, {
						key: 0,
						onClick: _cache[0] || (_cache[0] = ($event) => step.value = "select")
					}, {
						default: withCtx(() => [..._cache[7] || (_cache[7] = [createTextVNode("重新选择", -1)])]),
						_: 1
					})) : createCommentVNode("", true),
					step.value === "preview" ? (openBlock(), createBlock(_component_ElButton, {
						key: 1,
						type: "primary",
						disabled: preview.value?.hasErrors,
						loading: importing.value,
						onClick: handleConfirm
					}, {
						default: withCtx(() => [..._cache[8] || (_cache[8] = [createTextVNode(" 确认导入 ", -1)])]),
						_: 1
					}, 8, ["disabled", "loading"])) : createCommentVNode("", true)
				]),
				default: withCtx(() => [createBaseVNode("div", _hoisted_1$3, [step.value === "select" ? (openBlock(), createElementBlock("div", _hoisted_2$3, [createVNode(_component_ElAlert, {
					type: "info",
					closable: false,
					"show-icon": ""
				}, {
					default: withCtx(() => [..._cache[2] || (_cache[2] = [createTextVNode(" 日常导入只新增商品或价格版本，不修改库存。已有商品的单位或税收分类编码不一致时整批失败。 ", -1)])]),
					_: 1
				}), createBaseVNode("div", _hoisted_3$2, [createVNode(_component_ElButton, { onClick: handleDownloadTemplate }, {
					default: withCtx(() => [..._cache[3] || (_cache[3] = [createTextVNode("下载模板", -1)])]),
					_: 1
				}), createVNode(_component_ElButton, {
					type: "primary",
					loading: selecting.value,
					onClick: handleSelectFile
				}, {
					default: withCtx(() => [..._cache[4] || (_cache[4] = [createTextVNode("选择文件", -1)])]),
					_: 1
				}, 8, ["loading"])])])) : step.value === "preview" ? (openBlock(), createElementBlock("div", _hoisted_4$2, [
					createBaseVNode("div", _hoisted_5$1, [
						createVNode(_component_ElTag, { type: "success" }, {
							default: withCtx(() => [createTextVNode("新增商品 " + toDisplayString(preview.value?.newProductCount) + " 个", 1)]),
							_: 1
						}),
						createVNode(_component_ElTag, { type: "success" }, {
							default: withCtx(() => [createTextVNode("新增价格版本 " + toDisplayString(preview.value?.newPriceVersionCount) + " 个", 1)]),
							_: 1
						}),
						preview.value && preview.value.errorCount > 0 ? (openBlock(), createBlock(_component_ElTag, {
							key: 0,
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
						"show-icon": ""
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
								label: "项目名称",
								"min-width": "150"
							}),
							createVNode(_component_ElTableColumn, {
								prop: "model",
								label: "型号",
								width: "100"
							}),
							createVNode(_component_ElTableColumn, {
								prop: "unit",
								label: "单位",
								width: "70"
							}),
							createVNode(_component_ElTableColumn, {
								prop: "taxClassificationCode",
								label: "税收编码",
								"min-width": "130"
							}),
							createVNode(_component_ElTableColumn, {
								prop: "unitPriceDecimal",
								label: "单价",
								width: "110"
							}),
							createVNode(_component_ElTableColumn, {
								label: "状态",
								width: "80"
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
								default: withCtx(({ row }) => [createBaseVNode("span", _hoisted_6$1, toDisplayString(row.errors.join("; ")), 1)]),
								_: 1
							})
						]),
						_: 1
					}, 8, ["data"])
				])) : createCommentVNode("", true)])]),
				_: 1
			}, 8, ["modelValue"]);
		};
	}
}), [["__scopeId", "data-v-894c9b9e"]]);
//#endregion
//#region src/renderer/pages/inventory/modals/ReplenishmentExportDialog.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$2 = { class: "export-content" };
var _hoisted_2$2 = { class: "toolbar" };
var _hoisted_3$1 = {
	key: 0,
	class: "summary-bar"
};
var _hoisted_4$1 = { class: "total" };
//#endregion
//#region src/renderer/pages/inventory/modals/ReplenishmentExportDialog.vue
var ReplenishmentExportDialog_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "ReplenishmentExportDialog",
	props: { visible: { type: Boolean } },
	emits: ["update:visible", "success"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const dialogVisible = computed({
			get: () => props.visible,
			set: (val) => emit("update:visible", val)
		});
		const previewing = ref(false);
		const exporting = ref(false);
		const preview = ref(null);
		const totalQuantity = computed(() => preview.value?.lines.reduce((s, l) => s + l.replenishmentQuantity, 0) || 0);
		const totalAmountCent = computed(() => preview.value?.lines.reduce((s, l) => s + l.amountCent, 0) || 0);
		const totalTaxCent = computed(() => preview.value?.lines.reduce((s, l) => s + l.taxCent, 0) || 0);
		const totalCent = computed(() => totalAmountCent.value + totalTaxCent.value);
		async function loadPreview() {
			previewing.value = true;
			try {
				preview.value = await api.replenishment.preview();
			} catch (err) {
				ElMessage.error(`加载失败: ${err.message}`);
			} finally {
				previewing.value = false;
			}
		}
		async function handleExport() {
			exporting.value = true;
			try {
				const result = await api.replenishment.export();
				if (!result.exported) ElMessage.info(result.reason || "当前无需向总部补票");
				else if (result.saved) {
					ElMessage.success(`导出成功，导出号: ${result.exportNo}`);
					emit("success");
				} else {
					ElMessage.warning("导出记录已保存，但文件未保存");
					emit("success");
				}
			} catch (err) {
				ElMessage.error(`导出失败: ${err.message}`);
			} finally {
				exporting.value = false;
			}
		}
		function handleClose() {
			dialogVisible.value = false;
		}
		watch(dialogVisible, (val) => {
			if (val) loadPreview();
		});
		return (_ctx, _cache) => {
			const _component_ElButton = ElButton;
			const _component_ElAlert = ElAlert;
			const _component_ElTableColumn = ElTableColumn;
			const _component_ElTag = ElTag;
			const _component_ElTable = ElTable;
			const _component_ElDialog = ElDialog;
			const _directive_loading = vLoading;
			return openBlock(), createBlock(_component_ElDialog, {
				modelValue: dialogVisible.value,
				"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => dialogVisible.value = $event),
				title: "月底负库存导出",
				width: "90vw",
				top: "5vh",
				"destroy-on-close": "",
				onClose: handleClose
			}, {
				footer: withCtx(() => [createVNode(_component_ElButton, { onClick: handleClose }, {
					default: withCtx(() => [..._cache[3] || (_cache[3] = [createTextVNode("关闭", -1)])]),
					_: 1
				}), createVNode(_component_ElButton, {
					type: "primary",
					disabled: !preview.value || preview.value.lines.length === 0,
					loading: exporting.value,
					onClick: handleExport
				}, {
					default: withCtx(() => [..._cache[4] || (_cache[4] = [createTextVNode(" 确认导出 ", -1)])]),
					_: 1
				}, 8, ["disabled", "loading"])]),
				default: withCtx(() => [createBaseVNode("div", _hoisted_1$2, [
					createBaseVNode("div", _hoisted_2$2, [createVNode(_component_ElButton, {
						type: "primary",
						loading: previewing.value,
						onClick: loadPreview
					}, {
						default: withCtx(() => [..._cache[1] || (_cache[1] = [createTextVNode("刷新预览", -1)])]),
						_: 1
					}, 8, ["loading"]), preview.value && preview.value.lines.length === 0 ? (openBlock(), createBlock(_component_ElAlert, {
						key: 0,
						type: "info",
						closable: false,
						"show-icon": ""
					}, {
						default: withCtx(() => [..._cache[2] || (_cache[2] = [createTextVNode(" 当前无需向总部补票 ", -1)])]),
						_: 1
					})) : createCommentVNode("", true)]),
					withDirectives((openBlock(), createBlock(_component_ElTable, {
						data: preview.value?.lines || [],
						border: "",
						stripe: "",
						size: "small",
						"max-height": "450"
					}, {
						default: withCtx(() => [
							createVNode(_component_ElTableColumn, {
								type: "index",
								label: "#",
								width: "50"
							}),
							createVNode(_component_ElTableColumn, {
								prop: "name",
								label: "项目名称",
								"min-width": "150"
							}),
							createVNode(_component_ElTableColumn, {
								prop: "model",
								label: "型号",
								width: "100"
							}),
							createVNode(_component_ElTableColumn, {
								prop: "unit",
								label: "单位",
								width: "70"
							}),
							createVNode(_component_ElTableColumn, {
								prop: "stockBalanceSnapshot",
								label: "当前库存",
								width: "100"
							}, {
								default: withCtx(({ row }) => [createVNode(_component_ElTag, {
									type: "danger",
									size: "small"
								}, {
									default: withCtx(() => [createTextVNode(toDisplayString(row.stockBalanceSnapshot), 1)]),
									_: 2
								}, 1024)]),
								_: 1
							}),
							createVNode(_component_ElTableColumn, {
								prop: "replenishmentQuantity",
								label: "待补数量",
								width: "100"
							}),
							createVNode(_component_ElTableColumn, {
								prop: "unitPriceDecimal",
								label: "不含税单价",
								width: "120"
							}),
							createVNode(_component_ElTableColumn, {
								label: "不含税金额",
								width: "120"
							}, {
								default: withCtx(({ row }) => [createTextVNode(toDisplayString(unref(centToDisplay)(row.amountCent)), 1)]),
								_: 1
							}),
							createVNode(_component_ElTableColumn, {
								label: "税额",
								width: "110"
							}, {
								default: withCtx(({ row }) => [createTextVNode(toDisplayString(unref(centToDisplay)(row.taxCent)), 1)]),
								_: 1
							}),
							createVNode(_component_ElTableColumn, {
								label: "价税合计",
								width: "120"
							}, {
								default: withCtx(({ row }) => [createTextVNode(toDisplayString(unref(centToDisplay)(row.totalCent)), 1)]),
								_: 1
							})
						]),
						_: 1
					}, 8, ["data"])), [[_directive_loading, previewing.value]]),
					preview.value && preview.value.lines.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_3$1, [
						createBaseVNode("span", null, "待补行数：" + toDisplayString(preview.value.lines.length), 1),
						createBaseVNode("span", null, "数量合计：" + toDisplayString(totalQuantity.value), 1),
						createBaseVNode("span", null, "金额：" + toDisplayString(unref(centToDisplay)(totalAmountCent.value)), 1),
						createBaseVNode("span", null, "税额：" + toDisplayString(unref(centToDisplay)(totalTaxCent.value)), 1),
						createBaseVNode("span", _hoisted_4$1, "价税合计：" + toDisplayString(unref(centToDisplay)(totalCent.value)), 1)
					])) : createCommentVNode("", true)
				])]),
				_: 1
			}, 8, ["modelValue"]);
		};
	}
}), [["__scopeId", "data-v-8ee1fe84"]]);
//#endregion
//#region src/renderer/pages/inventory/modals/InboundImportDialog.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$1 = { class: "import-content" };
var _hoisted_2$1 = {
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
//#endregion
//#region src/renderer/pages/inventory/modals/InboundImportDialog.vue
var InboundImportDialog_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "InboundImportDialog",
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
		const downloading = ref(false);
		const activeTab = ref("lines");
		const validLineCount = computed(() => preview.value?.lines.filter((l) => l.errors.length === 0).length || 0);
		/** 下载月初总部进项导入模板。 */
		async function handleDownloadTemplate() {
			downloading.value = true;
			try {
				if ((await api.inbound.downloadTemplate()).saved) ElMessage.success("模板已保存");
			} catch (err) {
				ElMessage.error(`下载失败: ${err.message}`);
			} finally {
				downloading.value = false;
			}
		}
		/** 选择并解析进项导入文件。 */
		async function handleSelectFile() {
			selecting.value = true;
			try {
				const result = await api.system.selectFile({
					extensions: ["xlsx"],
					title: "选择进项 Excel 文件"
				});
				if (result.canceled || !result.filePath) return;
				const previewResult = await api.inbound.preview(result.filePath);
				preview.value = previewResult.preview;
				previewToken.value = previewResult.token;
				step.value = "preview";
			} catch (err) {
				ElMessage.error(`解析失败: ${err.message}`);
			} finally {
				selecting.value = false;
			}
		}
		/** 确认写入当前进项导入批次。 */
		async function handleConfirm() {
			importing.value = true;
			try {
				const result = await api.inbound.confirm(previewToken.value);
				ElMessage.success(`导入成功，批次号: ${result.batchNo}，共 ${result.lineCount} 行`);
				emit("success");
			} catch (err) {
				ElMessage.error(`导入失败: ${err.message}`);
			} finally {
				importing.value = false;
			}
		}
		/** 关闭弹窗并重置导入状态。 */
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
			const _component_ElTabPane = ElTabPane;
			const _component_ElTabs = ElTabs;
			const _component_ElDialog = ElDialog;
			return openBlock(), createBlock(_component_ElDialog, {
				modelValue: dialogVisible.value,
				"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => dialogVisible.value = $event),
				title: "月初总部进项导入",
				width: "90vw",
				top: "5vh",
				"close-on-click-modal": false,
				"destroy-on-close": "",
				onClose: handleClose
			}, {
				footer: withCtx(() => [
					createVNode(_component_ElButton, { onClick: handleClose }, {
						default: withCtx(() => [..._cache[10] || (_cache[10] = [createTextVNode("取消", -1)])]),
						_: 1
					}),
					step.value === "preview" ? (openBlock(), createBlock(_component_ElButton, {
						key: 0,
						onClick: _cache[1] || (_cache[1] = ($event) => step.value = "select")
					}, {
						default: withCtx(() => [..._cache[11] || (_cache[11] = [createTextVNode("重新选择", -1)])]),
						_: 1
					})) : createCommentVNode("", true),
					step.value === "preview" ? (openBlock(), createBlock(_component_ElButton, {
						key: 1,
						type: "primary",
						disabled: preview.value?.hasErrors,
						loading: importing.value,
						onClick: handleConfirm
					}, {
						default: withCtx(() => [..._cache[12] || (_cache[12] = [createTextVNode(" 确认导入 ", -1)])]),
						_: 1
					}, 8, ["disabled", "loading"])) : createCommentVNode("", true)
				]),
				default: withCtx(() => [createBaseVNode("div", _hoisted_1$1, [step.value === "select" ? (openBlock(), createElementBlock("div", _hoisted_2$1, [createVNode(_component_ElAlert, {
					type: "info",
					closable: false,
					"show-icon": ""
				}, {
					default: withCtx(() => [..._cache[3] || (_cache[3] = [createTextVNode(" 请下载系统模板，填写总部进项明细后上传。系统会计算文件哈希和标准化内容哈希，重复导入将被阻止。 ", -1)])]),
					_: 1
				}), createBaseVNode("div", _hoisted_3, [createVNode(_component_ElButton, {
					loading: downloading.value,
					onClick: handleDownloadTemplate
				}, {
					default: withCtx(() => [..._cache[4] || (_cache[4] = [createTextVNode("下载模板", -1)])]),
					_: 1
				}, 8, ["loading"]), createVNode(_component_ElButton, {
					type: "primary",
					loading: selecting.value,
					onClick: handleSelectFile
				}, {
					default: withCtx(() => [..._cache[5] || (_cache[5] = [createTextVNode("选择文件", -1)])]),
					_: 1
				}, 8, ["loading"])])])) : step.value === "preview" ? (openBlock(), createElementBlock("div", _hoisted_4, [
					createBaseVNode("div", _hoisted_5, [
						createVNode(_component_ElTag, { type: "success" }, {
							default: withCtx(() => [createTextVNode("有效行 " + toDisplayString(validLineCount.value), 1)]),
							_: 1
						}),
						preview.value && preview.value.newProductCount > 0 ? (openBlock(), createBlock(_component_ElTag, {
							key: 0,
							type: "warning"
						}, {
							default: withCtx(() => [createTextVNode("新商品 " + toDisplayString(preview.value.newProductCount) + " 个", 1)]),
							_: 1
						})) : createCommentVNode("", true),
						preview.value && preview.value.ignoredRows.length > 0 ? (openBlock(), createBlock(_component_ElTag, {
							key: 1,
							type: "info"
						}, {
							default: withCtx(() => [createTextVNode("忽略费用行 " + toDisplayString(preview.value.ignoredRows.length) + " 行", 1)]),
							_: 1
						})) : createCommentVNode("", true),
						preview.value && preview.value.hasErrors ? (openBlock(), createBlock(_component_ElTag, {
							key: 2,
							type: "danger"
						}, {
							default: withCtx(() => [createTextVNode("错误 " + toDisplayString(preview.value.errors.length) + " 条", 1)]),
							_: 1
						})) : createCommentVNode("", true)
					]),
					preview.value?.hasErrors ? (openBlock(), createBlock(_component_ElAlert, {
						key: 0,
						type: "error",
						closable: false,
						"show-icon": ""
					}, {
						default: withCtx(() => [..._cache[6] || (_cache[6] = [createTextVNode(" 存在错误，整批无法导入。请修正后重新选择文件。 ", -1)])]),
						_: 1
					})) : createCommentVNode("", true),
					createVNode(_component_ElTabs, {
						modelValue: activeTab.value,
						"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => activeTab.value = $event)
					}, {
						default: withCtx(() => [createVNode(_component_ElTabPane, {
							label: "有效明细",
							name: "lines"
						}, {
							default: withCtx(() => [createVNode(_component_ElTable, {
								data: preview.value?.lines || [],
								border: "",
								stripe: "",
								size: "small",
								"max-height": "350"
							}, {
								default: withCtx(() => [
									createVNode(_component_ElTableColumn, {
										prop: "sourceRow",
										label: "行号",
										width: "70"
									}),
									createVNode(_component_ElTableColumn, {
										prop: "invoiceNo",
										label: "发票号",
										width: "130"
									}),
									createVNode(_component_ElTableColumn, {
										prop: "sellerName",
										label: "销售方",
										"min-width": "150",
										"show-overflow-tooltip": ""
									}),
									createVNode(_component_ElTableColumn, {
										prop: "name",
										label: "品名",
										"min-width": "130"
									}),
									createVNode(_component_ElTableColumn, {
										prop: "model",
										label: "型号",
										width: "100"
									}),
									createVNode(_component_ElTableColumn, {
										prop: "unit",
										label: "单位",
										width: "70"
									}),
									createVNode(_component_ElTableColumn, {
										prop: "unitPriceDecimal",
										label: "单价",
										width: "110"
									}),
									createVNode(_component_ElTableColumn, {
										prop: "quantity",
										label: "数量",
										width: "80"
									}),
									createVNode(_component_ElTableColumn, {
										label: "金额",
										width: "100"
									}, {
										default: withCtx(({ row }) => [createTextVNode(toDisplayString(unref(centToDisplay)(row.amountCent)), 1)]),
										_: 1
									}),
									createVNode(_component_ElTableColumn, {
										label: "匹配",
										width: "100"
									}, {
										default: withCtx(({ row }) => [row.isNewProduct ? (openBlock(), createBlock(_component_ElTag, {
											key: 0,
											type: "warning",
											size: "small"
										}, {
											default: withCtx(() => [..._cache[7] || (_cache[7] = [createTextVNode("新商品", -1)])]),
											_: 1
										})) : row.matched ? (openBlock(), createBlock(_component_ElTag, {
											key: 1,
											type: "success",
											size: "small"
										}, {
											default: withCtx(() => [..._cache[8] || (_cache[8] = [createTextVNode("已匹配", -1)])]),
											_: 1
										})) : (openBlock(), createBlock(_component_ElTag, {
											key: 2,
											type: "danger",
											size: "small"
										}, {
											default: withCtx(() => [..._cache[9] || (_cache[9] = [createTextVNode("错误", -1)])]),
											_: 1
										}))]),
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
							}, 8, ["data"])]),
							_: 1
						}), preview.value && preview.value.ignoredRows.length > 0 ? (openBlock(), createBlock(_component_ElTabPane, {
							key: 0,
							label: `忽略行 (${preview.value.ignoredRows.length})`,
							name: "ignored"
						}, {
							default: withCtx(() => [createVNode(_component_ElTable, {
								data: preview.value.ignoredRows,
								border: "",
								size: "small",
								"max-height": "350"
							}, {
								default: withCtx(() => [
									createVNode(_component_ElTableColumn, {
										prop: "sourceRow",
										label: "行号",
										width: "70"
									}),
									createVNode(_component_ElTableColumn, {
										prop: "sourceSheet",
										label: "工作表",
										width: "120"
									}),
									createVNode(_component_ElTableColumn, {
										prop: "reason",
										label: "原因",
										width: "120"
									}),
									createVNode(_component_ElTableColumn, {
										prop: "description",
										label: "描述",
										"min-width": "200"
									})
								]),
								_: 1
							}, 8, ["data"])]),
							_: 1
						}, 8, ["label"])) : createCommentVNode("", true)]),
						_: 1
					}, 8, ["modelValue"])
				])) : createCommentVNode("", true)])]),
				_: 1
			}, 8, ["modelValue"]);
		};
	}
}), [["__scopeId", "data-v-0edcfb35"]]);
//#endregion
//#region src/renderer/pages/inventory/modals/ImportRecordsDialog.vue
var ImportRecordsDialog_default = /* @__PURE__ */ defineComponent({
	__name: "ImportRecordsDialog",
	props: { visible: { type: Boolean } },
	emits: ["update:visible"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const dialogVisible = computed({
			get: () => props.visible,
			set: (val) => emit("update:visible", val)
		});
		const activeTab = ref("inbound");
		const loading = ref(false);
		const inboundBatches = ref([]);
		const replenishmentExports = ref([]);
		watch(dialogVisible, (val) => {
			if (val) {
				loadInbound();
				loadReplenishment();
			}
		});
		async function loadInbound() {
			loading.value = true;
			try {
				const result = await api.inbound.list(1, 100);
				inboundBatches.value = result.rows;
			} catch (err) {
				ElMessage.error(`加载失败: ${err.message}`);
			} finally {
				loading.value = false;
			}
		}
		async function loadReplenishment() {
			try {
				const result = await api.replenishment.list(1, 100);
				replenishmentExports.value = result.rows;
			} catch {}
		}
		async function viewInboundDetail(id) {
			try {
				const detail = await api.inbound.getDetail(id);
				if (detail) ElMessage.info(`批次 ${detail.batch.batchNo}，共 ${detail.lines.length} 行明细`);
			} catch (err) {
				ElMessage.error(`加载失败: ${err.message}`);
			}
		}
		async function voidInbound(row) {
			try {
				const { value } = await ElMessageBox.prompt("请输入作废原因", "作废进项批次", { type: "warning" });
				await api.inbound.void(row.id, value);
				ElMessage.success("作废成功");
				loadInbound();
			} catch (err) {
				if (err !== "cancel") ElMessage.error(`作废失败: ${err.message}`);
			}
		}
		async function downloadReplenishment(id) {
			try {
				if ((await api.replenishment.download(id)).saved) ElMessage.success("文件已保存");
			} catch (err) {
				ElMessage.error(`下载失败: ${err.message}`);
			}
		}
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
			const _component_ElTabPane = ElTabPane;
			const _component_ElTabs = ElTabs;
			const _component_ElDialog = ElDialog;
			const _directive_loading = vLoading;
			return openBlock(), createBlock(_component_ElDialog, {
				modelValue: dialogVisible.value,
				"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => dialogVisible.value = $event),
				title: "导入记录",
				width: "90vw",
				top: "5vh",
				"destroy-on-close": "",
				onClose: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("update:visible", false))
			}, {
				footer: withCtx(() => [createVNode(_component_ElButton, { onClick: _cache[1] || (_cache[1] = ($event) => dialogVisible.value = false) }, {
					default: withCtx(() => [..._cache[7] || (_cache[7] = [createTextVNode("关闭", -1)])]),
					_: 1
				})]),
				default: withCtx(() => [createVNode(_component_ElTabs, {
					modelValue: activeTab.value,
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => activeTab.value = $event)
				}, {
					default: withCtx(() => [createVNode(_component_ElTabPane, {
						label: "进项导入记录",
						name: "inbound"
					}, {
						default: withCtx(() => [withDirectives((openBlock(), createBlock(_component_ElTable, {
							data: inboundBatches.value,
							border: "",
							stripe: "",
							size: "small",
							"max-height": "450"
						}, {
							default: withCtx(() => [
								createVNode(_component_ElTableColumn, {
									prop: "batchNo",
									label: "批次号",
									width: "220"
								}),
								createVNode(_component_ElTableColumn, {
									prop: "originalFileName",
									label: "文件名",
									"min-width": "180",
									"show-overflow-tooltip": ""
								}),
								createVNode(_component_ElTableColumn, {
									prop: "importedAt",
									label: "导入时间",
									width: "170"
								}, {
									default: withCtx(({ row }) => [createTextVNode(toDisplayString(formatTime(row.importedAt)), 1)]),
									_: 1
								}),
								createVNode(_component_ElTableColumn, {
									prop: "status",
									label: "状态",
									width: "90"
								}, {
									default: withCtx(({ row }) => [createVNode(_component_ElTag, {
										type: row.status === "imported" ? "success" : "danger",
										size: "small"
									}, {
										default: withCtx(() => [createTextVNode(toDisplayString(row.status === "imported" ? "有效" : "已作废"), 1)]),
										_: 2
									}, 1032, ["type"])]),
									_: 1
								}),
								createVNode(_component_ElTableColumn, {
									prop: "totalQuantity",
									label: "数量合计",
									width: "100"
								}),
								createVNode(_component_ElTableColumn, {
									label: "金额",
									width: "110"
								}, {
									default: withCtx(({ row }) => [createTextVNode(toDisplayString(unref(centToDisplay)(row.totalAmountCent)), 1)]),
									_: 1
								}),
								createVNode(_component_ElTableColumn, {
									label: "价税合计",
									width: "120"
								}, {
									default: withCtx(({ row }) => [createTextVNode(toDisplayString(unref(centToDisplay)(row.totalCent)), 1)]),
									_: 1
								}),
								createVNode(_component_ElTableColumn, {
									label: "操作",
									width: "120",
									fixed: "right"
								}, {
									default: withCtx(({ row }) => [createVNode(_component_ElButton, {
										link: "",
										type: "primary",
										size: "small",
										onClick: ($event) => viewInboundDetail(row.id)
									}, {
										default: withCtx(() => [..._cache[4] || (_cache[4] = [createTextVNode("详情", -1)])]),
										_: 1
									}, 8, ["onClick"]), row.status === "imported" ? (openBlock(), createBlock(_component_ElButton, {
										key: 0,
										link: "",
										type: "danger",
										size: "small",
										onClick: ($event) => voidInbound(row)
									}, {
										default: withCtx(() => [..._cache[5] || (_cache[5] = [createTextVNode("作废", -1)])]),
										_: 1
									}, 8, ["onClick"])) : createCommentVNode("", true)]),
									_: 1
								})
							]),
							_: 1
						}, 8, ["data"])), [[_directive_loading, loading.value]])]),
						_: 1
					}), createVNode(_component_ElTabPane, {
						label: "月底导出记录",
						name: "replenishment"
					}, {
						default: withCtx(() => [withDirectives((openBlock(), createBlock(_component_ElTable, {
							data: replenishmentExports.value,
							border: "",
							stripe: "",
							size: "small",
							"max-height": "450"
						}, {
							default: withCtx(() => [
								createVNode(_component_ElTableColumn, {
									prop: "exportNo",
									label: "导出号",
									width: "220"
								}),
								createVNode(_component_ElTableColumn, {
									prop: "exportedAt",
									label: "导出时间",
									width: "170"
								}, {
									default: withCtx(({ row }) => [createTextVNode(toDisplayString(formatTime(row.exportedAt)), 1)]),
									_: 1
								}),
								createVNode(_component_ElTableColumn, {
									prop: "lineCount",
									label: "行数",
									width: "80"
								}),
								createVNode(_component_ElTableColumn, {
									prop: "totalQuantity",
									label: "数量合计",
									width: "100"
								}),
								createVNode(_component_ElTableColumn, {
									label: "金额",
									width: "110"
								}, {
									default: withCtx(({ row }) => [createTextVNode(toDisplayString(unref(centToDisplay)(row.totalAmountCent)), 1)]),
									_: 1
								}),
								createVNode(_component_ElTableColumn, {
									label: "价税合计",
									width: "120"
								}, {
									default: withCtx(({ row }) => [createTextVNode(toDisplayString(unref(centToDisplay)(row.totalCent)), 1)]),
									_: 1
								}),
								createVNode(_component_ElTableColumn, {
									label: "操作",
									width: "120",
									fixed: "right"
								}, {
									default: withCtx(({ row }) => [createVNode(_component_ElButton, {
										link: "",
										type: "primary",
										size: "small",
										onClick: ($event) => downloadReplenishment(row.id)
									}, {
										default: withCtx(() => [..._cache[6] || (_cache[6] = [createTextVNode("下载", -1)])]),
										_: 1
									}, 8, ["onClick"])]),
									_: 1
								})
							]),
							_: 1
						}, 8, ["data"])), [[_directive_loading, loading.value]])]),
						_: 1
					})]),
					_: 1
				}, 8, ["modelValue"])]),
				_: 1
			}, 8, ["modelValue"]);
		};
	}
});
//#endregion
//#region src/renderer/pages/inventory/modals/SelectedItemsDialog.vue
var SelectedItemsDialog_default = /* @__PURE__ */ defineComponent({
	__name: "SelectedItemsDialog",
	props: { modelValue: { type: Boolean } },
	emits: ["update:modelValue", "clear"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const selectionStore = useSelectionStore();
		const visible = computed({
			get: () => props.modelValue,
			set: (val) => emit("update:modelValue", val)
		});
		function handleClear() {
			emit("clear");
			visible.value = false;
		}
		return (_ctx, _cache) => {
			const _component_ElTableColumn = ElTableColumn;
			const _component_ElTable = ElTable;
			const _component_ElButton = ElButton;
			const _component_ElDialog = ElDialog;
			return openBlock(), createBlock(_component_ElDialog, {
				modelValue: visible.value,
				"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => visible.value = $event),
				title: "已选价格版本",
				width: "700px"
			}, {
				footer: withCtx(() => [createVNode(_component_ElButton, { onClick: _cache[0] || (_cache[0] = ($event) => visible.value = false) }, {
					default: withCtx(() => [..._cache[2] || (_cache[2] = [createTextVNode("关闭", -1)])]),
					_: 1
				}), createVNode(_component_ElButton, {
					type: "danger",
					onClick: handleClear
				}, {
					default: withCtx(() => [..._cache[3] || (_cache[3] = [createTextVNode("清空已选", -1)])]),
					_: 1
				})]),
				default: withCtx(() => [createVNode(_component_ElTable, {
					data: unref(selectionStore).getSelected(),
					border: "",
					size: "small",
					"max-height": "400"
				}, {
					default: withCtx(() => [
						createVNode(_component_ElTableColumn, {
							prop: "name",
							label: "项目名称",
							"min-width": "150"
						}),
						createVNode(_component_ElTableColumn, {
							prop: "model",
							label: "型号",
							width: "120"
						}),
						createVNode(_component_ElTableColumn, {
							prop: "unit",
							label: "单位",
							width: "80"
						}),
						createVNode(_component_ElTableColumn, {
							prop: "unitPriceDecimal",
							label: "单价",
							width: "120"
						}),
						createVNode(_component_ElTableColumn, {
							prop: "stockBalance",
							label: "库存",
							width: "80"
						})
					]),
					_: 1
				}, 8, ["data"])]),
				_: 1
			}, 8, ["modelValue"]);
		};
	}
});
//#endregion
//#region src/renderer/pages/inventory/useInventoryPage.ts
/**
* InventoryPage 状态和逻辑 composable。
* 从 .vue 中提取以控制文件行数。
*/
function useInventoryPage() {
	const appStore = useAppStore();
	const selectionStore = useSelectionStore();
	const loading = ref(false);
	const rows = ref([]);
	const total = ref(0);
	const showSelected = ref(false);
	const query = reactive({
		keyword: "",
		stockStatus: "all",
		productStatus: "all",
		page: 1,
		pageSize: 50
	});
	const modalType = ref("none");
	const editingProductId = ref("");
	const historyPriceVersionId = ref("");
	const adjustPriceVersionId = ref("");
	const outboundLines = ref([]);
	const initialImportVisible = ref(false);
	const dailyImportVisible = ref(false);
	const replenishmentVisible = ref(false);
	const inboundVisible = ref(false);
	const importRecordsVisible = ref(false);
	onMounted(() => {
		loadData();
	});
	onUnmounted(() => {
		selectionStore.clearSelection();
	});
	async function loadData() {
		loading.value = true;
		try {
			const result = await api.catalog.listPriceVersions(query);
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
		query.stockStatus = "all";
		query.productStatus = "all";
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
	function handleSelectionChange(row, selected) {
		selectionStore.toggleSelection(row, selected);
	}
	function handleOutbound() {
		const selected = selectionStore.getSelected();
		if (selected.length === 0) {
			ElMessage.warning("请先勾选价格版本");
			return;
		}
		outboundLines.value = selected;
		modalType.value = "outbound";
	}
	function handleAddProduct() {
		editingProductId.value = "";
		modalType.value = "product-form";
	}
	function handleEditProduct(row) {
		editingProductId.value = row.productId;
		modalType.value = "product-form";
	}
	function handleViewHistory(row) {
		historyPriceVersionId.value = row.priceVersionId;
		modalType.value = "history";
	}
	function handleAdjustStock(row) {
		adjustPriceVersionId.value = row.priceVersionId;
		modalType.value = "adjust";
	}
	function handleViewHistoryGlobal() {
		const selected = selectionStore.getSelected();
		if (selected.length > 0) historyPriceVersionId.value = selected[0].priceVersionId;
		else {
			ElMessage.info("请先勾选价格版本，或在行操作中点击\"历史记录\"");
			return;
		}
		modalType.value = "history";
	}
	async function handleToggleProductStatus(row) {
		try {
			await ElMessageBox.confirm(`确认${row.productStatus === "active" ? "停用" : "启用"}商品「${row.name}」？`, "确认操作", { type: "warning" });
			await api.catalog.toggleProductStatus(row.productId);
			ElMessage.success("操作成功");
			loadData();
		} catch (err) {
			if (err !== "cancel") ElMessage.error(`操作失败: ${err.message}`);
		}
	}
	async function handleTogglePriceVersionStatus(row) {
		try {
			await ElMessageBox.confirm("确认切换价格版本状态？", "确认操作", { type: "warning" });
			await api.catalog.togglePriceVersionStatus(row.priceVersionId);
			ElMessage.success("操作成功");
			loadData();
		} catch (err) {
			if (err !== "cancel") ElMessage.error(`操作失败: ${err.message}`);
		}
	}
	function handleClearSelection() {
		selectionStore.clearSelection();
		showSelected.value = false;
	}
	function handleImportSuccess() {
		initialImportVisible.value = false;
		dailyImportVisible.value = false;
		appStore.loadInitStatus();
		loadData();
		ElMessage.success("导入成功");
	}
	return {
		appStore,
		selectionStore,
		loading,
		rows,
		total,
		showSelected,
		query,
		modalType,
		editingProductId,
		historyPriceVersionId,
		adjustPriceVersionId,
		outboundLines,
		initialImportVisible,
		dailyImportVisible,
		replenishmentVisible,
		inboundVisible,
		importRecordsVisible,
		loadData,
		handleSearch,
		handleReset,
		handlePageChange,
		handleSizeChange,
		handleSelectionChange,
		handleOutbound,
		handleAddProduct,
		handleEditProduct,
		handleViewHistory,
		handleAdjustStock,
		handleViewHistoryGlobal,
		handleToggleProductStatus,
		handleTogglePriceVersionStatus,
		handleClearSelection,
		handleImportSuccess,
		handleInitialImport: () => {
			initialImportVisible.value = true;
		},
		handleDailyImport: () => {
			dailyImportVisible.value = true;
		},
		handleMonthEndExport: () => {
			replenishmentVisible.value = true;
		},
		handleMonthBeginningImport: () => {
			inboundVisible.value = true;
		},
		handleImportRecords: () => {
			importRecordsVisible.value = true;
		}
	};
}
//#endregion
//#region src/renderer/pages/inventory/InventoryPage.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "content-card" };
var _hoisted_2 = { class: "selection-bar" };
//#endregion
//#region src/renderer/pages/inventory/InventoryPage.vue
var InventoryPage_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "InventoryPage",
	setup(__props) {
		const { selectionStore, loading, rows, total, showSelected, query, modalType, editingProductId, historyPriceVersionId, adjustPriceVersionId, outboundLines, initialImportVisible, dailyImportVisible, replenishmentVisible, inboundVisible, importRecordsVisible, loadData, handleSearch, handleReset, handlePageChange, handleSizeChange, handleSelectionChange, handleOutbound, handleAddProduct, handleEditProduct, handleViewHistory, handleAdjustStock, handleViewHistoryGlobal, handleToggleProductStatus, handleTogglePriceVersionStatus, handleClearSelection, handleImportSuccess, handleInitialImport, handleDailyImport, handleMonthEndExport, handleMonthBeginningImport, handleImportRecords } = useInventoryPage();
		return (_ctx, _cache) => {
			const _component_ElButton = ElButton;
			return openBlock(), createElementBlock("div", _hoisted_1, [
				createVNode(InventoryToolbar_default, {
					keyword: unref(query).keyword,
					"onUpdate:keyword": _cache[0] || (_cache[0] = ($event) => unref(query).keyword = $event),
					"stock-status": unref(query).stockStatus,
					"onUpdate:stockStatus": _cache[1] || (_cache[1] = ($event) => unref(query).stockStatus = $event),
					"product-status": unref(query).productStatus,
					"onUpdate:productStatus": _cache[2] || (_cache[2] = ($event) => unref(query).productStatus = $event),
					onSearch: unref(handleSearch),
					onReset: unref(handleReset),
					onRefresh: unref(loadData),
					onOutbound: unref(handleOutbound),
					onAddProduct: unref(handleAddProduct),
					onInitialImport: unref(handleInitialImport),
					onDailyImport: unref(handleDailyImport),
					onMonthEndExport: unref(handleMonthEndExport),
					onMonthBeginningImport: unref(handleMonthBeginningImport),
					onImportRecords: unref(handleImportRecords),
					onViewHistory: unref(handleViewHistoryGlobal)
				}, null, 8, [
					"keyword",
					"stock-status",
					"product-status",
					"onSearch",
					"onReset",
					"onRefresh",
					"onOutbound",
					"onAddProduct",
					"onInitialImport",
					"onDailyImport",
					"onMonthEndExport",
					"onMonthBeginningImport",
					"onImportRecords",
					"onViewHistory"
				]),
				createBaseVNode("div", _hoisted_2, [
					createBaseVNode("span", null, "已选 " + toDisplayString(unref(selectionStore).selectedCount()) + " 项", 1),
					createVNode(_component_ElButton, {
						link: "",
						type: "primary",
						size: "small",
						onClick: _cache[3] || (_cache[3] = ($event) => showSelected.value = true)
					}, {
						default: withCtx(() => [..._cache[11] || (_cache[11] = [createTextVNode("查看已选", -1)])]),
						_: 1
					}),
					createVNode(_component_ElButton, {
						link: "",
						type: "danger",
						size: "small",
						onClick: unref(handleClearSelection)
					}, {
						default: withCtx(() => [..._cache[12] || (_cache[12] = [createTextVNode("清空已选", -1)])]),
						_: 1
					}, 8, ["onClick"])
				]),
				createVNode(InventoryTable_default, {
					rows: unref(rows),
					loading: unref(loading),
					page: unref(query).page,
					"page-size": unref(query).pageSize,
					total: unref(total),
					onViewHistory: unref(handleViewHistory),
					onEditProduct: unref(handleEditProduct),
					onToggleProductStatus: unref(handleToggleProductStatus),
					onTogglePriceVersionStatus: unref(handleTogglePriceVersionStatus),
					onAdjustStock: unref(handleAdjustStock),
					onPageChange: unref(handlePageChange),
					onSizeChange: unref(handleSizeChange),
					onSelectionChange: unref(handleSelectionChange)
				}, null, 8, [
					"rows",
					"loading",
					"page",
					"page-size",
					"total",
					"onViewHistory",
					"onEditProduct",
					"onToggleProductStatus",
					"onTogglePriceVersionStatus",
					"onAdjustStock",
					"onPageChange",
					"onSizeChange",
					"onSelectionChange"
				]),
				createVNode(InventoryModalHost_default, {
					"modal-type": unref(modalType),
					"onUpdate:modalType": _cache[4] || (_cache[4] = ($event) => isRef(modalType) ? modalType.value = $event : null),
					"editing-product-id": unref(editingProductId),
					"history-price-version-id": unref(historyPriceVersionId),
					"adjust-price-version-id": unref(adjustPriceVersionId),
					"outbound-lines": unref(outboundLines),
					onSaved: unref(loadData)
				}, null, 8, [
					"modal-type",
					"editing-product-id",
					"history-price-version-id",
					"adjust-price-version-id",
					"outbound-lines",
					"onSaved"
				]),
				createVNode(CatalogInitialImportDialog_default, {
					visible: unref(initialImportVisible),
					"onUpdate:visible": _cache[5] || (_cache[5] = ($event) => isRef(initialImportVisible) ? initialImportVisible.value = $event : null),
					onSuccess: unref(handleImportSuccess)
				}, null, 8, ["visible", "onSuccess"]),
				createVNode(CatalogDailyImportDialog_default, {
					visible: unref(dailyImportVisible),
					"onUpdate:visible": _cache[6] || (_cache[6] = ($event) => isRef(dailyImportVisible) ? dailyImportVisible.value = $event : null),
					onSuccess: unref(handleImportSuccess)
				}, null, 8, ["visible", "onSuccess"]),
				createVNode(ReplenishmentExportDialog_default, {
					visible: unref(replenishmentVisible),
					"onUpdate:visible": _cache[7] || (_cache[7] = ($event) => isRef(replenishmentVisible) ? replenishmentVisible.value = $event : null),
					onSuccess: unref(loadData)
				}, null, 8, ["visible", "onSuccess"]),
				createVNode(InboundImportDialog_default, {
					visible: unref(inboundVisible),
					"onUpdate:visible": _cache[8] || (_cache[8] = ($event) => isRef(inboundVisible) ? inboundVisible.value = $event : null),
					onSuccess: unref(loadData)
				}, null, 8, ["visible", "onSuccess"]),
				createVNode(ImportRecordsDialog_default, {
					visible: unref(importRecordsVisible),
					"onUpdate:visible": _cache[9] || (_cache[9] = ($event) => isRef(importRecordsVisible) ? importRecordsVisible.value = $event : null)
				}, null, 8, ["visible"]),
				createVNode(SelectedItemsDialog_default, {
					modelValue: unref(showSelected),
					"onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => isRef(showSelected) ? showSelected.value = $event : null),
					onClear: unref(handleClearSelection)
				}, null, 8, ["modelValue", "onClear"])
			]);
		};
	}
}), [["__scopeId", "data-v-3fc1a21e"]]);
//#endregion
export { InventoryPage_default as default };
