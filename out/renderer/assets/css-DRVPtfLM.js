import { $n as isFirefox, An as getEventCode, Bi as createVNode, Bn as cAF, Ca as reactive, Da as shallowRef, Di as withKeys, Ei as vShow, Fi as createBlock, Fr as definePropType, G as ElInput, Ga as normalizeStyle, H as isGreaterThan, Ha as isString, Hi as getCurrentInstance, Hn as useNamespace, Hr as isNumber, Ii as createCommentVNode, Jr as isUndefined$1, Jt as plus_default, Ki as inject, Li as createElementBlock, Ma as triggerRef, Mr as throwError, Mt as close_default, Na as unref, Ni as computed, Oi as withModifiers, Pa as NOOP, Pr as buildProps, Qi as onBeforeUpdate, Ri as createSlots, Ta as ref, Ua as normalizeClass, Un as useLocale, Vi as defineComponent, Vn as rAF, Wi as h, Wr as isUndefined, Wt as minus_default, Xn as capitalize, Yi as nextTick, Yr as isNil, Zi as onBeforeUnmount, _i as INPUT_EVENT, _t as arrow_down_default, at as useFormDisabled, bn as useSizeProp, br as useWindowFocus, bt as arrow_up_default, dn as withInstall, dt as ElIcon, ea as onMounted, fa as useSlots, fr as useDocumentVisibility, ga as withDirectives, gi as CHANGE_EVENT, ha as withCtx, hn as useAriaProps, ia as provide, jn as getEventKey, jr as debugWarn, mn as withNoopInstall, mr as useElementSize, na as onUpdated, oa as renderSlot, oi as clamp, ot as useFormSize, pa as watch, q as mutable, qi as isVNode, qr as omit, ra as openBlock, rt as useFormItem, vi as UPDATE_MODEL_EVENT, vr as useResizeObserver, vt as arrow_left_default, xn as flattedChildren, yi as EVENT_CODE, yt as arrow_right_default } from "./css-C8sLGSMG.js";
import { t as vRepeatClick } from "./repeat-click-Cea55C_m.js";
//#region node_modules/element-plus/es/hooks/use-ordered-children/index.mjs
var getOrderedChildren = (vm, childComponentName, children) => {
	return flattedChildren(vm.subTree).filter((n) => isVNode(n) && n.type?.name === childComponentName && !!n.component).map((n) => n.component.uid).map((uid) => children[uid]).filter((p) => !!p);
};
var useOrderedChildren = (vm, childComponentName) => {
	const children = shallowRef({});
	const orderedChildren = shallowRef([]);
	const nodesMap = /* @__PURE__ */ new WeakMap();
	const addChild = (child) => {
		children.value[child.uid] = child;
		triggerRef(children);
		onMounted(() => {
			const childNode = child.getVnode().el;
			const parentNode = childNode.parentNode;
			if (!nodesMap.has(parentNode)) {
				nodesMap.set(parentNode, []);
				const originalFn = parentNode.insertBefore.bind(parentNode);
				parentNode.insertBefore = (node, anchor) => {
					if (nodesMap.get(parentNode).some((el) => node === el || anchor === el)) triggerRef(children);
					return originalFn(node, anchor);
				};
			}
			nodesMap.get(parentNode).push(childNode);
		});
	};
	const removeChild = (child) => {
		delete children.value[child.uid];
		triggerRef(children);
		const childNode = child.getVnode().el;
		const parentNode = childNode.parentNode;
		const childNodes = nodesMap.get(parentNode);
		const index = childNodes.indexOf(childNode);
		childNodes.splice(index, 1);
	};
	const sortChildren = () => {
		orderedChildren.value = getOrderedChildren(vm, childComponentName, children.value);
	};
	const IsolatedRenderer = (props) => {
		return props.render();
	};
	return {
		children: orderedChildren,
		addChild,
		removeChild,
		ChildrenSorter: defineComponent({ setup(_, { slots }) {
			return () => {
				sortChildren();
				return slots.default ? h(IsolatedRenderer, { render: slots.default }) : null;
			};
		} })
	};
};
//#endregion
//#region node_modules/element-plus/es/components/virtual-list/src/hooks/use-wheel.mjs
var useWheel = ({ atEndEdge, atStartEdge, layout }, onWheelDelta) => {
	let frameHandle;
	let offset = 0;
	const hasReachedEdge = (offset) => {
		return offset < 0 && atStartEdge.value || offset > 0 && atEndEdge.value;
	};
	const onWheel = (e) => {
		cAF(frameHandle);
		let { deltaX, deltaY } = e;
		if (e.shiftKey && deltaY !== 0) {
			deltaX = deltaY;
			deltaY = 0;
		}
		const newOffset = layout.value === "horizontal" ? deltaX : deltaY;
		if (hasReachedEdge(newOffset)) return;
		offset += newOffset;
		if (!isFirefox() && newOffset !== 0) e.preventDefault();
		frameHandle = rAF(() => {
			onWheelDelta(offset);
			offset = 0;
		});
	};
	return {
		hasReachedEdge,
		onWheel
	};
};
//#endregion
//#region node_modules/element-plus/es/utils/dom/position.mjs
var getOffsetTop = (el) => {
	let offset = 0;
	let parent = el;
	while (parent) {
		offset += parent.offsetTop;
		parent = parent.offsetParent;
	}
	return offset;
};
var getOffsetTopDistance = (el, containerEl) => {
	return Math.abs(getOffsetTop(el) - getOffsetTop(containerEl));
};
var getClientXY = (event) => {
	let clientX;
	let clientY;
	if (event.type === "touchend") {
		clientY = event.changedTouches[0].clientY;
		clientX = event.changedTouches[0].clientX;
	} else if (event.type.startsWith("touch")) {
		clientY = event.touches[0].clientY;
		clientX = event.touches[0].clientX;
	} else {
		clientY = event.clientY;
		clientX = event.clientX;
	}
	return {
		clientX,
		clientY
	};
};
//#endregion
//#region node_modules/element-plus/es/components/input-number/src/input-number.mjs
/**
* @deprecated Removed after 3.0.0, Use `InputNumberProps` instead.
*/
var inputNumberProps = buildProps({
	/**
	* @description same as `id` in native input
	*/
	id: {
		type: String,
		default: void 0
	},
	/**
	* @description incremental step
	*/
	step: {
		type: Number,
		default: 1
	},
	/**
	* @description whether input value can only be multiple of step
	*/
	stepStrictly: Boolean,
	/**
	* @description the maximum allowed value
	*/
	max: {
		type: Number,
		default: Number.MAX_SAFE_INTEGER
	},
	/**
	* @description the minimum allowed value
	*/
	min: {
		type: Number,
		default: Number.MIN_SAFE_INTEGER
	},
	/**
	* @description binding value
	*/
	modelValue: { type: [Number, null] },
	/**
	* @description same as `readonly` in native input
	*/
	readonly: Boolean,
	/**
	* @description whether the component is disabled
	*/
	disabled: {
		type: Boolean,
		default: void 0
	},
	/**
	* @description size of the component
	*/
	size: useSizeProp,
	/**
	* @description whether to enable the control buttons
	*/
	controls: {
		type: Boolean,
		default: true
	},
	/**
	* @description position of the control buttons
	*/
	controlsPosition: {
		type: String,
		default: "",
		values: ["", "right"]
	},
	/**
	* @description value should be set when input box is cleared
	*/
	valueOnClear: {
		type: definePropType([
			String,
			Number,
			null
		]),
		validator: (val) => val === null || isNumber(val) || ["min", "max"].includes(val),
		default: null
	},
	/**
	* @description same as `name` in native input
	*/
	name: String,
	/**
	* @description same as `placeholder` in native input
	*/
	placeholder: String,
	/**
	* @description precision of input value
	*/
	precision: {
		type: Number,
		validator: (val) => val >= 0 && val === Number.parseInt(`${val}`, 10)
	},
	/**
	* @description whether to trigger form validation
	*/
	validateEvent: {
		type: Boolean,
		default: true
	},
	...useAriaProps(["ariaLabel"]),
	/**
	* @description native input mode for virtual keyboards
	*/
	inputmode: {
		type: definePropType(String),
		default: void 0
	},
	/**
	* @description alignment for the inner input text
	*/
	align: {
		type: definePropType(String),
		default: "center"
	},
	/**
	* @description whether to disable scientific notation input (e.g. 'e', 'E')
	*/
	disabledScientific: Boolean,
	/**
	* @description specifies the format of the value presented in the input
	*/
	formatter: { type: Function },
	/**
	* @description specifies the value extracted from the formatted input
	*/
	parser: { type: Function },
	/**
	* @description same as `tabindex` in native input
	*/
	tabindex: {
		type: [String, Number],
		default: 0
	}
});
var inputNumberEmits = {
	[CHANGE_EVENT]: (cur, prev) => prev !== cur,
	blur: (e) => e instanceof FocusEvent,
	focus: (e) => e instanceof FocusEvent,
	[INPUT_EVENT]: (val) => isNumber(val) || isNil(val),
	[UPDATE_MODEL_EVENT]: (val) => isNumber(val) || isNil(val)
};
//#endregion
//#region node_modules/element-plus/es/components/input-number/src/input-number.vue_vue_type_script_setup_true_lang.mjs
var _hoisted_1$1 = ["aria-label"];
var _hoisted_2 = ["aria-label"];
//#endregion
//#region node_modules/element-plus/es/components/input-number/index.mjs
var ElInputNumber = withInstall(/* @__PURE__ */ defineComponent({
	name: "ElInputNumber",
	__name: "input-number",
	props: inputNumberProps,
	emits: inputNumberEmits,
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const { t } = useLocale();
		const ns = useNamespace("input-number");
		const input = ref();
		const data = reactive({
			currentValue: props.modelValue,
			userInput: null
		});
		const { formItem } = useFormItem();
		const minDisabled = computed(() => isNumber(props.modelValue) && props.modelValue <= props.min);
		const maxDisabled = computed(() => isNumber(props.modelValue) && props.modelValue >= props.max);
		const numPrecision = computed(() => {
			const stepPrecision = getPrecision(props.step);
			if (!isUndefined(props.precision)) {
				if (stepPrecision > props.precision) debugWarn("InputNumber", "precision should not be less than the decimal places of step");
				return props.precision;
			} else return Math.max(getPrecision(props.modelValue), stepPrecision);
		});
		const controlsAtRight = computed(() => {
			return props.controls && props.controlsPosition === "right";
		});
		const inputNumberSize = useFormSize();
		const inputNumberDisabled = useFormDisabled();
		const displayValue = computed(() => {
			if (data.userInput !== null) return data.userInput;
			let currentValue = data.currentValue;
			if (isNil(currentValue)) return "";
			if (isNumber(currentValue)) {
				if (Number.isNaN(currentValue)) return "";
				if (!isUndefined(props.precision)) currentValue = currentValue.toFixed(props.precision);
			}
			return currentValue;
		});
		const toPrecision = (num, pre) => {
			if (isUndefined(pre)) pre = numPrecision.value;
			if (pre === 0) return Math.round(num);
			let snum = String(num);
			const pointPos = snum.indexOf(".");
			if (pointPos === -1) return num;
			if (!snum.replace(".", "").split("")[pointPos + pre]) return num;
			const length = snum.length;
			if (snum.charAt(length - 1) === "5") snum = `${snum.slice(0, Math.max(0, length - 1))}6`;
			return Number.parseFloat(Number(snum).toFixed(pre));
		};
		const getPrecision = (value) => {
			if (isNil(value)) return 0;
			const valueString = value.toString();
			const dotPosition = valueString.indexOf(".");
			let precision = 0;
			if (dotPosition !== -1) precision = valueString.length - dotPosition - 1;
			return precision;
		};
		const ensurePrecision = (val, coefficient = 1) => {
			if (!isNumber(val)) return data.currentValue;
			if (val >= Number.MAX_SAFE_INTEGER && coefficient === 1) {
				debugWarn("InputNumber", "The value has reached the maximum safe integer limit.");
				return val;
			} else if (val <= Number.MIN_SAFE_INTEGER && coefficient === -1) {
				debugWarn("InputNumber", "The value has reached the minimum safe integer limit.");
				return val;
			}
			return toPrecision(val + props.step * coefficient);
		};
		const handleKeydown = (event) => {
			const code = getEventCode(event);
			const key = getEventKey(event);
			if (props.disabledScientific && ["e", "E"].includes(key)) {
				event.preventDefault();
				return;
			}
			switch (code) {
				case EVENT_CODE.up:
					event.preventDefault();
					increase();
					break;
				case EVENT_CODE.down:
					event.preventDefault();
					decrease();
					break;
			}
		};
		const increase = () => {
			if (props.readonly || inputNumberDisabled.value || maxDisabled.value) return;
			setCurrentValue(ensurePrecision(Number(displayValue.value) || 0));
			emit(INPUT_EVENT, data.currentValue);
			setCurrentValueToModelValue();
		};
		const decrease = () => {
			if (props.readonly || inputNumberDisabled.value || minDisabled.value) return;
			setCurrentValue(ensurePrecision(Number(displayValue.value) || 0, -1));
			emit(INPUT_EVENT, data.currentValue);
			setCurrentValueToModelValue();
		};
		const verifyValue = (value, update) => {
			const { max, min, step, precision, stepStrictly, valueOnClear } = props;
			if (max < min) throwError("InputNumber", "min should not be greater than max.");
			let newVal = !value ? Number(value) : Number.parseFloat(String(value));
			if (isNil(value) || Number.isNaN(newVal)) return null;
			if (value === "") {
				if (valueOnClear === null) return null;
				newVal = isString(valueOnClear) ? {
					min,
					max
				}[valueOnClear] : valueOnClear;
			}
			if (stepStrictly) {
				newVal = toPrecision(Math.round(toPrecision(newVal / step)) * step, precision);
				if (newVal !== value) update && emit("update:modelValue", newVal);
			}
			if (!isUndefined(precision)) newVal = toPrecision(newVal, precision);
			if (newVal > max || newVal < min) {
				newVal = newVal > max ? max : min;
				update && emit("update:modelValue", newVal);
			}
			return newVal;
		};
		const setCurrentValue = (value, emitChange = true) => {
			const oldVal = data.currentValue;
			const newVal = verifyValue(value);
			if (!emitChange) {
				emit(UPDATE_MODEL_EVENT, newVal);
				return;
			}
			data.userInput = null;
			if (oldVal === newVal && value) return;
			emit(UPDATE_MODEL_EVENT, newVal);
			if (oldVal !== newVal) emit(CHANGE_EVENT, newVal, oldVal);
			if (props.validateEvent) formItem?.validate?.("change").catch(NOOP);
			data.currentValue = newVal;
		};
		const handleInput = (value) => {
			data.userInput = value;
			let newVal = value === "" ? null : Number.parseFloat(value);
			if (Number.isNaN(newVal)) newVal = null;
			emit(INPUT_EVENT, newVal);
			setCurrentValue(newVal, false);
		};
		const handleInputChange = (value) => {
			const newVal = value !== "" ? Number.parseFloat(value) : "";
			if (isNumber(newVal) && !Number.isNaN(newVal) || props.formatter && Number.isNaN(newVal) || newVal === "") setCurrentValue(newVal);
			setCurrentValueToModelValue();
			data.userInput = null;
		};
		const focus = () => {
			input.value?.focus?.();
		};
		const blur = () => {
			input.value?.blur?.();
		};
		const handleFocus = (event) => {
			emit("focus", event);
		};
		const handleBlur = (event) => {
			data.userInput = null;
			if (data.currentValue === null && input.value?.input) input.value.input.value = props.formatter?.("") ?? "";
			emit("blur", event);
			if (props.validateEvent) formItem?.validate?.("blur").catch(NOOP);
		};
		const setCurrentValueToModelValue = () => {
			if (data.currentValue !== props.modelValue) data.currentValue = props.modelValue;
		};
		const handleWheel = (e) => {
			if (document.activeElement === e.target) e.preventDefault();
		};
		watch(() => props.modelValue, (value, oldValue) => {
			const newValue = verifyValue(value, true);
			if (data.userInput === null && newValue !== oldValue) data.currentValue = newValue;
		}, { immediate: true });
		watch(() => props.precision, () => {
			data.currentValue = verifyValue(props.modelValue);
		});
		onMounted(() => {
			const { min, max, modelValue } = props;
			const innerInput = input.value?.input;
			innerInput.setAttribute("role", "spinbutton");
			if (Number.isFinite(max)) innerInput.setAttribute("aria-valuemax", String(max));
			else innerInput.removeAttribute("aria-valuemax");
			if (Number.isFinite(min)) innerInput.setAttribute("aria-valuemin", String(min));
			else innerInput.removeAttribute("aria-valuemin");
			innerInput.setAttribute("aria-valuenow", data.currentValue || data.currentValue === 0 ? String(data.currentValue) : "");
			innerInput.setAttribute("aria-disabled", String(inputNumberDisabled.value));
			if (!isNumber(modelValue) && modelValue != null) {
				let val = Number(modelValue);
				if (Number.isNaN(val)) val = null;
				emit(UPDATE_MODEL_EVENT, val);
			}
			innerInput.addEventListener("wheel", handleWheel, { passive: false });
		});
		onUpdated(() => {
			(input.value?.input)?.setAttribute("aria-valuenow", `${data.currentValue ?? ""}`);
		});
		__expose({
			/** @description get focus the input component */
			focus,
			/** @description remove focus the input component */
			blur
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: normalizeClass([
					unref(ns).b(),
					unref(ns).m(unref(inputNumberSize)),
					unref(ns).is("disabled", unref(inputNumberDisabled)),
					unref(ns).is("without-controls", !__props.controls),
					unref(ns).is("controls-right", controlsAtRight.value),
					unref(ns).is(__props.align, !!__props.align)
				]),
				onDragstart: _cache[0] || (_cache[0] = withModifiers(() => {}, ["prevent"]))
			}, [
				__props.controls ? withDirectives((openBlock(), createElementBlock("span", {
					key: 0,
					role: "button",
					"aria-label": unref(t)("el.inputNumber.decrease"),
					class: normalizeClass([unref(ns).e("decrease"), unref(ns).is("disabled", minDisabled.value)]),
					onKeydown: withKeys(decrease, ["enter"])
				}, [renderSlot(_ctx.$slots, "decrease-icon", {}, () => [createVNode(unref(ElIcon), null, {
					default: withCtx(() => [controlsAtRight.value ? (openBlock(), createBlock(unref(arrow_down_default), { key: 0 })) : (openBlock(), createBlock(unref(minus_default), { key: 1 }))]),
					_: 1
				})])], 42, _hoisted_1$1)), [[unref(vRepeatClick), decrease]]) : createCommentVNode("v-if", true),
				__props.controls ? withDirectives((openBlock(), createElementBlock("span", {
					key: 1,
					role: "button",
					"aria-label": unref(t)("el.inputNumber.increase"),
					class: normalizeClass([unref(ns).e("increase"), unref(ns).is("disabled", maxDisabled.value)]),
					onKeydown: withKeys(increase, ["enter"])
				}, [renderSlot(_ctx.$slots, "increase-icon", {}, () => [createVNode(unref(ElIcon), null, {
					default: withCtx(() => [controlsAtRight.value ? (openBlock(), createBlock(unref(arrow_up_default), { key: 0 })) : (openBlock(), createBlock(unref(plus_default), { key: 1 }))]),
					_: 1
				})])], 42, _hoisted_2)), [[unref(vRepeatClick), increase]]) : createCommentVNode("v-if", true),
				createVNode(unref(ElInput), {
					id: __props.id,
					ref_key: "input",
					ref: input,
					type: __props.formatter ? "text" : "number",
					step: __props.step,
					"model-value": displayValue.value,
					placeholder: __props.placeholder,
					readonly: __props.readonly,
					disabled: unref(inputNumberDisabled),
					size: unref(inputNumberSize),
					max: __props.max,
					min: __props.min,
					name: __props.name,
					"aria-label": __props.ariaLabel,
					"validate-event": false,
					inputmode: __props.inputmode,
					formatter: __props.formatter,
					parser: __props.parser,
					tabindex: __props.tabindex,
					onKeydown: handleKeydown,
					onBlur: handleBlur,
					onFocus: handleFocus,
					onInput: handleInput,
					onChange: handleInputChange
				}, createSlots({ _: 2 }, [_ctx.$slots.prefix ? {
					name: "prefix",
					fn: withCtx(() => [renderSlot(_ctx.$slots, "prefix")]),
					key: "0"
				} : void 0, _ctx.$slots.suffix ? {
					name: "suffix",
					fn: withCtx(() => [renderSlot(_ctx.$slots, "suffix")]),
					key: "1"
				} : void 0]), 1032, [
					"id",
					"type",
					"step",
					"model-value",
					"placeholder",
					"readonly",
					"disabled",
					"size",
					"max",
					"min",
					"name",
					"aria-label",
					"inputmode",
					"formatter",
					"parser",
					"tabindex"
				])
			], 34);
		};
	}
}));
//#endregion
//#region node_modules/element-plus/es/components/tabs/src/constants.mjs
var tabsRootContextKey = Symbol("tabsRootContextKey");
//#endregion
//#region node_modules/element-plus/es/components/tabs/src/tab-bar.mjs
/**
* @deprecated Removed after 3.0.0, Use `TabBarProps` instead.
*/
var tabBarProps = buildProps({
	tabs: {
		type: definePropType(Array),
		default: () => mutable([])
	},
	tabRefs: {
		type: definePropType(Object),
		default: () => mutable({})
	}
});
//#endregion
//#region node_modules/element-plus/es/components/tabs/src/tab-bar.vue_vue_type_script_setup_true_lang.mjs
var COMPONENT_NAME$2 = "ElTabBar";
//#endregion
//#region node_modules/element-plus/es/components/tabs/src/tab-bar2.mjs
var tab_bar_default = /* @__PURE__ */ defineComponent({
	name: COMPONENT_NAME$2,
	__name: "tab-bar",
	props: tabBarProps,
	setup(__props, { expose: __expose }) {
		const props = __props;
		const rootTabs = inject(tabsRootContextKey);
		if (!rootTabs) throwError(COMPONENT_NAME$2, "<el-tabs><el-tab-bar /></el-tabs>");
		const ns = useNamespace("tabs");
		const barRef = ref();
		const barStyle = ref();
		/**
		* when defaultValue is not set, the bar is always shown.
		*
		* when defaultValue is set, the bar will be hidden until style is calculated
		* to avoid the bar showing in the wrong position on initial render.
		*/
		const renderActiveBar = computed(() => isUndefined(rootTabs.props.defaultValue) || Boolean(barStyle.value?.transform));
		const getBarStyle = () => {
			let offset = 0;
			let tabSize = 0;
			const sizeName = ["top", "bottom"].includes(rootTabs.props.tabPosition) ? "width" : "height";
			const sizeDir = sizeName === "width" ? "x" : "y";
			const position = sizeDir === "x" ? "left" : "top";
			props.tabs.every((tab) => {
				if (isUndefined(tab.paneName)) return false;
				const $el = props.tabRefs[tab.paneName];
				if (!$el) return false;
				if (!tab.active) return true;
				offset = $el[`offset${capitalize(position)}`];
				tabSize = $el[`client${capitalize(sizeName)}`];
				const tabStyles = window.getComputedStyle($el);
				if (sizeName === "width") {
					tabSize -= Number.parseFloat(tabStyles.paddingLeft) + Number.parseFloat(tabStyles.paddingRight);
					offset += Number.parseFloat(tabStyles.paddingLeft);
				}
				return false;
			});
			return {
				[sizeName]: `${tabSize}px`,
				transform: `translate${capitalize(sizeDir)}(${offset}px)`
			};
		};
		const update = () => barStyle.value = getBarStyle();
		const tabObservers = [];
		const observerTabs = () => {
			tabObservers.forEach((observer) => observer.stop());
			tabObservers.length = 0;
			Object.values(props.tabRefs).forEach((tab) => {
				tabObservers.push(useResizeObserver(tab, update));
			});
		};
		watch(() => props.tabs, async () => {
			await nextTick();
			update();
			observerTabs();
		}, { immediate: true });
		const barObserver = useResizeObserver(barRef, () => update());
		onBeforeUnmount(() => {
			tabObservers.forEach((observer) => observer.stop());
			tabObservers.length = 0;
			barObserver.stop();
		});
		__expose({
			/** @description tab root html element */
			ref: barRef,
			/** @description method to manually update tab bar style, return the updated style */
			update
		});
		return (_ctx, _cache) => {
			return renderActiveBar.value ? (openBlock(), createElementBlock("div", {
				key: 0,
				ref_key: "barRef",
				ref: barRef,
				class: normalizeClass([unref(ns).e("active-bar"), unref(ns).is(unref(rootTabs).props.tabPosition)]),
				style: normalizeStyle(barStyle.value)
			}, null, 6)) : createCommentVNode("v-if", true);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/tabs/src/composables/use-tab-nav-touch.mjs
var TOUCH_SCROLL_THRESHOLD = 5;
var useTabNavTouch = ({ scrollable, navOffset, navSize, navContainerSize, isHorizontal }) => {
	const isTouchScrolling = ref(false);
	const maxOffset = computed(() => Math.max(navSize.value - navContainerSize.value, 0));
	let touchState;
	let isMainAxisTouch;
	const handleTouchStart = (event) => {
		if (!scrollable.value || event.touches.length !== 1) return;
		const { clientX, clientY } = getClientXY(event);
		touchState = {
			startX: clientX,
			startY: clientY,
			startOffset: navOffset.value
		};
		isMainAxisTouch = void 0;
	};
	const handleTouchMove = (event) => {
		if (!touchState || !scrollable.value) return;
		if (event.touches.length !== 1) {
			handleTouchEnd();
			return;
		}
		const { clientX, clientY } = getClientXY(event);
		const deltaX = touchState.startX - clientX;
		const deltaY = touchState.startY - clientY;
		const mainAxisDelta = isHorizontal.value ? deltaX : deltaY;
		const crossAxisDelta = isHorizontal.value ? deltaY : deltaX;
		const mainAxisDistance = Math.abs(mainAxisDelta);
		const crossAxisDistance = Math.abs(crossAxisDelta);
		if (isUndefined$1(isMainAxisTouch)) {
			if (Math.max(mainAxisDistance, crossAxisDistance) <= TOUCH_SCROLL_THRESHOLD) return;
			isMainAxisTouch = mainAxisDistance > crossAxisDistance;
		}
		if (!isMainAxisTouch) return;
		const nextOffset = clamp(touchState.startOffset + mainAxisDelta, 0, maxOffset.value);
		if (maxOffset.value <= 0 || nextOffset === navOffset.value || !event.cancelable) return;
		event.preventDefault();
		isTouchScrolling.value = true;
		navOffset.value = nextOffset;
	};
	const handleTouchEnd = () => {
		touchState = void 0;
		isMainAxisTouch = void 0;
		isTouchScrolling.value = false;
	};
	return {
		isTouchScrolling,
		handleTouchStart,
		handleTouchMove,
		handleTouchEnd
	};
};
//#endregion
//#region node_modules/element-plus/es/components/tabs/src/tab-nav.mjs
var tabNavProps = buildProps({
	panes: {
		type: definePropType(Array),
		default: () => mutable([])
	},
	currentName: {
		type: [String, Number],
		default: ""
	},
	editable: Boolean,
	type: {
		type: String,
		values: [
			"card",
			"border-card",
			""
		],
		default: ""
	},
	stretch: Boolean,
	/**
	* @description tab-nav tabindex
	*/
	tabindex: {
		type: [String, Number],
		default: void 0
	}
});
var tabNavEmits = {
	tabClick: (tab, tabName, ev) => ev instanceof Event,
	tabRemove: (tab, ev) => ev instanceof Event
};
var COMPONENT_NAME$1 = "ElTabNav";
var TabNav = /* @__PURE__ */ defineComponent({
	name: COMPONENT_NAME$1,
	props: tabNavProps,
	emits: tabNavEmits,
	setup(props, { expose, emit }) {
		const rootTabs = inject(tabsRootContextKey);
		if (!rootTabs) throwError(COMPONENT_NAME$1, `<el-tabs><tab-nav /></el-tabs>`);
		const ns = useNamespace("tabs");
		const visibility = useDocumentVisibility();
		const focused = useWindowFocus();
		const navScroll$ = ref();
		const nav$ = ref();
		const el$ = ref();
		const tabRefsMap = ref({});
		const tabBarRef = ref();
		const scrollable = ref(false);
		const navOffset = ref(0);
		const isFocus = ref(false);
		const focusable = ref(true);
		const isWheelScrolling = ref(false);
		const tracker = shallowRef();
		const isHorizontal = computed(() => ["top", "bottom"].includes(rootTabs.props.tabPosition));
		const sizeName = computed(() => isHorizontal.value ? "width" : "height");
		const navStyle = computed(() => {
			const dir = sizeName.value === "width" ? "X" : "Y";
			return {
				transition: isWheelScrolling.value || isTouchScrolling.value ? "none" : void 0,
				transform: `translate${dir}(-${navOffset.value}px)`
			};
		});
		const { width: navContainerWidth, height: navContainerHeight } = useElementSize(navScroll$);
		const { width: navWidth, height: navHeight } = useElementSize(nav$, {
			width: 0,
			height: 0
		}, { box: "border-box" });
		const navContainerSize = computed(() => isHorizontal.value ? navContainerWidth.value : navContainerHeight.value);
		const navSize = computed(() => isHorizontal.value ? navWidth.value : navHeight.value);
		const { onWheel } = useWheel({
			atStartEdge: computed(() => navOffset.value <= 0),
			atEndEdge: computed(() => navSize.value - navOffset.value <= navContainerSize.value),
			layout: computed(() => isHorizontal.value ? "horizontal" : "vertical")
		}, (offset) => {
			navOffset.value = clamp(navOffset.value + offset, 0, navSize.value - navContainerSize.value);
		});
		const handleWheel = (event) => {
			isWheelScrolling.value = true;
			onWheel(event);
			rAF(() => {
				isWheelScrolling.value = false;
			});
		};
		const { isTouchScrolling, handleTouchStart, handleTouchMove, handleTouchEnd } = useTabNavTouch({
			scrollable,
			navOffset,
			navSize,
			navContainerSize,
			isHorizontal
		});
		const scrollPrev = () => {
			if (!navScroll$.value) return;
			const containerSize = navScroll$.value.getBoundingClientRect()[sizeName.value];
			const currentOffset = navOffset.value;
			if (!currentOffset) return;
			navOffset.value = currentOffset > containerSize ? currentOffset - containerSize : 0;
		};
		const scrollNext = () => {
			if (!navScroll$.value || !nav$.value) return;
			const navSize = nav$.value.getBoundingClientRect()[sizeName.value];
			const containerSize = navScroll$.value.getBoundingClientRect()[sizeName.value];
			const currentOffset = navOffset.value;
			if (!isGreaterThan(navSize - currentOffset, containerSize)) return;
			navOffset.value = navSize - currentOffset > containerSize * 2 ? currentOffset + containerSize : navSize - containerSize;
		};
		const scrollToActiveTab = async () => {
			const nav = nav$.value;
			if (!scrollable.value || !el$.value || !navScroll$.value || !nav) return;
			await nextTick();
			const activeTab = tabRefsMap.value[props.currentName];
			if (!activeTab) return;
			const navScroll = navScroll$.value;
			const activeTabBounding = activeTab.getBoundingClientRect();
			const navScrollBounding = navScroll.getBoundingClientRect();
			const navScrollLeft = navScrollBounding.left + 1;
			const navScrollRight = navScrollBounding.right - 1;
			const navBounding = nav.getBoundingClientRect();
			const maxOffset = isHorizontal.value ? navBounding.width - navScrollBounding.width : navBounding.height - navScrollBounding.height;
			const currentOffset = navOffset.value;
			let newOffset = currentOffset;
			if (isHorizontal.value) {
				if (activeTabBounding.left < navScrollLeft) newOffset = currentOffset - (navScrollLeft - activeTabBounding.left);
				if (activeTabBounding.right > navScrollRight) newOffset = currentOffset + activeTabBounding.right - navScrollRight;
			} else {
				if (activeTabBounding.top < navScrollBounding.top) newOffset = currentOffset - (navScrollBounding.top - activeTabBounding.top);
				if (activeTabBounding.bottom > navScrollBounding.bottom) newOffset = currentOffset + (activeTabBounding.bottom - navScrollBounding.bottom);
			}
			newOffset = Math.max(newOffset, 0);
			navOffset.value = Math.min(newOffset, maxOffset);
		};
		const update = () => {
			if (!nav$.value || !navScroll$.value) return;
			props.stretch && tabBarRef.value?.update();
			const navSize = nav$.value.getBoundingClientRect()[sizeName.value];
			const containerSize = navScroll$.value.getBoundingClientRect()[sizeName.value];
			const currentOffset = navOffset.value;
			if (containerSize < navSize) {
				scrollable.value = scrollable.value || {};
				scrollable.value.prev = currentOffset;
				scrollable.value.next = isGreaterThan(navSize, currentOffset + containerSize);
				if (isGreaterThan(containerSize, navSize - currentOffset)) navOffset.value = navSize - containerSize;
			} else {
				scrollable.value = false;
				if (currentOffset > 0) navOffset.value = 0;
			}
		};
		const changeTab = (event) => {
			const code = getEventCode(event);
			let step = 0;
			switch (code) {
				case EVENT_CODE.left:
				case EVENT_CODE.up:
					step = -1;
					break;
				case EVENT_CODE.right:
				case EVENT_CODE.down:
					step = 1;
					break;
				default: return;
			}
			const tabList = Array.from(event.currentTarget.querySelectorAll("[role=tab]:not(.is-disabled)"));
			let nextIndex = tabList.indexOf(event.target) + step;
			if (nextIndex < 0) nextIndex = tabList.length - 1;
			else if (nextIndex >= tabList.length) nextIndex = 0;
			tabList[nextIndex].focus({ preventScroll: true });
			tabList[nextIndex].click();
			setFocus();
		};
		const setFocus = () => {
			if (focusable.value) isFocus.value = true;
		};
		const removeFocus = () => isFocus.value = false;
		const setRefs = (el, key) => {
			tabRefsMap.value[key] = el;
		};
		const focusActiveTab = async () => {
			await nextTick();
			tabRefsMap.value[props.currentName]?.focus({ preventScroll: true });
		};
		watch(visibility, (visibility) => {
			if (visibility === "hidden") focusable.value = false;
			else if (visibility === "visible") setTimeout(() => focusable.value = true, 50);
		});
		watch(focused, (focused) => {
			if (focused) setTimeout(() => focusable.value = true, 50);
			else focusable.value = false;
		});
		useResizeObserver(el$, () => {
			rAF(update);
		});
		onMounted(() => setTimeout(() => scrollToActiveTab(), 0));
		onUpdated(() => update());
		expose({
			scrollToActiveTab,
			removeFocus,
			focusActiveTab,
			tabListRef: nav$,
			tabBarRef,
			scheduleRender: () => triggerRef(tracker)
		});
		return () => {
			const scrollBtn = scrollable.value ? [createVNode("span", {
				"class": [ns.e("nav-prev"), ns.is("disabled", !scrollable.value.prev)],
				"onClick": scrollPrev
			}, [createVNode(ElIcon, null, { default: () => [createVNode(arrow_left_default, null, null)] })]), createVNode("span", {
				"class": [ns.e("nav-next"), ns.is("disabled", !scrollable.value.next)],
				"onClick": scrollNext
			}, [createVNode(ElIcon, null, { default: () => [createVNode(arrow_right_default, null, null)] })])] : null;
			const tabs = props.panes.map((pane, index) => {
				const uid = pane.uid;
				const disabled = pane.props.disabled;
				const tabName = pane.props.name ?? pane.index ?? `${index}`;
				const closable = !disabled && (pane.isClosable || pane.props.closable !== false && props.editable);
				pane.index = `${index}`;
				const btnClose = closable ? createVNode(ElIcon, {
					"class": "is-icon-close",
					"onClick": (ev) => emit("tabRemove", pane, ev)
				}, { default: () => [createVNode(close_default, null, null)] }) : null;
				const tabLabelContent = pane.slots.label?.() || pane.props.label;
				const tabindex = !disabled && pane.active ? props.tabindex ?? rootTabs.props.tabindex : -1;
				return createVNode("div", {
					"ref": (el) => setRefs(el, tabName),
					"class": [
						ns.e("item"),
						ns.is(rootTabs.props.tabPosition),
						ns.is("active", pane.active),
						ns.is("disabled", disabled),
						ns.is("closable", closable),
						ns.is("focus", isFocus.value)
					],
					"id": `tab-${tabName}`,
					"key": `tab-${uid}`,
					"aria-controls": `pane-${tabName}`,
					"role": "tab",
					"aria-selected": pane.active,
					"tabindex": tabindex,
					"onFocus": () => setFocus(),
					"onBlur": () => removeFocus(),
					"onClick": (ev) => {
						removeFocus();
						emit("tabClick", pane, tabName, ev);
					},
					"onKeydown": (ev) => {
						const code = getEventCode(ev);
						if (closable && (code === EVENT_CODE.delete || code === EVENT_CODE.backspace)) emit("tabRemove", pane, ev);
					}
				}, [...[tabLabelContent, btnClose]]);
			});
			tracker.value;
			return createVNode("div", {
				"ref": el$,
				"class": [
					ns.e("nav-wrap"),
					ns.is("scrollable", !!scrollable.value),
					ns.is(rootTabs.props.tabPosition)
				]
			}, [scrollBtn, createVNode("div", {
				"class": ns.e("nav-scroll"),
				"ref": navScroll$
			}, [props.panes.length > 0 ? createVNode("div", {
				"class": [
					ns.e("nav"),
					ns.is(rootTabs.props.tabPosition),
					ns.is("stretch", props.stretch && ["top", "bottom"].includes(rootTabs.props.tabPosition))
				],
				"ref": nav$,
				"style": navStyle.value,
				"role": "tablist",
				"onKeydown": changeTab,
				"onWheel": handleWheel,
				"onTouchstart": handleTouchStart,
				"onTouchmove": handleTouchMove,
				"onTouchend": handleTouchEnd,
				"onTouchcancel": handleTouchEnd
			}, [...[!props.type ? createVNode(tab_bar_default, {
				"ref": tabBarRef,
				"tabs": [...props.panes],
				"tabRefs": tabRefsMap.value
			}, null) : null, tabs]]) : null])]);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/tabs/src/tabs.mjs
var tabsProps = buildProps({
	/**
	* @description type of Tab
	*/
	type: {
		type: String,
		values: [
			"card",
			"border-card",
			""
		],
		default: ""
	},
	/**
	* @description whether Tab is closable
	*/
	closable: Boolean,
	/**
	* @description whether Tab is addable
	*/
	addable: Boolean,
	/**
	* @description binding value, name of the selected tab
	*/
	modelValue: { type: [String, Number] },
	/**
	* @description initial value when `model-value` is not set
	*/
	defaultValue: { type: [String, Number] },
	/**
	* @description whether Tab is addable and closable
	*/
	editable: Boolean,
	/**
	* @description position of tabs
	*/
	tabPosition: {
		type: String,
		values: [
			"top",
			"right",
			"bottom",
			"left"
		],
		default: "top"
	},
	/**
	* @description hook function before switching tab. If `false` is returned or a `Promise` is returned and then is rejected, switching will be prevented
	*/
	beforeLeave: {
		type: definePropType(Function),
		default: () => true
	},
	/**
	* @description whether width of tab automatically fits its container
	*/
	stretch: Boolean,
	/**
	* @description tabs tabindex
	*/
	tabindex: {
		type: [String, Number],
		default: 0
	}
});
var isPaneName = (value) => isString(value) || isNumber(value);
var Tabs = /* @__PURE__ */ defineComponent({
	name: "ElTabs",
	props: tabsProps,
	emits: {
		[UPDATE_MODEL_EVENT]: (name) => isPaneName(name),
		tabClick: (pane, ev) => ev instanceof Event,
		tabChange: (name) => isPaneName(name),
		edit: (paneName, action) => ["remove", "add"].includes(action),
		tabRemove: (name) => isPaneName(name),
		tabAdd: () => true
	},
	setup(props, { emit, slots, expose }) {
		const ns = useNamespace("tabs");
		const isVertical = computed(() => ["left", "right"].includes(props.tabPosition));
		const { children: panes, addChild: registerPane, removeChild: unregisterPane, ChildrenSorter: PanesSorter } = useOrderedChildren(getCurrentInstance(), "ElTabPane");
		const nav$ = ref();
		const currentName = ref((isUndefined(props.modelValue) ? props.defaultValue : props.modelValue) ?? "0");
		const setCurrentName = async (value, trigger = false) => {
			if (currentName.value === value || isUndefined(value)) return;
			try {
				let canLeave;
				if (props.beforeLeave) {
					const result = props.beforeLeave(value, currentName.value);
					canLeave = result instanceof Promise ? await result : result;
				} else canLeave = true;
				if (canLeave !== false) {
					const isFocusInsidePane = panes.value.find((item) => item.paneName === currentName.value)?.isFocusInsidePane();
					currentName.value = value;
					if (trigger) {
						emit(UPDATE_MODEL_EVENT, value);
						emit("tabChange", value);
					}
					nav$.value?.removeFocus?.();
					if (isFocusInsidePane) nav$.value?.focusActiveTab();
				}
			} catch {}
		};
		const handleTabClick = (tab, tabName, event) => {
			if (tab.props.disabled) return;
			emit("tabClick", tab, event);
			setCurrentName(tabName, true);
		};
		const handleTabRemove = (pane, ev) => {
			if (pane.props.disabled || isUndefined(pane.props.name)) return;
			ev.stopPropagation();
			emit("edit", pane.props.name, "remove");
			emit("tabRemove", pane.props.name);
		};
		const handleTabAdd = () => {
			emit("edit", void 0, "add");
			emit("tabAdd");
		};
		const handleKeydown = (event) => {
			const code = getEventCode(event);
			if ([EVENT_CODE.enter, EVENT_CODE.numpadEnter].includes(code)) handleTabAdd();
		};
		const swapChildren = (vnode) => {
			const actualFirstChild = vnode.el.firstChild;
			const firstChild = ["bottom", "right"].includes(props.tabPosition) ? vnode.children[0].el : vnode.children[1].el;
			if (actualFirstChild !== firstChild) actualFirstChild.before(firstChild);
		};
		watch(() => props.modelValue, (modelValue) => setCurrentName(modelValue));
		watch(currentName, async () => {
			await nextTick();
			nav$.value?.scrollToActiveTab();
		});
		provide(tabsRootContextKey, {
			props,
			currentName,
			registerPane,
			unregisterPane,
			nav$
		});
		expose({
			currentName,
			get tabNavRef() {
				return omit(nav$.value, ["scheduleRender"]);
			}
		});
		return () => {
			const addSlot = slots["add-icon"];
			const newButton = props.editable || props.addable ? createVNode("div", {
				"class": [ns.e("new-tab"), isVertical.value && ns.e("new-tab-vertical")],
				"tabindex": props.tabindex,
				"onClick": handleTabAdd,
				"onKeydown": handleKeydown
			}, [addSlot ? renderSlot(slots, "add-icon") : createVNode(ElIcon, { "class": ns.is("icon-plus") }, { default: () => [createVNode(plus_default, null, null)] })]) : null;
			const tabNav = () => createVNode(TabNav, {
				"ref": nav$,
				"currentName": currentName.value,
				"editable": props.editable,
				"type": props.type,
				"panes": panes.value,
				"stretch": props.stretch,
				"onTabClick": handleTabClick,
				"onTabRemove": handleTabRemove
			}, null);
			const header = createVNode("div", { "class": [
				ns.e("header"),
				isVertical.value && ns.e("header-vertical"),
				ns.is(props.tabPosition)
			] }, [createVNode(PanesSorter, null, {
				default: tabNav,
				$stable: true
			}), newButton]);
			const panels = createVNode("div", { "class": ns.e("content") }, [renderSlot(slots, "default")]);
			return createVNode("div", {
				"class": [
					ns.b(),
					ns.m(props.tabPosition),
					{
						[ns.m("card")]: props.type === "card",
						[ns.m("border-card")]: props.type === "border-card"
					}
				],
				"onVnodeMounted": swapChildren,
				"onVnodeUpdated": swapChildren
			}, [panels, header]);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/tabs/src/tab-pane.mjs
/**
* @deprecated Removed after 3.0.0, Use `TabPaneProps` instead.
*/
var tabPaneProps = buildProps({
	/**
	* @description title of the tab
	*/
	label: {
		type: String,
		default: ""
	},
	/**
	* @description identifier corresponding to the name of Tabs, representing the alias of the tab-pane, the default is ordinal number of the tab-pane in the sequence, e.g. the first tab-pane is '0'
	*/
	name: { type: [String, Number] },
	/**
	* @description whether Tab is closable
	*/
	closable: {
		type: Boolean,
		default: void 0
	},
	/**
	* @description whether Tab is disabled
	*/
	disabled: Boolean,
	/**
	* @description whether Tab is lazily rendered
	*/
	lazy: Boolean
});
//#endregion
//#region node_modules/element-plus/es/components/tabs/src/tab-pane.vue_vue_type_script_setup_true_lang.mjs
var _hoisted_1 = [
	"id",
	"aria-hidden",
	"aria-labelledby"
];
var COMPONENT_NAME = "ElTabPane";
//#endregion
//#region node_modules/element-plus/es/components/tabs/src/tab-pane2.mjs
var tab_pane_default = /* @__PURE__ */ defineComponent({
	name: COMPONENT_NAME,
	__name: "tab-pane",
	props: tabPaneProps,
	setup(__props) {
		const props = __props;
		const instance = getCurrentInstance();
		const slots = useSlots();
		const tabsRoot = inject(tabsRootContextKey);
		if (!tabsRoot) throwError(COMPONENT_NAME, "usage: <el-tabs><el-tab-pane /></el-tabs/>");
		const ns = useNamespace("tab-pane");
		const paneRef = ref();
		const index = ref();
		const isClosable = computed(() => props.closable ?? tabsRoot.props.closable);
		const active = computed(() => tabsRoot.currentName.value === (props.name ?? index.value));
		const loaded = ref(active.value);
		const paneName = computed(() => props.name ?? index.value);
		const shouldBeRender = computed(() => !props.lazy || loaded.value || active.value);
		const isFocusInsidePane = () => {
			return paneRef.value?.contains(document.activeElement);
		};
		watch(active, (val) => {
			if (val) loaded.value = true;
		});
		const pane = reactive({
			uid: instance.uid,
			getVnode: () => instance.vnode,
			slots,
			props,
			paneName,
			active,
			index,
			isClosable,
			isFocusInsidePane
		});
		tabsRoot.registerPane(pane);
		onBeforeUnmount(() => {
			tabsRoot.unregisterPane(pane);
		});
		onBeforeUpdate(() => {
			if (slots.label) tabsRoot.nav$.value?.scheduleRender();
		});
		return (_ctx, _cache) => {
			return shouldBeRender.value ? withDirectives((openBlock(), createElementBlock("div", {
				key: 0,
				id: `pane-${paneName.value}`,
				ref_key: "paneRef",
				ref: paneRef,
				class: normalizeClass(unref(ns).b()),
				role: "tabpanel",
				"aria-hidden": !active.value,
				"aria-labelledby": `tab-${paneName.value}`
			}, [renderSlot(_ctx.$slots, "default")], 10, _hoisted_1)), [[vShow, active.value]]) : createCommentVNode("v-if", true);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/tabs/index.mjs
var ElTabs = withInstall(Tabs, { TabPane: tab_pane_default });
var ElTabPane = withNoopInstall(tab_pane_default);
//#endregion
export { getOffsetTopDistance as a, getClientXY as i, ElTabs as n, useWheel as o, ElInputNumber as r, useOrderedChildren as s, ElTabPane as t };
