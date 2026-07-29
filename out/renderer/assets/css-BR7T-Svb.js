import { Aa as toRefs, Ai as Fragment, Bi as createVNode, Ca as reactive, Ei as vShow, En as useId, Er as refDebounced, Fi as createBlock, Fr as definePropType, Ga as normalizeStyle, Gi as hasInjectionContext, Gn as addUnit, Ha as isString, Hn as useNamespace, Hr as isNumber, Ia as isArray, Ii as createCommentVNode, Ji as mergeProps, Ka as toDisplayString, Ki as inject, Li as createElementBlock, Lr as getProp, Mr as throwError, Na as unref, Ni as computed, Oa as toRaw, Oi as withModifiers, Pa as NOOP, Pi as createBaseVNode, Pr as buildProps, Ra as isFunction, Rr as keysOf, Sa as onScopeDispose, Sn as isComment, Ta as ref, Ua as normalizeClass, Ur as isPropAbsent, Vi as defineComponent, Xr as isEqual, Yi as nextTick, Zi as onBeforeUnmount, _a as effectScope, aa as renderList, at as useFormDisabled, ba as isRef, bi as Transition, bn as useSizeProp, ct as formItemContextKey, dn as withInstall, dt as ElIcon, ea as onMounted, fa as useSlots, ga as withDirectives, gi as CHANGE_EVENT, ha as withCtx, hi as componentSizes, hn as useAriaProps, ia as provide, ii as baseClone, it as useFormItemInputId, jr as debugWarn, la as resolveDynamicComponent, mn as withNoopInstall, mt as TypeComponentsMap, n as api, na as onUpdated, oa as renderSlot, or as useDeprecated, ot as useFormSize, pa as watch, pt as TypeComponents, qr as omit, ra as openBlock, rt as useFormItem, si as castArray, st as formContextKey, va as getCurrentScope, vi as UPDATE_MODEL_EVENT, vr as useResizeObserver, wi as vModelRadio, xa as markRaw, xi as TransitionGroup, xn as flattedChildren, ya as isReactive, zi as createTextVNode, zr as isBoolean } from "./css-C8sLGSMG.js";
//#region node_modules/pinia/dist/pinia.js
/*!
* pinia v4.0.2
* (c) 2026 Eduardo San Martin Morote
* @license MIT
*/
var IS_CLIENT = typeof window !== "undefined";
/**
* setActivePinia must be called to handle SSR at the top of functions like
* `fetch`, `setup`, `serverPrefetch` and others
*/
var activePinia;
/**
* Sets or unsets the active pinia. Used in SSR and internally when calling
* actions and getters
*
* @param pinia - Pinia instance
*/
var setActivePinia = (pinia) => activePinia = pinia;
/**
* Symbol used to provide/inject the pinia instance in the app. Used internally
* and exposed for testing purposes and edge cases like storybook. Could break
* in a minor, **USE AT YOUR OWN RISK**.
*
* For context, see:
* - https://github.com/vuejs/pinia/issues/870
* - https://github.com/vuejs/pinia/pull/2973
*
* @internal
*/
var piniaSymbol = Symbol();
function isPlainObject(o) {
	return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
}
var _global = /*#__PURE__*/ (() => typeof window === "object" && window.window === window ? window : typeof self === "object" && self.self === self ? self : typeof global === "object" && global.global === global ? global : typeof globalThis === "object" ? globalThis : { HTMLElement: null })();
function bom(blob, { autoBom = false } = {}) {
	if (autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) return new Blob([String.fromCharCode(65279), blob], { type: blob.type });
	return blob;
}
function download(url, name, opts) {
	const xhr = new XMLHttpRequest();
	xhr.open("GET", url);
	xhr.responseType = "blob";
	xhr.onload = function() {
		saveAs(xhr.response, name, opts);
	};
	xhr.onerror = function() {
		console.error("could not download file");
	};
	xhr.send();
}
function corsEnabled(url) {
	const xhr = new XMLHttpRequest();
	xhr.open("HEAD", url, false);
	try {
		xhr.send();
	} catch (e) {}
	return xhr.status >= 200 && xhr.status <= 299;
}
function click(node) {
	try {
		node.dispatchEvent(new MouseEvent("click"));
	} catch (e) {
		const evt = new MouseEvent("click", {
			bubbles: true,
			cancelable: true,
			view: window,
			detail: 0,
			screenX: 80,
			screenY: 20,
			clientX: 80,
			clientY: 20,
			ctrlKey: false,
			altKey: false,
			shiftKey: false,
			metaKey: false,
			button: 0,
			relatedTarget: null
		});
		node.dispatchEvent(evt);
	}
}
var _navigator = typeof navigator === "object" ? navigator : { userAgent: "" };
var isMacOSWebView = /*#__PURE__*/ (() => /Macintosh/.test(_navigator.userAgent) && /AppleWebKit/.test(_navigator.userAgent) && !/Safari/.test(_navigator.userAgent))();
var saveAs = !IS_CLIENT ? () => {} : typeof HTMLAnchorElement !== "undefined" && "download" in HTMLAnchorElement.prototype && !isMacOSWebView ? downloadSaveAs : "msSaveOrOpenBlob" in _navigator ? msSaveAs : fileSaverSaveAs;
function downloadSaveAs(blob, name = "download", opts) {
	const a = document.createElement("a");
	a.download = name;
	a.rel = "noopener";
	if (typeof blob === "string") {
		a.href = blob;
		if (a.origin !== location.origin) if (corsEnabled(a.href)) download(blob, name, opts);
		else {
			a.target = "_blank";
			click(a);
		}
		else click(a);
	} else {
		a.href = URL.createObjectURL(blob);
		setTimeout(function() {
			URL.revokeObjectURL(a.href);
		}, 4e4);
		setTimeout(function() {
			click(a);
		}, 0);
	}
}
function msSaveAs(blob, name = "download", opts) {
	if (typeof blob === "string") if (corsEnabled(blob)) download(blob, name, opts);
	else {
		const a = document.createElement("a");
		a.href = blob;
		a.target = "_blank";
		setTimeout(function() {
			click(a);
		});
	}
	else navigator.msSaveOrOpenBlob(bom(blob, opts), name);
}
function fileSaverSaveAs(blob, name, opts, popup) {
	popup = popup || open("", "_blank");
	if (popup) popup.document.title = popup.document.body.innerText = "downloading...";
	if (typeof blob === "string") return download(blob, name, opts);
	const force = blob.type === "application/octet-stream";
	const isSafari = /constructor/i.test(String(_global.HTMLElement)) || "safari" in _global;
	const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);
	if ((isChromeIOS || force && isSafari || isMacOSWebView) && typeof FileReader !== "undefined") {
		const reader = new FileReader();
		reader.onloadend = function() {
			let url = reader.result;
			if (typeof url !== "string") {
				popup = null;
				throw new Error("Wrong reader.result type");
			}
			url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, "data:attachment/file;");
			if (popup) popup.location.href = url;
			else location.assign(url);
			popup = null;
		};
		reader.readAsDataURL(blob);
	} else {
		const url = URL.createObjectURL(blob);
		if (popup) popup.location.assign(url);
		else location.href = url;
		popup = null;
		setTimeout(function() {
			URL.revokeObjectURL(url);
		}, 4e4);
	}
}
var { assign: assign$1 } = Object;
/**
* Creates a Pinia instance to be used by the application
*/
function createPinia() {
	const scope = effectScope(true);
	const state = scope.run(() => ref({}));
	let _p = [];
	let toBeInstalled = [];
	const pinia = markRaw({
		install(app) {
			setActivePinia(pinia);
			pinia._a = app;
			app.provide(piniaSymbol, pinia);
			app.config.globalProperties.$pinia = pinia;
			toBeInstalled.forEach((plugin) => _p.push(plugin));
			toBeInstalled = [];
		},
		use(plugin) {
			if (!this._a) toBeInstalled.push(plugin);
			else _p.push(plugin);
			return this;
		},
		_p,
		_a: null,
		_e: scope,
		_s: /* @__PURE__ */ new Map(),
		state
	});
	return pinia;
}
var noop = () => {};
function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
	subscriptions.add(callback);
	const removeSubscription = () => {
		subscriptions.delete(callback) && onCleanup();
	};
	if (!detached && getCurrentScope()) onScopeDispose(removeSubscription);
	return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
	subscriptions.forEach((callback) => {
		callback(...args);
	});
}
var fallbackRunWithContext = (fn) => fn();
/**
* Marks a function as an action for `$onAction`
* @internal
*/
var ACTION_MARKER = Symbol();
/**
* Action name symbol. Allows to add a name to an action after defining it
* @internal
*/
var ACTION_NAME = Symbol();
function mergeReactiveObjects(target, patchToApply) {
	if (target instanceof Map && patchToApply instanceof Map) patchToApply.forEach((value, key) => target.set(key, value));
	else if (target instanceof Set && patchToApply instanceof Set) patchToApply.forEach(target.add, target);
	for (const key in patchToApply) {
		if (!Object.hasOwn(patchToApply, key)) continue;
		const subPatch = patchToApply[key];
		const targetValue = target[key];
		if (isPlainObject(targetValue) && isPlainObject(subPatch) && Object.hasOwn(target, key) && !isRef(subPatch) && !isReactive(subPatch)) target[key] = mergeReactiveObjects(targetValue, subPatch);
		else target[key] = subPatch;
	}
	return target;
}
var skipHydrateSymbol = Symbol();
/**
* Returns whether a value should be hydrated
*
* @param obj - target variable
* @returns true if `obj` should be hydrated
*/
function shouldHydrate(obj) {
	return !obj || typeof obj !== "object" || !Object.hasOwn(obj, skipHydrateSymbol);
}
var { assign } = Object;
function isComputed(o) {
	return !!(isRef(o) && o.effect);
}
function createOptionsStore(id, options, pinia, hot) {
	const { state, actions, getters } = options;
	const initialState = pinia.state.value[id];
	let store;
	function setup() {
		if (!initialState && true)
 /* istanbul ignore if */
		pinia.state.value[id] = state ? state() : {};
		return assign(toRefs(pinia.state.value[id]), actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
			computedGetters[name] = markRaw(computed(() => {
				setActivePinia(pinia);
				const store = pinia._s.get(id);
				return getters[name].call(store, store);
			}));
			return computedGetters;
		}, {}));
	}
	store = createSetupStore(id, setup, options, pinia, hot, true);
	return store;
}
function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
	let scope;
	const optionsForPlugin = assign({ actions: {} }, options);
	const $subscribeOptions = { deep: true };
	let isListening;
	let isSyncListening;
	let subscriptions = /* @__PURE__ */ new Set();
	let actionSubscriptions = /* @__PURE__ */ new Set();
	let debuggerEvents;
	const initialState = pinia.state.value[$id];
	if (!isOptionsStore && !initialState && true)
 /* istanbul ignore if */
	pinia.state.value[$id] = {};
	let activeListener;
	function $patch(partialStateOrMutator) {
		let subscriptionMutation;
		isListening = isSyncListening = false;
		if (typeof partialStateOrMutator === "function") {
			partialStateOrMutator(pinia.state.value[$id]);
			subscriptionMutation = {
				type: "patch function",
				storeId: $id,
				events: debuggerEvents
			};
		} else {
			mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
			subscriptionMutation = {
				type: "patch object",
				payload: partialStateOrMutator,
				storeId: $id,
				events: debuggerEvents
			};
		}
		const myListenerId = activeListener = Symbol();
		nextTick().then(() => {
			if (activeListener === myListenerId) isListening = true;
		});
		isSyncListening = true;
		triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
	}
	const $reset = isOptionsStore ? function $reset() {
		const { state } = options;
		const newState = state ? state() : {};
		this.$patch(($state) => {
			assign($state, newState);
		});
	} : noop;
	function $dispose() {
		scope.stop();
		subscriptions.clear();
		actionSubscriptions.clear();
		pinia._s.delete($id);
	}
	/**
	* Helper that wraps function so it can be tracked with $onAction
	* @param fn - action to wrap
	* @param name - name of the action
	*/
	const action = (fn, name = "") => {
		if (ACTION_MARKER in fn) {
			fn[ACTION_NAME] = name;
			return fn;
		}
		const wrappedAction = function() {
			setActivePinia(pinia);
			const args = Array.from(arguments);
			const afterCallbackSet = /* @__PURE__ */ new Set();
			const onErrorCallbackSet = /* @__PURE__ */ new Set();
			function after(callback) {
				afterCallbackSet.add(callback);
			}
			function onError(callback) {
				onErrorCallbackSet.add(callback);
			}
			triggerSubscriptions(actionSubscriptions, {
				args,
				name: wrappedAction[ACTION_NAME],
				store,
				after,
				onError
			});
			let ret;
			try {
				ret = fn.apply(this && this.$id === $id ? this : store, args);
			} catch (error) {
				triggerSubscriptions(onErrorCallbackSet, error);
				throw error;
			}
			if (ret instanceof Promise) return ret.then((value) => {
				triggerSubscriptions(afterCallbackSet, value);
				return value;
			}).catch((error) => {
				triggerSubscriptions(onErrorCallbackSet, error);
				return Promise.reject(error);
			});
			triggerSubscriptions(afterCallbackSet, ret);
			return ret;
		};
		wrappedAction[ACTION_MARKER] = true;
		wrappedAction[ACTION_NAME] = name;
		return wrappedAction;
	};
	const store = reactive({
		_p: pinia,
		$id,
		$onAction: addSubscription.bind(null, actionSubscriptions),
		$patch,
		$reset,
		$subscribe(callback, options = {}) {
			if (subscriptions.has(callback)) return noop;
			const removeSubscription = addSubscription(subscriptions, callback, options.detached, () => stopWatcher());
			const stopWatcher = scope.run(() => watch(() => pinia.state.value[$id], (state) => {
				if (options.flush === "sync" ? isSyncListening : isListening) callback({
					storeId: $id,
					type: "direct",
					events: debuggerEvents
				}, state);
			}, assign({}, $subscribeOptions, options)));
			return removeSubscription;
		},
		$dispose
	});
	pinia._s.set($id, store);
	const setupStore = (pinia._a && pinia._a.runWithContext || fallbackRunWithContext)(() => pinia._e.run(() => (scope = effectScope()).run(() => setup({ action }))));
	for (const key in setupStore) {
		const prop = setupStore[key];
		if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
			if (!isOptionsStore) {
				if (initialState && shouldHydrate(prop)) if (isRef(prop)) prop.value = initialState[key];
				else mergeReactiveObjects(prop, initialState[key]);
				pinia.state.value[$id][key] = prop;
			}
		} else if (typeof prop === "function") {
			setupStore[key] = action(prop, key);
			optionsForPlugin.actions[key] = prop;
		}
	}
	/* istanbul ignore if */
	assign(store, setupStore);
	assign(toRaw(store), setupStore);
	Object.defineProperty(store, "$state", {
		get: () => pinia.state.value[$id],
		set: (state) => {
			$patch(($state) => {
				assign($state, state);
			});
		}
	});
	pinia._p.forEach((extender) => {
		const extensions = scope.run(() => extender({
			store,
			app: pinia._a,
			pinia,
			options: optionsForPlugin
		}));
		assign(store, extensions);
	});
	if (initialState && isOptionsStore && options.hydrate) options.hydrate(store.$state, initialState);
	isListening = true;
	isSyncListening = true;
	return store;
}
/*! #__NO_SIDE_EFFECTS__ */
function defineStore(id, setup, setupOptions) {
	let options;
	const isSetupStore = typeof setup === "function";
	options = isSetupStore ? setupOptions : setup;
	function useStore(pinia, hot) {
		const hasContext = hasInjectionContext();
		pinia = pinia || (hasContext ? inject(piniaSymbol, null) : null);
		if (pinia) setActivePinia(pinia);
		pinia = activePinia;
		if (!pinia._s.has(id)) if (isSetupStore) createSetupStore(id, setup, options, pinia);
		else createOptionsStore(id, options, pinia);
		return pinia._s.get(id);
	}
	useStore.$id = id;
	return useStore;
}
//#endregion
//#region node_modules/lodash-es/cloneDeep.js
/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;
var CLONE_SYMBOLS_FLAG = 4;
/**
* This method is like `_.clone` except that it recursively clones `value`.
*
* @static
* @memberOf _
* @since 1.0.0
* @category Lang
* @param {*} value The value to recursively clone.
* @returns {*} Returns the deep cloned value.
* @see _.clone
* @example
*
* var objects = [{ 'a': 1 }, { 'b': 2 }];
*
* var deep = _.cloneDeep(objects);
* console.log(deep[0] === objects[0]);
* // => false
*/
function cloneDeep(value) {
	return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}
//#endregion
//#region node_modules/element-plus/es/components/alert/index.mjs
var ElAlert = withInstall(/* @__PURE__ */ defineComponent({
	name: "ElAlert",
	__name: "alert",
	props: buildProps({
		/**
		* @description alert title.
		*/
		title: {
			type: String,
			default: ""
		},
		description: {
			type: String,
			default: ""
		},
		/**
		* @description alert type.
		*/
		type: {
			type: String,
			values: keysOf(TypeComponentsMap),
			default: "info"
		},
		/**
		* @description whether alert can be dismissed.
		*/
		closable: {
			type: Boolean,
			default: true
		},
		/**
		* @description text for replacing x button
		*/
		closeText: {
			type: String,
			default: ""
		},
		/**
		* @description whether show icon
		*/
		showIcon: Boolean,
		/**
		* @description should content be placed in center.
		*/
		center: Boolean,
		effect: {
			type: String,
			values: ["light", "dark"],
			default: "light"
		}
	}),
	emits: { close: (evt) => evt instanceof MouseEvent },
	setup(__props, { emit: __emit }) {
		const { Close } = TypeComponents;
		const props = __props;
		const emit = __emit;
		const slots = useSlots();
		const ns = useNamespace("alert");
		const visible = ref(true);
		const iconComponent = computed(() => TypeComponentsMap[props.type]);
		const hasDesc = computed(() => {
			if (props.description) return true;
			const slotContent = slots.default?.();
			if (!slotContent) return false;
			return flattedChildren(slotContent).some((child) => !isComment(child));
		});
		const close = (evt) => {
			visible.value = false;
			emit("close", evt);
		};
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Transition, {
				name: unref(ns).b("fade"),
				persisted: ""
			}, {
				default: withCtx(() => [withDirectives(createBaseVNode("div", {
					class: normalizeClass([
						unref(ns).b(),
						unref(ns).m(__props.type),
						unref(ns).is("center", __props.center),
						unref(ns).is(__props.effect)
					]),
					role: "alert"
				}, [__props.showIcon && (_ctx.$slots.icon || iconComponent.value) ? (openBlock(), createBlock(unref(ElIcon), {
					key: 0,
					class: normalizeClass([unref(ns).e("icon"), unref(ns).is("big", hasDesc.value)])
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "icon", {}, () => [(openBlock(), createBlock(resolveDynamicComponent(iconComponent.value)))])]),
					_: 3
				}, 8, ["class"])) : createCommentVNode("v-if", true), createBaseVNode("div", { class: normalizeClass(unref(ns).e("content")) }, [
					__props.title || _ctx.$slots.title ? (openBlock(), createElementBlock("span", {
						key: 0,
						class: normalizeClass([unref(ns).e("title"), { "with-description": hasDesc.value }])
					}, [renderSlot(_ctx.$slots, "title", {}, () => [createTextVNode(toDisplayString(__props.title), 1)])], 2)) : createCommentVNode("v-if", true),
					hasDesc.value ? (openBlock(), createElementBlock("p", {
						key: 1,
						class: normalizeClass(unref(ns).e("description"))
					}, [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString(__props.description), 1)])], 2)) : createCommentVNode("v-if", true),
					__props.closable ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [__props.closeText ? (openBlock(), createElementBlock("div", {
						key: 0,
						class: normalizeClass([unref(ns).e("close-btn"), unref(ns).is("customed")]),
						onClick: close
					}, toDisplayString(__props.closeText), 3)) : (openBlock(), createBlock(unref(ElIcon), {
						key: 1,
						class: normalizeClass(unref(ns).e("close-btn")),
						onClick: close
					}, {
						default: withCtx(() => [createVNode(unref(Close))]),
						_: 1
					}, 8, ["class"]))], 64)) : createCommentVNode("v-if", true)
				], 2)], 2), [[vShow, visible.value]])]),
				_: 3
			}, 8, ["name"]);
		};
	}
}));
/**
* @deprecated Removed after 3.0.0, Use `FormProps` instead.
*/
var formProps = buildProps({
	...buildProps({
		/**
		* @description Control the size of components in this form.
		*/
		size: {
			type: String,
			values: componentSizes
		},
		/**
		* @description Whether to disable all components in this form. If set to `true`, it will override the `disabled` prop of the inner component.
		*/
		disabled: Boolean
	}),
	/**
	* @description Data of form component.
	*/
	model: Object,
	/**
	* @description Validation rules of form.
	*/
	rules: { type: definePropType(Object) },
	/**
	* @description Position of label. If set to `'left'` or `'right'`, `label-width` prop is also required.
	*/
	labelPosition: {
		type: String,
		values: [
			"left",
			"right",
			"top"
		],
		default: "right"
	},
	/**
	* @description Position of asterisk.
	*/
	requireAsteriskPosition: {
		type: String,
		values: ["left", "right"],
		default: "left"
	},
	/**
	* @description Width of label, e.g. `'50px'`. All its direct child form items will inherit this value. `auto` is supported.
	*/
	labelWidth: {
		type: [String, Number],
		default: ""
	},
	/**
	* @description Suffix of the label.
	*/
	labelSuffix: {
		type: String,
		default: ""
	},
	/**
	* @description Whether the form is inline.
	*/
	inline: Boolean,
	/**
	* @description Whether to display the error message inline with the form item.
	*/
	inlineMessage: Boolean,
	/**
	* @description Whether to display an icon indicating the validation result.
	*/
	statusIcon: Boolean,
	/**
	* @description Whether to show the error message.
	*/
	showMessage: {
		type: Boolean,
		default: true
	},
	/**
	* @description Whether to trigger validation when the `rules` prop is changed.
	*/
	validateOnRuleChange: {
		type: Boolean,
		default: true
	},
	/**
	* @description Whether to hide required fields should have a red asterisk (star) beside their labels.
	*/
	hideRequiredAsterisk: Boolean,
	/**
	* @description When validation fails, scroll to the first error form entry.
	*/
	scrollToError: Boolean,
	/**
	* @description When validation fails, it scrolls to the first error item based on the scrollIntoView option.
	*/
	scrollIntoViewOptions: {
		type: definePropType([Object, Boolean]),
		default: true
	}
});
var formEmits = { validate: (prop, isValid, message) => (isArray(prop) || isString(prop)) && isBoolean(isValid) && isString(message) };
/**
* @deprecated Removed after 3.0.0, Use `FormItemProps` instead.
*/
var formItemProps = buildProps({
	/**
	* @description Label text.
	*/
	label: String,
	/**
	* @description Width of label, e.g. `'50px'`. `'auto'` is supported.
	*/
	labelWidth: { type: [String, Number] },
	/**
	* @description Position of label. If set to `'left'` or `'right'`, `label-width` prop is also required. The default is extend from `form label-position`.
	*/
	labelPosition: {
		type: String,
		values: [
			"left",
			"right",
			"top",
			""
		],
		default: ""
	},
	/**
	* @description  A key of `model`. It could be an array of property paths (e.g `['a', 'b', '0']`). In the use of `validate` and `resetFields` method, the attribute is required.
	*/
	prop: { type: definePropType([String, Array]) },
	/**
	* @description Whether the field is required or not, will be determined by validation rules if omitted.
	*/
	required: {
		type: Boolean,
		default: void 0
	},
	/**
	* @description Validation rules of form, see the [following table](#formitemrule), more advanced usage at [async-validator](https://github.com/yiminghe/async-validator).
	*/
	rules: { type: definePropType([Object, Array]) },
	/**
	* @description Field error message, set its value and the field will validate error and show this message immediately.
	*/
	error: String,
	/**
	* @description Validation state of formItem.
	*/
	validateStatus: {
		type: String,
		values: [
			"",
			"error",
			"validating",
			"success"
		]
	},
	/**
	* @description Same as for in native label.
	*/
	for: String,
	/**
	* @description Inline style validate message.
	*/
	inlineMessage: {
		type: Boolean,
		default: void 0
	},
	/**
	* @description Whether to show the error message.
	*/
	showMessage: {
		type: Boolean,
		default: true
	},
	/**
	* @description Control the size of components in this form-item.
	*/
	size: {
		type: String,
		values: componentSizes
	}
});
//#endregion
//#region node_modules/element-plus/es/components/form/src/utils.mjs
var SCOPE = "ElForm";
function useFormLabelWidth() {
	const potentialLabelWidthArr = ref([]);
	const autoLabelWidth = computed(() => {
		if (!potentialLabelWidthArr.value.length) return "0";
		const max = Math.max(...potentialLabelWidthArr.value);
		return max ? `${max}px` : "";
	});
	function getLabelWidthIndex(width) {
		const index = potentialLabelWidthArr.value.indexOf(width);
		if (index === -1 && autoLabelWidth.value === "0") debugWarn(SCOPE, `unexpected width ${width}`);
		return index;
	}
	function registerLabelWidth(val, oldVal) {
		if (val && oldVal) {
			const index = getLabelWidthIndex(oldVal);
			potentialLabelWidthArr.value.splice(index, 1, val);
		} else if (val) potentialLabelWidthArr.value.push(val);
	}
	function deregisterLabelWidth(val) {
		const index = getLabelWidthIndex(val);
		if (index > -1) potentialLabelWidthArr.value.splice(index, 1);
	}
	return {
		autoLabelWidth,
		registerLabelWidth,
		deregisterLabelWidth
	};
}
var filterFields = (fields, props) => {
	const normalized = castArray(props).map((prop) => isArray(prop) ? prop.join(".") : prop);
	return normalized.length > 0 ? fields.filter((field) => field.propString && normalized.includes(field.propString)) : fields;
};
//#endregion
//#region node_modules/element-plus/es/components/form/src/form.vue_vue_type_script_setup_true_lang.mjs
var COMPONENT_NAME$1 = "ElForm";
//#endregion
//#region node_modules/element-plus/es/components/form/src/form2.mjs
var form_default = /* @__PURE__ */ defineComponent({
	name: COMPONENT_NAME$1,
	__name: "form",
	props: formProps,
	emits: formEmits,
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const formRef = ref();
		const fields = reactive([]);
		const initialValues = /* @__PURE__ */ new Map();
		const formSize = useFormSize();
		const ns = useNamespace("form");
		const formClasses = computed(() => {
			const { labelPosition, inline } = props;
			return [
				ns.b(),
				ns.m(formSize.value || "default"),
				{
					[ns.m(`label-${labelPosition}`)]: labelPosition,
					[ns.m("inline")]: inline
				}
			];
		});
		const getField = (prop) => {
			return filterFields(fields, [prop])[0];
		};
		const addField = (field) => {
			if (!fields.includes(field)) fields.push(field);
			if (field.propString) if (initialValues.has(field.propString)) field.setInitialValue(initialValues.get(field.propString));
			else initialValues.set(field.propString, cloneDeep(field.fieldValue));
		};
		const removeField = (field, oldPropString) => {
			if (oldPropString) {
				initialValues.delete(oldPropString);
				return;
			}
			const idx = fields.indexOf(field);
			if (idx > -1) {
				fields.splice(idx, 1);
				if (field.propString) initialValues.set(field.propString, cloneDeep(field.getInitialValue()));
			}
		};
		const setInitialValues = (initModel) => {
			if (!props.model) {
				debugWarn(COMPONENT_NAME$1, "model is required for setInitialValues to work.");
				return;
			}
			if (!initModel) {
				debugWarn(COMPONENT_NAME$1, "initModel is required for setInitialValues to work.");
				return;
			}
			for (const key of initialValues.keys()) initialValues.set(key, cloneDeep(getProp(initModel, key).value));
			fields.forEach((field) => {
				if (field.prop) field.setInitialValue(getProp(initModel, field.prop).value);
			});
		};
		const resetFields = (properties = []) => {
			if (!props.model) {
				debugWarn(COMPONENT_NAME$1, "model is required for resetFields to work.");
				return;
			}
			filterFields(fields, properties).forEach((field) => field.resetField());
			const activePropStrings = new Set(fields.map((f) => f.propString).filter(Boolean));
			const propsToCheck = properties.length > 0 ? castArray(properties).map((p) => isArray(p) ? p.join(".") : p) : [...initialValues.keys()];
			for (const propString of propsToCheck) if (!activePropStrings.has(propString) && initialValues.has(propString)) getProp(props.model, propString).value = cloneDeep(initialValues.get(propString));
		};
		const clearValidate = (props = []) => {
			filterFields(fields, props).forEach((field) => field.clearValidate());
		};
		const isValidatable = computed(() => {
			const hasModel = !!props.model;
			if (!hasModel) debugWarn(COMPONENT_NAME$1, "model is required for validate to work.");
			return hasModel;
		});
		const obtainValidateFields = (props) => {
			if (fields.length === 0) return [];
			const filteredFields = filterFields(fields, props);
			if (!filteredFields.length) {
				debugWarn(COMPONENT_NAME$1, "please pass correct props!");
				return [];
			}
			return filteredFields;
		};
		const validate = async (callback) => validateField(void 0, callback);
		const doValidateField = async (props = []) => {
			if (!isValidatable.value) return false;
			const fields = obtainValidateFields(props);
			if (fields.length === 0) return true;
			let validationErrors = {};
			for (const field of fields) try {
				await field.validate("");
				if (field.validateState === "error" && !field.error) field.resetField();
			} catch (fields) {
				validationErrors = {
					...validationErrors,
					...fields
				};
			}
			if (Object.keys(validationErrors).length === 0) return true;
			return Promise.reject(validationErrors);
		};
		const validateField = async (modelProps = [], callback) => {
			let result = false;
			const shouldThrow = !isFunction(callback);
			try {
				result = await doValidateField(modelProps);
				if (result === true) await callback?.(result);
				return result;
			} catch (e) {
				if (e instanceof Error) throw e;
				const invalidFields = e;
				if (props.scrollToError) {
					if (formRef.value) formRef.value.querySelector(`.${ns.b()}-item.is-error`)?.scrollIntoView(props.scrollIntoViewOptions);
				}
				!result && await callback?.(false, invalidFields);
				return shouldThrow && Promise.reject(invalidFields);
			}
		};
		const scrollToField = (prop) => {
			const field = getField(prop);
			if (field) field.$el?.scrollIntoView(props.scrollIntoViewOptions);
		};
		watch(() => props.rules, () => {
			if (props.validateOnRuleChange) validate().catch(NOOP);
		}, {
			deep: true,
			flush: "post"
		});
		provide(formContextKey, reactive({
			...toRefs(props),
			emit,
			resetFields,
			clearValidate,
			validateField,
			getField,
			addField,
			removeField,
			setInitialValues,
			...useFormLabelWidth()
		}));
		__expose({
			/**
			* @description Validate the whole form. Receives a callback or returns `Promise`.
			*/
			validate,
			/**
			* @description Validate specified fields.
			*/
			validateField,
			/**
			* @description Reset specified fields and remove validation result.
			*/
			resetFields,
			/**
			* @description Clear validation message for specified fields.
			*/
			clearValidate,
			/**
			* @description Scroll to the specified fields.
			*/
			scrollToField,
			/**
			* @description Get a field context.
			*/
			getField,
			/**
			* @description All fields context.
			*/
			fields,
			/**
			* @description Set initial values for form fields. When `resetFields` is called, fields will reset to these values.
			*/
			setInitialValues
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("form", {
				ref_key: "formRef",
				ref: formRef,
				class: normalizeClass(formClasses.value)
			}, [renderSlot(_ctx.$slots, "default")], 2);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/form/src/form-label-wrap.mjs
var COMPONENT_NAME = "ElLabelWrap";
var form_label_wrap_default = /* @__PURE__ */ defineComponent({
	name: COMPONENT_NAME,
	props: {
		isAutoWidth: Boolean,
		updateAll: Boolean
	},
	setup(props, { slots }) {
		const formContext = inject(formContextKey, void 0);
		const formItemContext = inject(formItemContextKey);
		if (!formItemContext) throwError(COMPONENT_NAME, "usage: <el-form-item><label-wrap /></el-form-item>");
		const ns = useNamespace("form");
		const el = ref();
		const computedWidth = ref(0);
		const getLabelWidth = () => {
			if (el.value?.firstElementChild) {
				const width = window.getComputedStyle(el.value.firstElementChild).width;
				return Math.ceil(Number.parseFloat(width));
			} else return 0;
		};
		const updateLabelWidth = (action = "update") => {
			nextTick(() => {
				if (slots.default && props.isAutoWidth) {
					if (action === "update") computedWidth.value = getLabelWidth();
					else if (action === "remove") formContext?.deregisterLabelWidth(computedWidth.value);
				}
			});
		};
		const updateLabelWidthFn = () => updateLabelWidth("update");
		onMounted(() => {
			updateLabelWidthFn();
		});
		onBeforeUnmount(() => {
			updateLabelWidth("remove");
		});
		onUpdated(() => updateLabelWidthFn());
		watch(computedWidth, (val, oldVal) => {
			if (props.updateAll) formContext?.registerLabelWidth(val, oldVal);
		});
		useResizeObserver(computed(() => el.value?.firstElementChild ?? null), updateLabelWidthFn);
		return () => {
			if (!slots) return null;
			const { isAutoWidth } = props;
			if (isAutoWidth) {
				const autoLabelWidth = formContext?.autoLabelWidth;
				const hasLabel = formItemContext?.hasLabel;
				const style = {};
				if (hasLabel && autoLabelWidth && autoLabelWidth !== "auto") {
					const marginWidth = Math.max(0, Number.parseInt(autoLabelWidth, 10) - computedWidth.value);
					const marginPosition = (formItemContext.labelPosition || formContext.labelPosition) === "left" ? "marginRight" : "marginLeft";
					if (marginWidth) style[marginPosition] = `${marginWidth}px`;
				}
				return createVNode("div", {
					"ref": el,
					"class": [ns.be("item", "label-wrap")],
					"style": style
				}, [slots.default?.()]);
			} else return createVNode(Fragment, { "ref": el }, [slots.default?.()]);
		};
	}
});
//#endregion
//#region node_modules/async-validator/dist-web/index.js
function _extends() {
	_extends = Object.assign ? Object.assign.bind() : function(target) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
		}
		return target;
	};
	return _extends.apply(this, arguments);
}
function _inheritsLoose(subClass, superClass) {
	subClass.prototype = Object.create(superClass.prototype);
	subClass.prototype.constructor = subClass;
	_setPrototypeOf(subClass, superClass);
}
function _getPrototypeOf(o) {
	_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
		return o.__proto__ || Object.getPrototypeOf(o);
	};
	return _getPrototypeOf(o);
}
function _setPrototypeOf(o, p) {
	_setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
		o.__proto__ = p;
		return o;
	};
	return _setPrototypeOf(o, p);
}
function _isNativeReflectConstruct() {
	if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	if (Reflect.construct.sham) return false;
	if (typeof Proxy === "function") return true;
	try {
		Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
		return true;
	} catch (e) {
		return false;
	}
}
function _construct(Parent, args, Class) {
	if (_isNativeReflectConstruct()) _construct = Reflect.construct.bind();
	else _construct = function _construct(Parent, args, Class) {
		var a = [null];
		a.push.apply(a, args);
		var instance = new (Function.bind.apply(Parent, a))();
		if (Class) _setPrototypeOf(instance, Class.prototype);
		return instance;
	};
	return _construct.apply(null, arguments);
}
function _isNativeFunction(fn) {
	return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _wrapNativeSuper(Class) {
	var _cache = typeof Map === "function" ? /* @__PURE__ */ new Map() : void 0;
	_wrapNativeSuper = function _wrapNativeSuper(Class) {
		if (Class === null || !_isNativeFunction(Class)) return Class;
		if (typeof Class !== "function") throw new TypeError("Super expression must either be null or a function");
		if (typeof _cache !== "undefined") {
			if (_cache.has(Class)) return _cache.get(Class);
			_cache.set(Class, Wrapper);
		}
		function Wrapper() {
			return _construct(Class, arguments, _getPrototypeOf(this).constructor);
		}
		Wrapper.prototype = Object.create(Class.prototype, { constructor: {
			value: Wrapper,
			enumerable: false,
			writable: true,
			configurable: true
		} });
		return _setPrototypeOf(Wrapper, Class);
	};
	return _wrapNativeSuper(Class);
}
var formatRegExp = /%[sdj%]/g;
var warning = function warning() {};
function convertFieldsError(errors) {
	if (!errors || !errors.length) return null;
	var fields = {};
	errors.forEach(function(error) {
		var field = error.field;
		fields[field] = fields[field] || [];
		fields[field].push(error);
	});
	return fields;
}
function format(template) {
	for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) args[_key - 1] = arguments[_key];
	var i = 0;
	var len = args.length;
	if (typeof template === "function") return template.apply(null, args);
	if (typeof template === "string") return template.replace(formatRegExp, function(x) {
		if (x === "%%") return "%";
		if (i >= len) return x;
		switch (x) {
			case "%s": return String(args[i++]);
			case "%d": return Number(args[i++]);
			case "%j":
				try {
					return JSON.stringify(args[i++]);
				} catch (_) {
					return "[Circular]";
				}
				break;
			default: return x;
		}
	});
	return template;
}
function isNativeStringType(type) {
	return type === "string" || type === "url" || type === "hex" || type === "email" || type === "date" || type === "pattern";
}
function isEmptyValue(value, type) {
	if (value === void 0 || value === null) return true;
	if (type === "array" && Array.isArray(value) && !value.length) return true;
	if (isNativeStringType(type) && typeof value === "string" && !value) return true;
	return false;
}
function asyncParallelArray(arr, func, callback) {
	var results = [];
	var total = 0;
	var arrLength = arr.length;
	function count(errors) {
		results.push.apply(results, errors || []);
		total++;
		if (total === arrLength) callback(results);
	}
	arr.forEach(function(a) {
		func(a, count);
	});
}
function asyncSerialArray(arr, func, callback) {
	var index = 0;
	var arrLength = arr.length;
	function next(errors) {
		if (errors && errors.length) {
			callback(errors);
			return;
		}
		var original = index;
		index = index + 1;
		if (original < arrLength) func(arr[original], next);
		else callback([]);
	}
	next([]);
}
function flattenObjArr(objArr) {
	var ret = [];
	Object.keys(objArr).forEach(function(k) {
		ret.push.apply(ret, objArr[k] || []);
	});
	return ret;
}
var AsyncValidationError = /*#__PURE__*/ function(_Error) {
	_inheritsLoose(AsyncValidationError, _Error);
	function AsyncValidationError(errors, fields) {
		var _this = _Error.call(this, "Async Validation Error") || this;
		_this.errors = errors;
		_this.fields = fields;
		return _this;
	}
	return AsyncValidationError;
}(/*#__PURE__*/ _wrapNativeSuper(Error));
function asyncMap(objArr, option, func, callback, source) {
	if (option.first) {
		var _pending = new Promise(function(resolve, reject) {
			asyncSerialArray(flattenObjArr(objArr), func, function next(errors) {
				callback(errors);
				return errors.length ? reject(new AsyncValidationError(errors, convertFieldsError(errors))) : resolve(source);
			});
		});
		_pending["catch"](function(e) {
			return e;
		});
		return _pending;
	}
	var firstFields = option.firstFields === true ? Object.keys(objArr) : option.firstFields || [];
	var objArrKeys = Object.keys(objArr);
	var objArrLength = objArrKeys.length;
	var total = 0;
	var results = [];
	var pending = new Promise(function(resolve, reject) {
		var next = function next(errors) {
			results.push.apply(results, errors);
			total++;
			if (total === objArrLength) {
				callback(results);
				return results.length ? reject(new AsyncValidationError(results, convertFieldsError(results))) : resolve(source);
			}
		};
		if (!objArrKeys.length) {
			callback(results);
			resolve(source);
		}
		objArrKeys.forEach(function(key) {
			var arr = objArr[key];
			if (firstFields.indexOf(key) !== -1) asyncSerialArray(arr, func, next);
			else asyncParallelArray(arr, func, next);
		});
	});
	pending["catch"](function(e) {
		return e;
	});
	return pending;
}
function isErrorObj(obj) {
	return !!(obj && obj.message !== void 0);
}
function getValue(value, path) {
	var v = value;
	for (var i = 0; i < path.length; i++) {
		if (v == void 0) return v;
		v = v[path[i]];
	}
	return v;
}
function complementError(rule, source) {
	return function(oe) {
		var fieldValue;
		if (rule.fullFields) fieldValue = getValue(source, rule.fullFields);
		else fieldValue = source[oe.field || rule.fullField];
		if (isErrorObj(oe)) {
			oe.field = oe.field || rule.fullField;
			oe.fieldValue = fieldValue;
			return oe;
		}
		return {
			message: typeof oe === "function" ? oe() : oe,
			fieldValue,
			field: oe.field || rule.fullField
		};
	};
}
function deepMerge(target, source) {
	if (source) {
		for (var s in source) if (source.hasOwnProperty(s)) {
			var value = source[s];
			if (typeof value === "object" && typeof target[s] === "object") target[s] = _extends({}, target[s], value);
			else target[s] = value;
		}
	}
	return target;
}
var required$1 = function required(rule, value, source, errors, options, type) {
	if (rule.required && (!source.hasOwnProperty(rule.field) || isEmptyValue(value, type || rule.type))) errors.push(format(options.messages.required, rule.fullField));
};
/**
*  Rule for validating whitespace.
*
*  @param rule The validation rule.
*  @param value The value of the field on the source object.
*  @param source The source object being validated.
*  @param errors An array of errors that this rule may add
*  validation errors to.
*  @param options The validation options.
*  @param options.messages The validation messages.
*/
var whitespace = function whitespace(rule, value, source, errors, options) {
	if (/^\s+$/.test(value) || value === "") errors.push(format(options.messages.whitespace, rule.fullField));
};
var urlReg;
var getUrlRegex = (function() {
	if (urlReg) return urlReg;
	var word = "[a-fA-F\\d:]";
	var b = function b(options) {
		return options && options.includeBoundaries ? "(?:(?<=\\s|^)(?=" + word + ")|(?<=" + word + ")(?=\\s|$))" : "";
	};
	var v4 = "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}";
	var v6seg = "[a-fA-F\\d]{1,4}";
	var v6 = ("\n(?:\n(?:" + v6seg + ":){7}(?:" + v6seg + "|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8\n(?:" + v6seg + ":){6}(?:" + v4 + "|:" + v6seg + "|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4\n(?:" + v6seg + ":){5}(?::" + v4 + "|(?::" + v6seg + "){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4\n(?:" + v6seg + ":){4}(?:(?::" + v6seg + "){0,1}:" + v4 + "|(?::" + v6seg + "){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4\n(?:" + v6seg + ":){3}(?:(?::" + v6seg + "){0,2}:" + v4 + "|(?::" + v6seg + "){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4\n(?:" + v6seg + ":){2}(?:(?::" + v6seg + "){0,3}:" + v4 + "|(?::" + v6seg + "){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4\n(?:" + v6seg + ":){1}(?:(?::" + v6seg + "){0,4}:" + v4 + "|(?::" + v6seg + "){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4\n(?::(?:(?::" + v6seg + "){0,5}:" + v4 + "|(?::" + v6seg + "){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4\n)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1\n").replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim();
	var v46Exact = new RegExp("(?:^" + v4 + "$)|(?:^" + v6 + "$)");
	var v4exact = new RegExp("^" + v4 + "$");
	var v6exact = new RegExp("^" + v6 + "$");
	var ip = function ip(options) {
		return options && options.exact ? v46Exact : new RegExp("(?:" + b(options) + v4 + b(options) + ")|(?:" + b(options) + v6 + b(options) + ")", "g");
	};
	ip.v4 = function(options) {
		return options && options.exact ? v4exact : new RegExp("" + b(options) + v4 + b(options), "g");
	};
	ip.v6 = function(options) {
		return options && options.exact ? v6exact : new RegExp("" + b(options) + v6 + b(options), "g");
	};
	var protocol = "(?:(?:[a-z]+:)?//)";
	var auth = "(?:\\S+(?::\\S*)?@)?";
	var ipv4 = ip.v4().source;
	var ipv6 = ip.v6().source;
	var regex = "(?:" + protocol + "|www\\.)" + auth + "(?:localhost|" + ipv4 + "|" + ipv6 + "|(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))(?::\\d{2,5})?(?:[/?#][^\\s\"]*)?";
	urlReg = new RegExp("(?:^" + regex + "$)", "i");
	return urlReg;
});
var pattern$2 = {
	email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/,
	hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i
};
var types = {
	integer: function integer(value) {
		return types.number(value) && parseInt(value, 10) === value;
	},
	"float": function float(value) {
		return types.number(value) && !types.integer(value);
	},
	array: function array(value) {
		return Array.isArray(value);
	},
	regexp: function regexp(value) {
		if (value instanceof RegExp) return true;
		try {
			return !!new RegExp(value);
		} catch (e) {
			return false;
		}
	},
	date: function date(value) {
		return typeof value.getTime === "function" && typeof value.getMonth === "function" && typeof value.getYear === "function" && !isNaN(value.getTime());
	},
	number: function number(value) {
		if (isNaN(value)) return false;
		return typeof value === "number";
	},
	object: function object(value) {
		return typeof value === "object" && !types.array(value);
	},
	method: function method(value) {
		return typeof value === "function";
	},
	email: function email(value) {
		return typeof value === "string" && value.length <= 320 && !!value.match(pattern$2.email);
	},
	url: function url(value) {
		return typeof value === "string" && value.length <= 2048 && !!value.match(getUrlRegex());
	},
	hex: function hex(value) {
		return typeof value === "string" && !!value.match(pattern$2.hex);
	}
};
var type$1 = function type(rule, value, source, errors, options) {
	if (rule.required && value === void 0) {
		required$1(rule, value, source, errors, options);
		return;
	}
	var custom = [
		"integer",
		"float",
		"array",
		"regexp",
		"object",
		"method",
		"email",
		"number",
		"date",
		"url",
		"hex"
	];
	var ruleType = rule.type;
	if (custom.indexOf(ruleType) > -1) {
		if (!types[ruleType](value)) errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
	} else if (ruleType && typeof value !== rule.type) errors.push(format(options.messages.types[ruleType], rule.fullField, rule.type));
};
var range = function range(rule, value, source, errors, options) {
	var len = typeof rule.len === "number";
	var min = typeof rule.min === "number";
	var max = typeof rule.max === "number";
	var spRegexp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
	var val = value;
	var key = null;
	var num = typeof value === "number";
	var str = typeof value === "string";
	var arr = Array.isArray(value);
	if (num) key = "number";
	else if (str) key = "string";
	else if (arr) key = "array";
	if (!key) return false;
	if (arr) val = value.length;
	if (str) val = value.replace(spRegexp, "_").length;
	if (len) {
		if (val !== rule.len) errors.push(format(options.messages[key].len, rule.fullField, rule.len));
	} else if (min && !max && val < rule.min) errors.push(format(options.messages[key].min, rule.fullField, rule.min));
	else if (max && !min && val > rule.max) errors.push(format(options.messages[key].max, rule.fullField, rule.max));
	else if (min && max && (val < rule.min || val > rule.max)) errors.push(format(options.messages[key].range, rule.fullField, rule.min, rule.max));
};
var ENUM$1 = "enum";
var rules = {
	required: required$1,
	whitespace,
	type: type$1,
	range,
	"enum": function enumerable(rule, value, source, errors, options) {
		rule[ENUM$1] = Array.isArray(rule[ENUM$1]) ? rule[ENUM$1] : [];
		if (rule[ENUM$1].indexOf(value) === -1) errors.push(format(options.messages[ENUM$1], rule.fullField, rule[ENUM$1].join(", ")));
	},
	pattern: function pattern(rule, value, source, errors, options) {
		if (rule.pattern) {
			if (rule.pattern instanceof RegExp) {
				rule.pattern.lastIndex = 0;
				if (!rule.pattern.test(value)) errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
			} else if (typeof rule.pattern === "string") {
				if (!new RegExp(rule.pattern).test(value)) errors.push(format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
			}
		}
	}
};
var string = function string(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value, "string") && !rule.required) return callback();
		rules.required(rule, value, source, errors, options, "string");
		if (!isEmptyValue(value, "string")) {
			rules.type(rule, value, source, errors, options);
			rules.range(rule, value, source, errors, options);
			rules.pattern(rule, value, source, errors, options);
			if (rule.whitespace === true) rules.whitespace(rule, value, source, errors, options);
		}
	}
	callback(errors);
};
var method = function method(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value) && !rule.required) return callback();
		rules.required(rule, value, source, errors, options);
		if (value !== void 0) rules.type(rule, value, source, errors, options);
	}
	callback(errors);
};
var number = function number(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (value === "") value = void 0;
		if (isEmptyValue(value) && !rule.required) return callback();
		rules.required(rule, value, source, errors, options);
		if (value !== void 0) {
			rules.type(rule, value, source, errors, options);
			rules.range(rule, value, source, errors, options);
		}
	}
	callback(errors);
};
var _boolean = function _boolean(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value) && !rule.required) return callback();
		rules.required(rule, value, source, errors, options);
		if (value !== void 0) rules.type(rule, value, source, errors, options);
	}
	callback(errors);
};
var regexp = function regexp(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value) && !rule.required) return callback();
		rules.required(rule, value, source, errors, options);
		if (!isEmptyValue(value)) rules.type(rule, value, source, errors, options);
	}
	callback(errors);
};
var integer = function integer(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value) && !rule.required) return callback();
		rules.required(rule, value, source, errors, options);
		if (value !== void 0) {
			rules.type(rule, value, source, errors, options);
			rules.range(rule, value, source, errors, options);
		}
	}
	callback(errors);
};
var floatFn = function floatFn(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value) && !rule.required) return callback();
		rules.required(rule, value, source, errors, options);
		if (value !== void 0) {
			rules.type(rule, value, source, errors, options);
			rules.range(rule, value, source, errors, options);
		}
	}
	callback(errors);
};
var array = function array(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if ((value === void 0 || value === null) && !rule.required) return callback();
		rules.required(rule, value, source, errors, options, "array");
		if (value !== void 0 && value !== null) {
			rules.type(rule, value, source, errors, options);
			rules.range(rule, value, source, errors, options);
		}
	}
	callback(errors);
};
var object = function object(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value) && !rule.required) return callback();
		rules.required(rule, value, source, errors, options);
		if (value !== void 0) rules.type(rule, value, source, errors, options);
	}
	callback(errors);
};
var ENUM = "enum";
var enumerable = function enumerable(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value) && !rule.required) return callback();
		rules.required(rule, value, source, errors, options);
		if (value !== void 0) rules[ENUM](rule, value, source, errors, options);
	}
	callback(errors);
};
var pattern = function pattern(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value, "string") && !rule.required) return callback();
		rules.required(rule, value, source, errors, options);
		if (!isEmptyValue(value, "string")) rules.pattern(rule, value, source, errors, options);
	}
	callback(errors);
};
var date = function date(rule, value, callback, source, options) {
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value, "date") && !rule.required) return callback();
		rules.required(rule, value, source, errors, options);
		if (!isEmptyValue(value, "date")) {
			var dateObject;
			if (value instanceof Date) dateObject = value;
			else dateObject = new Date(value);
			rules.type(rule, dateObject, source, errors, options);
			if (dateObject) rules.range(rule, dateObject.getTime(), source, errors, options);
		}
	}
	callback(errors);
};
var required = function required(rule, value, callback, source, options) {
	var errors = [];
	var type = Array.isArray(value) ? "array" : typeof value;
	rules.required(rule, value, source, errors, options, type);
	callback(errors);
};
var type = function type(rule, value, callback, source, options) {
	var ruleType = rule.type;
	var errors = [];
	if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
		if (isEmptyValue(value, ruleType) && !rule.required) return callback();
		rules.required(rule, value, source, errors, options, ruleType);
		if (!isEmptyValue(value, ruleType)) rules.type(rule, value, source, errors, options);
	}
	callback(errors);
};
var validators = {
	string,
	method,
	number,
	"boolean": _boolean,
	regexp,
	integer,
	"float": floatFn,
	array,
	object,
	"enum": enumerable,
	pattern,
	date,
	url: type,
	hex: type,
	email: type,
	required,
	any: function any(rule, value, callback, source, options) {
		var errors = [];
		if (rule.required || !rule.required && source.hasOwnProperty(rule.field)) {
			if (isEmptyValue(value) && !rule.required) return callback();
			rules.required(rule, value, source, errors, options);
		}
		callback(errors);
	}
};
function newMessages() {
	return {
		"default": "Validation error on field %s",
		required: "%s is required",
		"enum": "%s must be one of %s",
		whitespace: "%s cannot be empty",
		date: {
			format: "%s date %s is invalid for format %s",
			parse: "%s date could not be parsed, %s is invalid ",
			invalid: "%s date %s is invalid"
		},
		types: {
			string: "%s is not a %s",
			method: "%s is not a %s (function)",
			array: "%s is not an %s",
			object: "%s is not an %s",
			number: "%s is not a %s",
			date: "%s is not a %s",
			"boolean": "%s is not a %s",
			integer: "%s is not an %s",
			"float": "%s is not a %s",
			regexp: "%s is not a valid %s",
			email: "%s is not a valid %s",
			url: "%s is not a valid %s",
			hex: "%s is not a valid %s"
		},
		string: {
			len: "%s must be exactly %s characters",
			min: "%s must be at least %s characters",
			max: "%s cannot be longer than %s characters",
			range: "%s must be between %s and %s characters"
		},
		number: {
			len: "%s must equal %s",
			min: "%s cannot be less than %s",
			max: "%s cannot be greater than %s",
			range: "%s must be between %s and %s"
		},
		array: {
			len: "%s must be exactly %s in length",
			min: "%s cannot be less than %s in length",
			max: "%s cannot be greater than %s in length",
			range: "%s must be between %s and %s in length"
		},
		pattern: { mismatch: "%s value %s does not match pattern %s" },
		clone: function clone() {
			var cloned = JSON.parse(JSON.stringify(this));
			cloned.clone = this.clone;
			return cloned;
		}
	};
}
var messages = newMessages();
/**
*  Encapsulates a validation schema.
*
*  @param descriptor An object declaring validation rules
*  for this schema.
*/
var Schema = /*#__PURE__*/ function() {
	function Schema(descriptor) {
		this.rules = null;
		this._messages = messages;
		this.define(descriptor);
	}
	var _proto = Schema.prototype;
	_proto.define = function define(rules) {
		var _this = this;
		if (!rules) throw new Error("Cannot configure a schema with no rules");
		if (typeof rules !== "object" || Array.isArray(rules)) throw new Error("Rules must be an object");
		this.rules = {};
		Object.keys(rules).forEach(function(name) {
			var item = rules[name];
			_this.rules[name] = Array.isArray(item) ? item : [item];
		});
	};
	_proto.messages = function messages(_messages) {
		if (_messages) this._messages = deepMerge(newMessages(), _messages);
		return this._messages;
	};
	_proto.validate = function validate(source_, o, oc) {
		var _this2 = this;
		if (o === void 0) o = {};
		if (oc === void 0) oc = function oc() {};
		var source = source_;
		var options = o;
		var callback = oc;
		if (typeof options === "function") {
			callback = options;
			options = {};
		}
		if (!this.rules || Object.keys(this.rules).length === 0) {
			if (callback) callback(null, source);
			return Promise.resolve(source);
		}
		function complete(results) {
			var errors = [];
			var fields = {};
			function add(e) {
				if (Array.isArray(e)) {
					var _errors;
					errors = (_errors = errors).concat.apply(_errors, e);
				} else errors.push(e);
			}
			for (var i = 0; i < results.length; i++) add(results[i]);
			if (!errors.length) callback(null, source);
			else {
				fields = convertFieldsError(errors);
				callback(errors, fields);
			}
		}
		if (options.messages) {
			var messages$1 = this.messages();
			if (messages$1 === messages) messages$1 = newMessages();
			deepMerge(messages$1, options.messages);
			options.messages = messages$1;
		} else options.messages = this.messages();
		var series = {};
		(options.keys || Object.keys(this.rules)).forEach(function(z) {
			var arr = _this2.rules[z];
			var value = source[z];
			arr.forEach(function(r) {
				var rule = r;
				if (typeof rule.transform === "function") {
					if (source === source_) source = _extends({}, source);
					value = source[z] = rule.transform(value);
				}
				if (typeof rule === "function") rule = { validator: rule };
				else rule = _extends({}, rule);
				rule.validator = _this2.getValidationMethod(rule);
				if (!rule.validator) return;
				rule.field = z;
				rule.fullField = rule.fullField || z;
				rule.type = _this2.getType(rule);
				series[z] = series[z] || [];
				series[z].push({
					rule,
					value,
					source,
					field: z
				});
			});
		});
		var errorFields = {};
		return asyncMap(series, options, function(data, doIt) {
			var rule = data.rule;
			var deep = (rule.type === "object" || rule.type === "array") && (typeof rule.fields === "object" || typeof rule.defaultField === "object");
			deep = deep && (rule.required || !rule.required && data.value);
			rule.field = data.field;
			function addFullField(key, schema) {
				return _extends({}, schema, {
					fullField: rule.fullField + "." + key,
					fullFields: rule.fullFields ? [].concat(rule.fullFields, [key]) : [key]
				});
			}
			function cb(e) {
				if (e === void 0) e = [];
				var errorList = Array.isArray(e) ? e : [e];
				if (!options.suppressWarning && errorList.length) Schema.warning("async-validator:", errorList);
				if (errorList.length && rule.message !== void 0) errorList = [].concat(rule.message);
				var filledErrors = errorList.map(complementError(rule, source));
				if (options.first && filledErrors.length) {
					errorFields[rule.field] = 1;
					return doIt(filledErrors);
				}
				if (!deep) doIt(filledErrors);
				else {
					if (rule.required && !data.value) {
						if (rule.message !== void 0) filledErrors = [].concat(rule.message).map(complementError(rule, source));
						else if (options.error) filledErrors = [options.error(rule, format(options.messages.required, rule.field))];
						return doIt(filledErrors);
					}
					var fieldsSchema = {};
					if (rule.defaultField) Object.keys(data.value).map(function(key) {
						fieldsSchema[key] = rule.defaultField;
					});
					fieldsSchema = _extends({}, fieldsSchema, data.rule.fields);
					var paredFieldsSchema = {};
					Object.keys(fieldsSchema).forEach(function(field) {
						var fieldSchema = fieldsSchema[field];
						paredFieldsSchema[field] = (Array.isArray(fieldSchema) ? fieldSchema : [fieldSchema]).map(addFullField.bind(null, field));
					});
					var schema = new Schema(paredFieldsSchema);
					schema.messages(options.messages);
					if (data.rule.options) {
						data.rule.options.messages = options.messages;
						data.rule.options.error = options.error;
					}
					schema.validate(data.value, data.rule.options || options, function(errs) {
						var finalErrors = [];
						if (filledErrors && filledErrors.length) finalErrors.push.apply(finalErrors, filledErrors);
						if (errs && errs.length) finalErrors.push.apply(finalErrors, errs);
						doIt(finalErrors.length ? finalErrors : null);
					});
				}
			}
			var res;
			if (rule.asyncValidator) res = rule.asyncValidator(rule, data.value, cb, data.source, options);
			else if (rule.validator) {
				try {
					res = rule.validator(rule, data.value, cb, data.source, options);
				} catch (error) {
					console.error == null || console.error(error);
					if (!options.suppressValidatorError) setTimeout(function() {
						throw error;
					}, 0);
					cb(error.message);
				}
				if (res === true) cb();
				else if (res === false) cb(typeof rule.message === "function" ? rule.message(rule.fullField || rule.field) : rule.message || (rule.fullField || rule.field) + " fails");
				else if (res instanceof Array) cb(res);
				else if (res instanceof Error) cb(res.message);
			}
			if (res && res.then) res.then(function() {
				return cb();
			}, function(e) {
				return cb(e);
			});
		}, function(results) {
			complete(results);
		}, source);
	};
	_proto.getType = function getType(rule) {
		if (rule.type === void 0 && rule.pattern instanceof RegExp) rule.type = "pattern";
		if (typeof rule.validator !== "function" && rule.type && !validators.hasOwnProperty(rule.type)) throw new Error(format("Unknown rule type %s", rule.type));
		return rule.type || "string";
	};
	_proto.getValidationMethod = function getValidationMethod(rule) {
		if (typeof rule.validator === "function") return rule.validator;
		var keys = Object.keys(rule);
		var messageIndex = keys.indexOf("message");
		if (messageIndex !== -1) keys.splice(messageIndex, 1);
		if (keys.length === 1 && keys[0] === "required") return validators.required;
		return validators[this.getType(rule)] || void 0;
	};
	return Schema;
}();
Schema.register = function register(type, validator) {
	if (typeof validator !== "function") throw new Error("Cannot register a validator by type, validator is not a function");
	validators[type] = validator;
};
Schema.warning = warning;
Schema.messages = messages;
Schema.validators = validators;
//#endregion
//#region node_modules/element-plus/es/components/form/src/form-item.vue_vue_type_script_setup_true_lang.mjs
var _hoisted_1$3 = ["role", "aria-labelledby"];
//#endregion
//#region node_modules/element-plus/es/components/form/src/form-item2.mjs
var form_item_default = /* @__PURE__ */ defineComponent({
	name: "ElFormItem",
	__name: "form-item",
	props: formItemProps,
	setup(__props, { expose: __expose }) {
		const props = __props;
		const slots = useSlots();
		const formContext = inject(formContextKey, void 0);
		const parentFormItemContext = inject(formItemContextKey, void 0);
		const _size = useFormSize(void 0, { formItem: false });
		const ns = useNamespace("form-item");
		const labelId = useId().value;
		const inputIds = ref([]);
		const validateState = ref("");
		const validateStateDebounced = refDebounced(validateState, 100);
		const validateMessage = ref("");
		const formItemRef = ref();
		let initialValue = void 0;
		let isResettingField = false;
		const labelPosition = computed(() => props.labelPosition || formContext?.labelPosition);
		const labelStyle = computed(() => {
			if (labelPosition.value === "top") return {};
			return { width: addUnit(props.labelWidth ?? formContext?.labelWidth) };
		});
		const contentStyle = computed(() => {
			if (labelPosition.value === "top" || formContext?.inline) return {};
			if (!props.label && !props.labelWidth && isNested) return {};
			const labelWidth = addUnit(props.labelWidth ?? formContext?.labelWidth);
			if (!props.label && !slots.label) return { marginLeft: labelWidth };
			return {};
		});
		const formItemClasses = computed(() => [
			ns.b(),
			ns.m(_size.value),
			ns.is("error", validateState.value === "error"),
			ns.is("validating", validateState.value === "validating"),
			ns.is("success", validateState.value === "success"),
			ns.is("required", isRequired.value || props.required),
			ns.is("no-asterisk", formContext?.hideRequiredAsterisk),
			formContext?.requireAsteriskPosition === "right" ? "asterisk-right" : "asterisk-left",
			{
				[ns.m("feedback")]: formContext?.statusIcon,
				[ns.m(`label-${labelPosition.value}`)]: labelPosition.value
			}
		]);
		const _inlineMessage = computed(() => isBoolean(props.inlineMessage) ? props.inlineMessage : formContext?.inlineMessage || false);
		const validateClasses = computed(() => [ns.e("error"), { [ns.em("error", "inline")]: _inlineMessage.value }]);
		const propString = computed(() => {
			if (!props.prop) return "";
			return isArray(props.prop) ? props.prop.join(".") : props.prop;
		});
		const hasLabel = computed(() => {
			return !!(props.label || slots.label);
		});
		const labelFor = computed(() => {
			return props.for ?? (inputIds.value.length === 1 ? inputIds.value[0] : void 0);
		});
		const isGroup = computed(() => {
			return !labelFor.value && hasLabel.value;
		});
		const isNested = !!parentFormItemContext;
		const fieldValue = computed(() => {
			const model = formContext?.model;
			if (!model || !props.prop) return;
			return getProp(model, props.prop).value;
		});
		const normalizedRules = computed(() => {
			const { required } = props;
			const rules = [];
			if (props.rules) rules.push(...castArray(props.rules));
			const formRules = formContext?.rules;
			if (formRules && props.prop) {
				const _rules = getProp(formRules, props.prop).value;
				if (_rules) rules.push(...castArray(_rules));
			}
			if (required !== void 0) {
				const requiredRules = rules.map((rule, i) => [rule, i]).filter(([rule]) => "required" in rule);
				if (requiredRules.length > 0) for (const [rule, i] of requiredRules) {
					if (rule.required === required) continue;
					rules[i] = {
						...rule,
						required
					};
				}
				else rules.push({ required });
			}
			return rules;
		});
		const validateEnabled = computed(() => normalizedRules.value.length > 0);
		const getFilteredRule = (trigger) => {
			return normalizedRules.value.filter((rule) => {
				if (!rule.trigger || !trigger) return true;
				if (isArray(rule.trigger)) return rule.trigger.includes(trigger);
				else return rule.trigger === trigger;
			}).map(({ trigger, ...rule }) => rule);
		};
		const isRequired = computed(() => normalizedRules.value.some((rule) => rule.required));
		const shouldShowError = computed(() => validateStateDebounced.value === "error" && props.showMessage && (formContext?.showMessage ?? true));
		const currentLabel = computed(() => `${props.label || ""}${formContext?.labelSuffix || ""}`);
		const setValidationState = (state) => {
			validateState.value = state;
		};
		const onValidationFailed = (error) => {
			const { errors, fields } = error;
			if (!errors || !fields) console.error(error);
			setValidationState("error");
			validateMessage.value = errors ? errors?.[0]?.message ?? `${props.prop} is required` : "";
			formContext?.emit("validate", props.prop, false, validateMessage.value);
		};
		const onValidationSucceeded = () => {
			setValidationState("success");
			formContext?.emit("validate", props.prop, true, "");
		};
		const doValidate = async (rules) => {
			const modelName = propString.value;
			return new Schema({ [modelName]: rules }).validate({ [modelName]: fieldValue.value }, { firstFields: true }).then(() => {
				onValidationSucceeded();
				return true;
			}).catch((err) => {
				onValidationFailed(err);
				return Promise.reject(err);
			});
		};
		const validate = async (trigger, callback) => {
			if (isResettingField || !props.prop) return false;
			const hasCallback = isFunction(callback);
			if (!validateEnabled.value) {
				callback?.(false);
				return false;
			}
			const rules = getFilteredRule(trigger);
			if (rules.length === 0) {
				callback?.(true);
				return true;
			}
			setValidationState("validating");
			return doValidate(rules).then(() => {
				callback?.(true);
				return true;
			}).catch((err) => {
				const { fields } = err;
				callback?.(false, fields);
				return hasCallback ? false : Promise.reject(fields);
			});
		};
		const clearValidate = () => {
			setValidationState("");
			validateMessage.value = "";
			isResettingField = false;
		};
		const resetField = async () => {
			const model = formContext?.model;
			if (!model || !props.prop) return;
			const computedValue = getProp(model, props.prop);
			isResettingField = true;
			computedValue.value = cloneDeep(initialValue);
			await nextTick();
			clearValidate();
			isResettingField = false;
		};
		const addInputId = (id) => {
			if (!inputIds.value.includes(id)) inputIds.value.push(id);
		};
		const removeInputId = (id) => {
			inputIds.value = inputIds.value.filter((listId) => listId !== id);
		};
		const setInitialValue = (value) => {
			initialValue = cloneDeep(value);
		};
		const getInitialValue = () => initialValue;
		watch(() => props.error, (val) => {
			validateMessage.value = val || "";
			setValidationState(val ? "error" : "");
		}, { immediate: true });
		watch(() => props.validateStatus, (val) => setValidationState(val || ""));
		const context = reactive({
			...toRefs(props),
			$el: formItemRef,
			size: _size,
			validateMessage,
			validateState,
			labelId,
			inputIds,
			isGroup,
			hasLabel,
			fieldValue,
			addInputId,
			removeInputId,
			resetField,
			clearValidate,
			validate,
			propString,
			setInitialValue,
			getInitialValue
		});
		provide(formItemContextKey, context);
		watch(propString, (newPropString, oldPropString) => {
			if (!formContext || !oldPropString) return;
			formContext.removeField(context, oldPropString);
			if (newPropString) {
				setInitialValue(fieldValue.value);
				formContext.addField(context);
			}
		});
		onMounted(() => {
			if (props.prop) {
				setInitialValue(fieldValue.value);
				formContext?.addField(context);
			}
		});
		onBeforeUnmount(() => {
			formContext?.removeField(context);
		});
		__expose({
			/**
			* @description Form item size.
			*/
			size: _size,
			/**
			* @description Validation message.
			*/
			validateMessage,
			/**
			* @description Validation state.
			*/
			validateState,
			/**
			* @description Validate form item.
			*/
			validate,
			/**
			* @description Remove validation status of the field.
			*/
			clearValidate,
			/**
			* @description Reset current field and remove validation result.
			*/
			resetField,
			/**
			* @description Set initial value for this field. When `resetField` is called, the field will reset to this value.
			*/
			setInitialValue
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "formItemRef",
				ref: formItemRef,
				class: normalizeClass(formItemClasses.value),
				role: isGroup.value ? "group" : void 0,
				"aria-labelledby": isGroup.value ? unref(labelId) : void 0
			}, [createVNode(unref(form_label_wrap_default), {
				"is-auto-width": labelStyle.value.width === "auto",
				"update-all": unref(formContext)?.labelWidth === "auto"
			}, {
				default: withCtx(() => [!!(__props.label || _ctx.$slots.label) ? (openBlock(), createBlock(resolveDynamicComponent(labelFor.value ? "label" : "div"), {
					key: 0,
					id: unref(labelId),
					for: labelFor.value,
					class: normalizeClass(unref(ns).e("label")),
					style: normalizeStyle(labelStyle.value)
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "label", { label: currentLabel.value }, () => [createTextVNode(toDisplayString(currentLabel.value), 1)])]),
					_: 3
				}, 8, [
					"id",
					"for",
					"class",
					"style"
				])) : createCommentVNode("v-if", true)]),
				_: 3
			}, 8, ["is-auto-width", "update-all"]), createBaseVNode("div", {
				class: normalizeClass(unref(ns).e("content")),
				style: normalizeStyle(contentStyle.value)
			}, [renderSlot(_ctx.$slots, "default"), createVNode(TransitionGroup, { name: `${unref(ns).namespace.value}-zoom-in-top` }, {
				default: withCtx(() => [shouldShowError.value ? renderSlot(_ctx.$slots, "error", {
					key: 0,
					error: validateMessage.value
				}, () => [createBaseVNode("div", { class: normalizeClass(validateClasses.value) }, toDisplayString(validateMessage.value), 3)]) : createCommentVNode("v-if", true)]),
				_: 3
			}, 8, ["name"])], 6)], 10, _hoisted_1$3);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/form/index.mjs
var ElForm = withInstall(form_default, { FormItem: form_item_default });
var ElFormItem = withNoopInstall(form_item_default);
//#endregion
//#region node_modules/element-plus/es/components/radio/src/radio.mjs
/**
* @deprecated Removed after 3.0.0, Use `RadioPropsBase` instead.
*/
var radioPropsBase = buildProps({
	/**
	* @description binding value
	*/
	modelValue: {
		type: [
			String,
			Number,
			Boolean
		],
		default: void 0
	},
	/**
	* @description size of the Radio
	*/
	size: useSizeProp,
	/**
	* @description whether Radio is disabled
	*/
	disabled: {
		type: Boolean,
		default: void 0
	},
	/**
	* @description the label of Radio
	*/
	label: {
		type: [
			String,
			Number,
			Boolean
		],
		default: void 0
	},
	/**
	* @description the value of Radio
	*/
	value: {
		type: [
			String,
			Number,
			Boolean
		],
		default: void 0
	},
	/**
	* @description native `name` attribute
	*/
	name: {
		type: String,
		default: void 0
	}
});
/**
* @deprecated Removed after 3.0.0, Use `RadioProps` instead.
*/
var radioProps = buildProps({
	...radioPropsBase,
	/**
	* @description whether to add a border around Radio
	*/
	border: Boolean
});
var radioEmits = {
	[UPDATE_MODEL_EVENT]: (val) => isString(val) || isNumber(val) || isBoolean(val),
	[CHANGE_EVENT]: (val) => isString(val) || isNumber(val) || isBoolean(val)
};
//#endregion
//#region node_modules/element-plus/es/components/radio/src/constants.mjs
var radioGroupKey = Symbol("radioGroupKey");
//#endregion
//#region node_modules/element-plus/es/components/radio/src/radio-button.mjs
/**
* @deprecated Removed after 3.0.0, Use `RadioButtonProps` instead.
*/
var radioButtonProps = buildProps({ ...radioPropsBase });
//#endregion
//#region node_modules/element-plus/es/components/radio/src/radio-group.mjs
var radioDefaultProps = {
	label: "label",
	value: "value",
	disabled: "disabled"
};
/**
* @deprecated Removed after 3.0.0, Use `RadioGroupProps` instead.
*/
var radioGroupProps = buildProps({
	/**
	* @description native `id` attribute
	*/
	id: {
		type: String,
		default: void 0
	},
	/**
	* @description the size of radio buttons or bordered radios
	*/
	size: useSizeProp,
	/**
	* @description whether the nesting radios are disabled
	*/
	disabled: {
		type: Boolean,
		default: void 0
	},
	/**
	* @description binding value
	*/
	modelValue: {
		type: [
			String,
			Number,
			Boolean
		],
		default: void 0
	},
	/**
	* @description border and background color when button is active
	*/
	fill: {
		type: String,
		default: ""
	},
	/**
	* @description font color when button is active
	*/
	textColor: {
		type: String,
		default: ""
	},
	/**
	* @description native `name` attribute
	*/
	name: {
		type: String,
		default: void 0
	},
	/**
	* @description whether to trigger form validation
	*/
	validateEvent: {
		type: Boolean,
		default: true
	},
	options: { type: definePropType(Array) },
	props: {
		type: definePropType(Object),
		default: () => radioDefaultProps
	},
	type: {
		type: String,
		values: ["radio", "button"],
		default: "radio"
	},
	...useAriaProps(["ariaLabel"])
});
var radioGroupEmits = radioEmits;
//#endregion
//#region node_modules/element-plus/es/components/radio/src/use-radio.mjs
var useRadio = (props, emit) => {
	const radioRef = ref();
	const radioGroup = inject(radioGroupKey, void 0);
	const isGroup = computed(() => !!radioGroup);
	const actualValue = computed(() => {
		if (!isPropAbsent(props.value)) return props.value;
		return props.label;
	});
	const modelValue = computed({
		get() {
			return isGroup.value ? radioGroup.modelValue : props.modelValue;
		},
		set(val) {
			if (isGroup.value) radioGroup.changeEvent(val);
			else emit && emit("update:modelValue", val);
			radioRef.value.checked = props.modelValue === actualValue.value;
		}
	});
	const size = useFormSize(computed(() => radioGroup?.size));
	const disabled = useFormDisabled(computed(() => radioGroup?.disabled));
	const focus = ref(false);
	const tabIndex = computed(() => {
		return disabled.value || isGroup.value && modelValue.value !== actualValue.value ? -1 : 0;
	});
	useDeprecated({
		from: "label act as value",
		replacement: "value",
		version: "3.0.0",
		scope: "el-radio",
		ref: "https://element-plus.org/en-US/component/radio.html"
	}, computed(() => isGroup.value && isPropAbsent(props.value)));
	return {
		radioRef,
		isGroup,
		radioGroup,
		focus,
		size,
		disabled,
		tabIndex,
		modelValue,
		actualValue
	};
};
//#endregion
//#region node_modules/element-plus/es/components/radio/src/radio.vue_vue_type_script_setup_true_lang.mjs
var _hoisted_1$2 = [
	"value",
	"name",
	"disabled",
	"checked"
];
//#endregion
//#region node_modules/element-plus/es/components/radio/src/radio2.mjs
var radio_default = /* @__PURE__ */ defineComponent({
	name: "ElRadio",
	__name: "radio",
	props: radioProps,
	emits: radioEmits,
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const ns = useNamespace("radio");
		const { radioRef, radioGroup, focus, size, disabled, modelValue, actualValue } = useRadio(props, emit);
		function handleChange() {
			nextTick(() => emit(CHANGE_EVENT, modelValue.value));
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("label", { class: normalizeClass([
				unref(ns).b(),
				unref(ns).is("disabled", unref(disabled)),
				unref(ns).is("focus", unref(focus)),
				unref(ns).is("bordered", __props.border),
				unref(ns).is("checked", unref(modelValue) === unref(actualValue)),
				unref(ns).m(unref(size))
			]) }, [createBaseVNode("span", { class: normalizeClass([
				unref(ns).e("input"),
				unref(ns).is("disabled", unref(disabled)),
				unref(ns).is("checked", unref(modelValue) === unref(actualValue))
			]) }, [withDirectives(createBaseVNode("input", {
				ref_key: "radioRef",
				ref: radioRef,
				"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isRef(modelValue) ? modelValue.value = $event : null),
				class: normalizeClass(unref(ns).e("original")),
				value: unref(actualValue),
				name: __props.name || unref(radioGroup)?.name,
				disabled: unref(disabled),
				checked: unref(modelValue) === unref(actualValue),
				type: "radio",
				onFocus: _cache[1] || (_cache[1] = ($event) => focus.value = true),
				onBlur: _cache[2] || (_cache[2] = ($event) => focus.value = false),
				onChange: handleChange,
				onClick: _cache[3] || (_cache[3] = withModifiers(() => {}, ["stop"]))
			}, null, 42, _hoisted_1$2), [[vModelRadio, unref(modelValue)]]), createBaseVNode("span", { class: normalizeClass(unref(ns).e("inner")) }, null, 2)], 2), createBaseVNode("span", {
				class: normalizeClass(unref(ns).e("label")),
				onKeydown: _cache[4] || (_cache[4] = withModifiers(() => {}, ["stop"]))
			}, [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString(__props.label), 1)])], 34)], 2);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/radio/src/radio-button.vue_vue_type_script_setup_true_lang.mjs
var _hoisted_1$1 = [
	"value",
	"name",
	"disabled"
];
//#endregion
//#region node_modules/element-plus/es/components/radio/src/radio-button2.mjs
var radio_button_default = /* @__PURE__ */ defineComponent({
	name: "ElRadioButton",
	__name: "radio-button",
	props: radioButtonProps,
	setup(__props) {
		const props = __props;
		const ns = useNamespace("radio");
		const { radioRef, focus, size, disabled, modelValue, radioGroup, actualValue } = useRadio(props);
		const activeStyle = computed(() => {
			return {
				backgroundColor: radioGroup?.fill || "",
				borderColor: radioGroup?.fill || "",
				boxShadow: radioGroup?.fill ? `-1px 0 0 0 ${radioGroup.fill}` : "",
				color: radioGroup?.textColor || ""
			};
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("label", { class: normalizeClass([
				unref(ns).b("button"),
				unref(ns).is("active", unref(modelValue) === unref(actualValue)),
				unref(ns).is("disabled", unref(disabled)),
				unref(ns).is("focus", unref(focus)),
				unref(ns).bm("button", unref(size))
			]) }, [withDirectives(createBaseVNode("input", {
				ref_key: "radioRef",
				ref: radioRef,
				"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isRef(modelValue) ? modelValue.value = $event : null),
				class: normalizeClass(unref(ns).be("button", "original-radio")),
				value: unref(actualValue),
				type: "radio",
				name: __props.name || unref(radioGroup)?.name,
				disabled: unref(disabled),
				onFocus: _cache[1] || (_cache[1] = ($event) => focus.value = true),
				onBlur: _cache[2] || (_cache[2] = ($event) => focus.value = false),
				onClick: _cache[3] || (_cache[3] = withModifiers(() => {}, ["stop"]))
			}, null, 42, _hoisted_1$1), [[vModelRadio, unref(modelValue)]]), createBaseVNode("span", {
				class: normalizeClass(unref(ns).be("button", "inner")),
				style: normalizeStyle(unref(modelValue) === unref(actualValue) ? activeStyle.value : {}),
				onKeydown: _cache[4] || (_cache[4] = withModifiers(() => {}, ["stop"]))
			}, [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString(__props.label), 1)])], 38)], 2);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/radio/src/radio-group.vue_vue_type_script_setup_true_lang.mjs
var _hoisted_1 = [
	"id",
	"aria-label",
	"aria-labelledby"
];
//#endregion
//#region node_modules/element-plus/es/components/radio/src/radio-group2.mjs
var radio_group_default = /* @__PURE__ */ defineComponent({
	name: "ElRadioGroup",
	__name: "radio-group",
	props: radioGroupProps,
	emits: radioGroupEmits,
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const ns = useNamespace("radio");
		const radioId = useId();
		const radioGroupRef = ref();
		const { formItem } = useFormItem();
		const { inputId: groupId, isLabeledByFormItem } = useFormItemInputId(props, { formItemContext: formItem });
		const changeEvent = (value) => {
			emit(UPDATE_MODEL_EVENT, value);
			nextTick(() => emit(CHANGE_EVENT, value));
		};
		onMounted(() => {
			const radios = radioGroupRef.value.querySelectorAll("[type=radio]");
			const firstLabel = radios[0];
			if (!Array.from(radios).some((radio) => radio.checked) && firstLabel) firstLabel.tabIndex = 0;
		});
		const name = computed(() => {
			return props.name || radioId.value;
		});
		const aliasProps = computed(() => ({
			...radioDefaultProps,
			...props.props
		}));
		const getOptionProps = (option) => {
			const { label, value, disabled } = aliasProps.value;
			const base = {
				label: option[label],
				value: option[value],
				disabled: option[disabled]
			};
			return {
				...omit(option, [
					label,
					value,
					disabled
				]),
				...base
			};
		};
		const optionComponent = computed(() => props.type === "button" ? radio_button_default : radio_default);
		provide(radioGroupKey, reactive({
			...toRefs(props),
			changeEvent,
			name
		}));
		watch(() => props.modelValue, (newVal, oldValue) => {
			if (props.validateEvent && !isEqual(newVal, oldValue)) formItem?.validate("change").catch(NOOP);
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				id: unref(groupId),
				ref_key: "radioGroupRef",
				ref: radioGroupRef,
				class: normalizeClass(unref(ns).b("group")),
				role: "radiogroup",
				"aria-label": !unref(isLabeledByFormItem) ? __props.ariaLabel || "radio-group" : void 0,
				"aria-labelledby": unref(isLabeledByFormItem) ? unref(formItem).labelId : void 0
			}, [renderSlot(_ctx.$slots, "default", {}, () => [(openBlock(true), createElementBlock(Fragment, null, renderList(__props.options, (item, index) => {
				return openBlock(), createBlock(resolveDynamicComponent(optionComponent.value), mergeProps({ key: index }, { ref_for: true }, getOptionProps(item)), null, 16);
			}), 128))])], 10, _hoisted_1);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/radio/index.mjs
var ElRadio = withInstall(radio_default, {
	RadioButton: radio_button_default,
	RadioGroup: radio_group_default
});
var ElRadioGroup = withNoopInstall(radio_group_default);
var ElRadioButton = withNoopInstall(radio_button_default);
//#endregion
//#region src/renderer/stores/app.ts
/**
* 应用全局 Store - 管理初始化状态、侧栏折叠和设置抽屉。
*/
var useAppStore = defineStore("app", () => {
	const initStatus = ref({
		customerInitialImportDone: false,
		productInitialImportDone: false,
		templateVersion: null
	});
	const sidebarCollapsed = ref(false);
	const settingsDrawerVisible = ref(false);
	const loading = ref(false);
	const customerImportDone = computed(() => initStatus.value.customerInitialImportDone);
	const productImportDone = computed(() => initStatus.value.productInitialImportDone);
	/** 加载初始化状态 */
	async function loadInitStatus() {
		initStatus.value = await api.system.getInitStatus();
	}
	/** 切换侧栏折叠 */
	function toggleSidebar() {
		sidebarCollapsed.value = !sidebarCollapsed.value;
	}
	/** 打开/关闭设置抽屉 */
	function toggleSettingsDrawer(visible) {
		settingsDrawerVisible.value = visible ?? !settingsDrawerVisible.value;
	}
	return {
		initStatus,
		sidebarCollapsed,
		settingsDrawerVisible,
		loading,
		customerImportDone,
		productImportDone,
		loadInitStatus,
		toggleSidebar,
		toggleSettingsDrawer
	};
});
//#endregion
export { ElForm as a, cloneDeep as c, ElRadioGroup as i, createPinia as l, ElRadio as n, ElFormItem as o, ElRadioButton as r, ElAlert as s, useAppStore as t, defineStore as u };
