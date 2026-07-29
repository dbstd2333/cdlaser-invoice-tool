import { r as ElCard, t as ElDatePicker } from "./css-D6NkufY2.js";
import { Bi as createVNode, Ca as reactive, Fi as createBlock, G as ElInput, Ii as createCommentVNode, Ka as toDisplayString, Li as createElementBlock, M as ElButton, Na as unref, Ni as computed, Oi as withModifiers, Pi as createBaseVNode, S as ElOption, Ta as ref, Ua as normalizeClass, Vi as defineComponent, _ as ElDescriptions, a as vLoading, c as ElTableColumn, d as ElDialog, ea as onMounted, ga as withDirectives, ha as withCtx, i as ElMessage, k as ElTag, n as api, pa as watch, r as ElMessageBox, ra as openBlock, s as ElTable, t as _plugin_vue_export_helper_default, u as ElPagination, v as ElDescriptionsItem, w as ElSelect, zi as createTextVNode } from "./css-C8sLGSMG.js";
import "./css-DSzxzpYd.js";
import { n as centToDisplay } from "./money-DetyPBwL.js";
//#region src/renderer/pages/outbound-records/components/OutboundRecordsToolbar.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$3 = { class: "outbound-toolbar" };
var _hoisted_2$1 = { class: "toolbar-filters" };
//#endregion
//#region src/renderer/pages/outbound-records/components/OutboundRecordsToolbar.vue
var OutboundRecordsToolbar_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "OutboundRecordsToolbar",
	props: {
		batchNo: {},
		customerName: {},
		productKeyword: {},
		dateFrom: {},
		dateTo: {},
		status: {}
	},
	emits: [
		"update:batchNo",
		"update:customerName",
		"update:productKeyword",
		"update:dateFrom",
		"update:dateTo",
		"update:status",
		"search",
		"reset",
		"refresh"
	],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const localBatchNo = ref(props.batchNo);
		const localCustomerName = ref(props.customerName);
		const localProductKeyword = ref(props.productKeyword);
		const dateRange = computed(() => {
			if (props.dateFrom && props.dateTo) return [props.dateFrom, props.dateTo];
			return null;
		});
		function handleDateChange(val) {
			if (val) {
				emit("update:dateFrom", val[0]);
				emit("update:dateTo", val[1]);
			} else {
				emit("update:dateFrom", "");
				emit("update:dateTo", "");
			}
		}
		return (_ctx, _cache) => {
			const _component_ElInput = ElInput;
			const _component_ElDatePicker = ElDatePicker;
			const _component_ElOption = ElOption;
			const _component_ElSelect = ElSelect;
			const _component_ElButton = ElButton;
			return openBlock(), createElementBlock("div", _hoisted_1$3, [createBaseVNode("div", _hoisted_2$1, [
				createVNode(_component_ElInput, {
					modelValue: localBatchNo.value,
					"onUpdate:modelValue": [_cache[0] || (_cache[0] = ($event) => localBatchNo.value = $event), _cache[1] || (_cache[1] = ($event) => _ctx.$emit("update:batchNo", $event))],
					placeholder: "批次号",
					clearable: "",
					style: { "width": "160px" }
				}, null, 8, ["modelValue"]),
				createVNode(_component_ElInput, {
					modelValue: localCustomerName.value,
					"onUpdate:modelValue": [_cache[2] || (_cache[2] = ($event) => localCustomerName.value = $event), _cache[3] || (_cache[3] = ($event) => _ctx.$emit("update:customerName", $event))],
					placeholder: "客户名称",
					clearable: "",
					style: { "width": "150px" }
				}, null, 8, ["modelValue"]),
				createVNode(_component_ElInput, {
					modelValue: localProductKeyword.value,
					"onUpdate:modelValue": [_cache[4] || (_cache[4] = ($event) => localProductKeyword.value = $event), _cache[5] || (_cache[5] = ($event) => _ctx.$emit("update:productKeyword", $event))],
					placeholder: "商品名称/型号",
					clearable: "",
					style: { "width": "150px" }
				}, null, 8, ["modelValue"]),
				createVNode(_component_ElDatePicker, {
					"model-value": dateRange.value,
					type: "daterange",
					"range-separator": "至",
					"start-placeholder": "开始日期",
					"end-placeholder": "结束日期",
					"value-format": "YYYY-MM-DD",
					style: { "width": "240px" },
					"onUpdate:modelValue": handleDateChange
				}, null, 8, ["model-value"]),
				createVNode(_component_ElSelect, {
					"model-value": __props.status,
					placeholder: "状态",
					style: { "width": "100px" },
					"onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => _ctx.$emit("update:status", $event))
				}, {
					default: withCtx(() => [
						createVNode(_component_ElOption, {
							label: "全部",
							value: "all"
						}),
						createVNode(_component_ElOption, {
							label: "有效",
							value: "valid"
						}),
						createVNode(_component_ElOption, {
							label: "已作废",
							value: "voided"
						})
					]),
					_: 1
				}, 8, ["model-value"]),
				createVNode(_component_ElButton, {
					type: "primary",
					onClick: _cache[7] || (_cache[7] = ($event) => _ctx.$emit("search"))
				}, {
					default: withCtx(() => [..._cache[10] || (_cache[10] = [createTextVNode("搜索", -1)])]),
					_: 1
				}),
				createVNode(_component_ElButton, { onClick: _cache[8] || (_cache[8] = ($event) => _ctx.$emit("reset")) }, {
					default: withCtx(() => [..._cache[11] || (_cache[11] = [createTextVNode("重置", -1)])]),
					_: 1
				}),
				createVNode(_component_ElButton, {
					style: { "margin-left": "auto" },
					onClick: _cache[9] || (_cache[9] = ($event) => _ctx.$emit("refresh"))
				}, {
					default: withCtx(() => [..._cache[12] || (_cache[12] = [createTextVNode("刷新", -1)])]),
					_: 1
				})
			])]);
		};
	}
}), [["__scopeId", "data-v-1aca339e"]]);
//#endregion
//#region src/renderer/pages/outbound-records/components/OutboundRecordsTable.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$2 = { class: "table-container" };
var _hoisted_2 = { class: "pagination-container" };
//#endregion
//#region src/renderer/pages/outbound-records/components/OutboundRecordsTable.vue
var OutboundRecordsTable_default = /* @__PURE__ */ defineComponent({
	__name: "OutboundRecordsTable",
	props: {
		rows: {},
		loading: { type: Boolean },
		page: {},
		pageSize: {},
		total: {}
	},
	emits: [
		"viewDetail",
		"download",
		"void",
		"pageChange",
		"sizeChange"
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
		function handleRowClick(row) {
			emit("viewDetail", row);
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
			return openBlock(), createElementBlock("div", _hoisted_1$2, [withDirectives((openBlock(), createBlock(_component_ElTable, {
				data: __props.rows,
				border: "",
				stripe: "",
				size: "default",
				"max-height": 550,
				onRowClick: handleRowClick
			}, {
				default: withCtx(() => [
					createVNode(_component_ElTableColumn, {
						prop: "batchNo",
						label: "开票批次号",
						width: "220",
						"show-overflow-tooltip": ""
					}),
					createVNode(_component_ElTableColumn, {
						label: "客户名称",
						"min-width": "150"
					}, {
						default: withCtx(({ row }) => [createTextVNode(toDisplayString(row.customerSnapshot?.name || "-"), 1)]),
						_: 1
					}),
					createVNode(_component_ElTableColumn, {
						prop: "exportedAt",
						label: "Excel 导出时间",
						width: "170"
					}, {
						default: withCtx(({ row }) => [createTextVNode(toDisplayString(formatTime(row.exportedAt)), 1)]),
						_: 1
					}),
					createVNode(_component_ElTableColumn, {
						prop: "status",
						label: "状态",
						width: "90",
						align: "center"
					}, {
						default: withCtx(({ row }) => [createVNode(_component_ElTag, {
							type: row.status === "valid" ? "success" : "danger",
							size: "small"
						}, {
							default: withCtx(() => [createTextVNode(toDisplayString(row.status === "valid" ? "有效" : "已作废"), 1)]),
							_: 2
						}, 1032, ["type"])]),
						_: 1
					}),
					createVNode(_component_ElTableColumn, {
						prop: "lineCount",
						label: "明细行数",
						width: "100",
						align: "center"
					}),
					createVNode(_component_ElTableColumn, {
						prop: "totalQuantity",
						label: "数量合计",
						width: "100",
						align: "center"
					}),
					createVNode(_component_ElTableColumn, {
						label: "金额",
						width: "120"
					}, {
						default: withCtx(({ row }) => [createTextVNode(toDisplayString(unref(centToDisplay)(row.totalAmountCent)), 1)]),
						_: 1
					}),
					createVNode(_component_ElTableColumn, {
						label: "税额",
						width: "120"
					}, {
						default: withCtx(({ row }) => [createTextVNode(toDisplayString(unref(centToDisplay)(row.totalTaxCent)), 1)]),
						_: 1
					}),
					createVNode(_component_ElTableColumn, {
						label: "价税合计",
						width: "130"
					}, {
						default: withCtx(({ row }) => [createTextVNode(toDisplayString(unref(centToDisplay)(row.totalCent)), 1)]),
						_: 1
					}),
					createVNode(_component_ElTableColumn, {
						label: "操作",
						width: "200",
						fixed: "right"
					}, {
						default: withCtx(({ row }) => [
							createVNode(_component_ElButton, {
								link: "",
								type: "primary",
								size: "small",
								onClick: withModifiers(($event) => _ctx.$emit("viewDetail", row), ["stop"])
							}, {
								default: withCtx(() => [..._cache[4] || (_cache[4] = [createTextVNode("查看明细", -1)])]),
								_: 1
							}, 8, ["onClick"]),
							createVNode(_component_ElButton, {
								link: "",
								type: "info",
								size: "small",
								onClick: withModifiers(($event) => _ctx.$emit("download", row), ["stop"])
							}, {
								default: withCtx(() => [..._cache[5] || (_cache[5] = [createTextVNode("下载", -1)])]),
								_: 1
							}, 8, ["onClick"]),
							row.status === "valid" ? (openBlock(), createBlock(_component_ElButton, {
								key: 0,
								link: "",
								type: "danger",
								size: "small",
								onClick: withModifiers(($event) => _ctx.$emit("void", row), ["stop"])
							}, {
								default: withCtx(() => [..._cache[6] || (_cache[6] = [createTextVNode("作废", -1)])]),
								_: 1
							}, 8, ["onClick"])) : createCommentVNode("", true)
						]),
						_: 1
					})
				]),
				_: 1
			}, 8, ["data"])), [[_directive_loading, __props.loading]]), createBaseVNode("div", _hoisted_2, [createVNode(_component_ElPagination, {
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
//#region src/renderer/pages/outbound-records/modals/OutboundRecordDetailDialog.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1$1 = {
	key: 0,
	class: "detail-content"
};
//#endregion
//#region src/renderer/pages/outbound-records/modals/OutboundRecordDetailDialog.vue
var OutboundRecordDetailDialog_default = /*#__PURE__*/ _plugin_vue_export_helper_default(/* @__PURE__ */ defineComponent({
	__name: "OutboundRecordDetailDialog",
	props: {
		visible: { type: Boolean },
		batchId: {}
	},
	emits: ["update:visible"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const dialogVisible = computed({
			get: () => props.visible,
			set: (val) => emit("update:visible", val)
		});
		const loading = ref(false);
		const detail = ref(null);
		watch(() => props.visible, async (val) => {
			if (val && props.batchId) {
				loading.value = true;
				try {
					detail.value = await api.outbound.getDetail(props.batchId);
				} catch (err) {
					ElMessage.error(`加载失败: ${err.message}`);
				} finally {
					loading.value = false;
				}
			}
		});
		function stockClass(balance) {
			if (balance > 0) return "stock-tag-positive";
			if (balance < 0) return "stock-tag-negative";
			return "stock-tag-zero";
		}
		function formatTime(iso) {
			if (!iso) return "-";
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
			const _component_ElCard = ElCard;
			const _component_ElTableColumn = ElTableColumn;
			const _component_ElTable = ElTable;
			const _component_ElButton = ElButton;
			const _component_ElDialog = ElDialog;
			const _directive_loading = vLoading;
			return openBlock(), createBlock(_component_ElDialog, {
				modelValue: dialogVisible.value,
				"onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => dialogVisible.value = $event),
				title: "开票明细",
				width: "90vw",
				top: "5vh",
				"destroy-on-close": "",
				onClose: _cache[2] || (_cache[2] = ($event) => _ctx.$emit("update:visible", false))
			}, {
				footer: withCtx(() => [createVNode(_component_ElButton, { onClick: _cache[0] || (_cache[0] = ($event) => dialogVisible.value = false) }, {
					default: withCtx(() => [..._cache[6] || (_cache[6] = [createTextVNode("关闭", -1)])]),
					_: 1
				})]),
				default: withCtx(() => [withDirectives((openBlock(), createElementBlock("div", null, [detail.value ? (openBlock(), createElementBlock("div", _hoisted_1$1, [
					createVNode(_component_ElCard, {
						shadow: "never",
						class: "summary-card"
					}, {
						default: withCtx(() => [createVNode(_component_ElDescriptions, {
							column: 3,
							border: "",
							size: "small"
						}, {
							default: withCtx(() => [
								createVNode(_component_ElDescriptionsItem, { label: "批次号" }, {
									default: withCtx(() => [createTextVNode(toDisplayString(detail.value.batch.batchNo), 1)]),
									_: 1
								}),
								createVNode(_component_ElDescriptionsItem, { label: "客户" }, {
									default: withCtx(() => [createTextVNode(toDisplayString(detail.value.batch.customerSnapshot?.name), 1)]),
									_: 1
								}),
								createVNode(_component_ElDescriptionsItem, { label: "导出时间" }, {
									default: withCtx(() => [createTextVNode(toDisplayString(formatTime(detail.value.batch.exportedAt)), 1)]),
									_: 1
								}),
								createVNode(_component_ElDescriptionsItem, { label: "状态" }, {
									default: withCtx(() => [createVNode(_component_ElTag, {
										type: detail.value.batch.status === "valid" ? "success" : "danger",
										size: "small"
									}, {
										default: withCtx(() => [createTextVNode(toDisplayString(detail.value.batch.status === "valid" ? "有效" : "已作废"), 1)]),
										_: 1
									}, 8, ["type"])]),
									_: 1
								}),
								createVNode(_component_ElDescriptionsItem, { label: "数量合计" }, {
									default: withCtx(() => [createTextVNode(toDisplayString(detail.value.batch.totalQuantity), 1)]),
									_: 1
								}),
								createVNode(_component_ElDescriptionsItem, { label: "明细行数" }, {
									default: withCtx(() => [createTextVNode(toDisplayString(detail.value.batch.lineCount), 1)]),
									_: 1
								}),
								createVNode(_component_ElDescriptionsItem, { label: "金额" }, {
									default: withCtx(() => [createTextVNode(toDisplayString(unref(centToDisplay)(detail.value.batch.totalAmountCent)), 1)]),
									_: 1
								})
							]),
							_: 1
						})]),
						_: 1
					}),
					detail.value.batch.status === "voided" ? (openBlock(), createBlock(_component_ElCard, {
						key: 0,
						shadow: "never",
						class: "void-card"
					}, {
						default: withCtx(() => [createVNode(_component_ElDescriptions, {
							column: 2,
							border: "",
							size: "small"
						}, {
							default: withCtx(() => [createVNode(_component_ElDescriptionsItem, { label: "作废时间" }, {
								default: withCtx(() => [createTextVNode(toDisplayString(formatTime(detail.value.batch.voidedAt)), 1)]),
								_: 1
							}), createVNode(_component_ElDescriptionsItem, { label: "作废原因" }, {
								default: withCtx(() => [createTextVNode(toDisplayString(detail.value.batch.voidReason), 1)]),
								_: 1
							})]),
							_: 1
						})]),
						_: 1
					})) : createCommentVNode("", true),
					createVNode(_component_ElCard, { shadow: "never" }, {
						header: withCtx(() => [..._cache[3] || (_cache[3] = [createTextVNode("商品明细", -1)])]),
						default: withCtx(() => [createVNode(_component_ElTable, {
							data: detail.value.lines,
							border: "",
							stripe: "",
							size: "small",
							"max-height": "400"
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
									prop: "unitPriceDecimal",
									label: "含税单价",
									width: "120"
								}),
								createVNode(_component_ElTableColumn, {
									prop: "taxRate",
									label: "税率",
									width: "80"
								}, {
									default: withCtx(() => [..._cache[4] || (_cache[4] = [createTextVNode("0.13", -1)])]),
									_: 1
								}),
								createVNode(_component_ElTableColumn, {
									prop: "quantity",
									label: "数量",
									width: "80"
								}),
								createVNode(_component_ElTableColumn, {
									label: "金额",
									width: "110"
								}, {
									default: withCtx(({ row }) => [createTextVNode(toDisplayString(unref(centToDisplay)(row.amountCent)), 1)]),
									_: 1
								}),
								createVNode(_component_ElTableColumn, {
									label: "扣减前库存 -> 扣减后库存",
									width: "200",
									align: "center"
								}, {
									default: withCtx(({ row }) => [
										createBaseVNode("span", { class: normalizeClass(stockClass(row.stockBefore)) }, toDisplayString(row.stockBefore), 3),
										_cache[5] || (_cache[5] = createBaseVNode("span", { class: "arrow" }, " -> ", -1)),
										createBaseVNode("span", { class: normalizeClass(stockClass(row.stockAfter)) }, toDisplayString(row.stockAfter), 3)
									]),
									_: 1
								})
							]),
							_: 1
						}, 8, ["data"])]),
						_: 1
					})
				])) : createCommentVNode("", true)])), [[_directive_loading, loading.value]])]),
				_: 1
			}, 8, ["modelValue"]);
		};
	}
}), [["__scopeId", "data-v-f443ad84"]]);
//#endregion
//#region src/renderer/pages/outbound-records/OutboundRecordsPage.vue?vue&type=script&setup=true&lang.ts
var _hoisted_1 = { class: "content-card" };
//#endregion
//#region src/renderer/pages/outbound-records/OutboundRecordsPage.vue
var OutboundRecordsPage_default = /* @__PURE__ */ defineComponent({
	__name: "OutboundRecordsPage",
	setup(__props) {
		const loading = ref(false);
		const rows = ref([]);
		const total = ref(0);
		const detailVisible = ref(false);
		const detailBatchId = ref("");
		const query = reactive({
			batchNo: "",
			customerName: "",
			productKeyword: "",
			dateFrom: "",
			dateTo: "",
			status: "all",
			page: 1,
			pageSize: 50
		});
		onMounted(() => {
			loadData();
		});
		async function loadData() {
			loading.value = true;
			try {
				const result = await api.outbound.list(query);
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
			query.batchNo = "";
			query.customerName = "";
			query.productKeyword = "";
			query.dateFrom = "";
			query.dateTo = "";
			query.status = "all";
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
		function handleViewDetail(row) {
			detailBatchId.value = row.id;
			detailVisible.value = true;
		}
		async function handleDownload(row) {
			try {
				if ((await api.outbound.download(row.id)).saved) ElMessage.success("文件已保存");
			} catch (err) {
				ElMessage.error(`下载失败: ${err.message}`);
			}
		}
		async function handleVoid(row) {
			try {
				const { value } = await ElMessageBox.prompt("请输入作废原因", "作废开票记录", {
					type: "warning",
					inputValidator: (val) => !!val?.trim() || "作废原因必填"
				});
				await ElMessageBox.confirm("作废后将恢复库存，且不可撤销。确认作废？", "最终确认", { type: "warning" });
				await api.outbound.void(row.id, value);
				ElMessage.success("作废成功");
				loadData();
			} catch (err) {
				if (err !== "cancel") ElMessage.error(`作废失败: ${err.message}`);
			}
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", _hoisted_1, [
				createVNode(OutboundRecordsToolbar_default, {
					"batch-no": query.batchNo,
					"onUpdate:batchNo": _cache[0] || (_cache[0] = ($event) => query.batchNo = $event),
					"customer-name": query.customerName,
					"onUpdate:customerName": _cache[1] || (_cache[1] = ($event) => query.customerName = $event),
					"product-keyword": query.productKeyword,
					"onUpdate:productKeyword": _cache[2] || (_cache[2] = ($event) => query.productKeyword = $event),
					"date-from": query.dateFrom,
					"onUpdate:dateFrom": _cache[3] || (_cache[3] = ($event) => query.dateFrom = $event),
					"date-to": query.dateTo,
					"onUpdate:dateTo": _cache[4] || (_cache[4] = ($event) => query.dateTo = $event),
					status: query.status,
					"onUpdate:status": _cache[5] || (_cache[5] = ($event) => query.status = $event),
					onSearch: handleSearch,
					onReset: handleReset,
					onRefresh: loadData
				}, null, 8, [
					"batch-no",
					"customer-name",
					"product-keyword",
					"date-from",
					"date-to",
					"status"
				]),
				createVNode(OutboundRecordsTable_default, {
					rows: rows.value,
					loading: loading.value,
					page: query.page,
					"page-size": query.pageSize,
					total: total.value,
					onViewDetail: handleViewDetail,
					onDownload: handleDownload,
					onVoid: handleVoid,
					onPageChange: handlePageChange,
					onSizeChange: handleSizeChange
				}, null, 8, [
					"rows",
					"loading",
					"page",
					"page-size",
					"total"
				]),
				createVNode(OutboundRecordDetailDialog_default, {
					visible: detailVisible.value,
					"onUpdate:visible": _cache[6] || (_cache[6] = ($event) => detailVisible.value = $event),
					"batch-id": detailBatchId.value
				}, null, 8, ["visible", "batch-id"])
			]);
		};
	}
});
//#endregion
export { OutboundRecordsPage_default as default };
