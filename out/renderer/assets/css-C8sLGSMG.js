//#region node_modules/@vue/shared/dist/shared.esm-bundler.js
/**
* @vue/shared v3.5.40
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function makeMap(str) {
	const map = /* @__PURE__ */ Object.create(null);
	for (const key of str.split(",")) map[key] = 1;
	return (val) => val in map;
}
var EMPTY_OBJ = {};
var EMPTY_ARR = [];
var NOOP = () => {};
var NO = () => false;
var isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
var isModelListener = (key) => key.startsWith("onUpdate:");
var extend = Object.assign;
var remove = (arr, el) => {
	const i = arr.indexOf(el);
	if (i > -1) arr.splice(i, 1);
};
var hasOwnProperty$15 = Object.prototype.hasOwnProperty;
var hasOwn = (val, key) => hasOwnProperty$15.call(val, key);
var isArray$1 = Array.isArray;
var isMap$1 = (val) => toTypeString(val) === "[object Map]";
var isSet$1 = (val) => toTypeString(val) === "[object Set]";
var isDate = (val) => toTypeString(val) === "[object Date]";
var isFunction$1 = (val) => typeof val === "function";
var isString = (val) => typeof val === "string";
var isSymbol$1 = (val) => typeof val === "symbol";
var isObject$2 = (val) => val !== null && typeof val === "object";
var isPromise = (val) => {
	return (isObject$2(val) || isFunction$1(val)) && isFunction$1(val.then) && isFunction$1(val.catch);
};
var objectToString$1 = Object.prototype.toString;
var toTypeString = (value) => objectToString$1.call(value);
var toRawType = (value) => {
	return toTypeString(value).slice(8, -1);
};
var isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
var isReservedProp = /* @__PURE__ */ makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
var cacheStringFunction$1 = (fn) => {
	const cache = /* @__PURE__ */ Object.create(null);
	return ((str) => {
		return cache[str] || (cache[str] = fn(str));
	});
};
var camelizeRE$1 = /-\w/g;
var camelize$1 = cacheStringFunction$1((str) => {
	return str.replace(camelizeRE$1, (c) => c.slice(1).toUpperCase());
});
var hyphenateRE$1 = /\B([A-Z])/g;
var hyphenate$1 = cacheStringFunction$1((str) => str.replace(hyphenateRE$1, "-$1").toLowerCase());
var capitalize$1 = cacheStringFunction$1((str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
});
var toHandlerKey = cacheStringFunction$1((str) => {
	return str ? `on${capitalize$1(str)}` : ``;
});
var hasChanged = (value, oldValue) => !Object.is(value, oldValue);
var invokeArrayFns = (fns, ...arg) => {
	for (let i = 0; i < fns.length; i++) fns[i](...arg);
};
var def = (obj, key, value, writable = false) => {
	Object.defineProperty(obj, key, {
		configurable: true,
		enumerable: false,
		writable,
		value
	});
};
var looseToNumber$1 = (val) => {
	const n = parseFloat(val);
	return isNaN(n) ? val : n;
};
var toNumber$1 = (val) => {
	const n = isString(val) ? Number(val) : NaN;
	return isNaN(n) ? val : n;
};
var _globalThis;
var getGlobalThis = () => {
	return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
	if (isArray$1(value)) {
		const res = {};
		for (let i = 0; i < value.length; i++) {
			const item = value[i];
			const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
			if (normalized) for (const key in normalized) res[key] = normalized[key];
		}
		return res;
	} else if (isString(value) || isObject$2(value)) return value;
}
var listDelimiterRE = /;(?![^(]*\))/g;
var propertyDelimiterRE = /:([^]+)/;
var styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
	const ret = {};
	cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
		if (item) {
			const tmp = item.split(propertyDelimiterRE);
			tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
		}
	});
	return ret;
}
function normalizeClass(value) {
	let res = "";
	if (isString(value)) res = value;
	else if (isArray$1(value)) for (let i = 0; i < value.length; i++) {
		const normalized = normalizeClass(value[i]);
		if (normalized) res += normalized + " ";
	}
	else if (isObject$2(value)) {
		for (const name in value) if (value[name]) res += name + " ";
	}
	return res.trim();
}
function normalizeProps(props) {
	if (!props) return null;
	let { class: klass, style } = props;
	if (klass && !isString(klass)) props.class = normalizeClass(klass);
	if (style) props.style = normalizeStyle(style);
	return props;
}
var specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
var isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
specialBooleanAttrs + "";
function includeBooleanAttr(value) {
	return !!value || value === "";
}
function looseCompareArrays(a, b) {
	if (a.length !== b.length) return false;
	let equal = true;
	for (let i = 0; equal && i < a.length; i++) equal = looseEqual(a[i], b[i]);
	return equal;
}
function looseEqual(a, b) {
	if (a === b) return true;
	let aValidType = isDate(a);
	let bValidType = isDate(b);
	if (aValidType || bValidType) return aValidType && bValidType ? a.getTime() === b.getTime() : false;
	aValidType = isSymbol$1(a);
	bValidType = isSymbol$1(b);
	if (aValidType || bValidType) return a === b;
	aValidType = isArray$1(a);
	bValidType = isArray$1(b);
	if (aValidType || bValidType) return aValidType && bValidType ? looseCompareArrays(a, b) : false;
	aValidType = isObject$2(a);
	bValidType = isObject$2(b);
	if (aValidType || bValidType) {
		if (!aValidType || !bValidType) return false;
		if (Object.keys(a).length !== Object.keys(b).length) return false;
		for (const key in a) {
			const aHasKey = a.hasOwnProperty(key);
			const bHasKey = b.hasOwnProperty(key);
			if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) return false;
		}
	}
	return String(a) === String(b);
}
function looseIndexOf(arr, val) {
	return arr.findIndex((item) => looseEqual(item, val));
}
var isRef$1 = (val) => {
	return !!(val && val["__v_isRef"] === true);
};
var toDisplayString = (val) => {
	return isString(val) ? val : val == null ? "" : isArray$1(val) || isObject$2(val) && (val.toString === objectToString$1 || !isFunction$1(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
};
var replacer = (_key, val) => {
	if (isRef$1(val)) return replacer(_key, val.value);
	else if (isMap$1(val)) return { [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2], i) => {
		entries[stringifySymbol(key, i) + " =>"] = val2;
		return entries;
	}, {}) };
	else if (isSet$1(val)) return { [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v)) };
	else if (isSymbol$1(val)) return stringifySymbol(val);
	else if (isObject$2(val) && !isArray$1(val) && !isPlainObject$1(val)) return String(val);
	return val;
};
var stringifySymbol = (v, i = "") => {
	var _a;
	return isSymbol$1(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v;
};
//#endregion
//#region node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
/**
* @vue/reactivity v3.5.40
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
var activeEffectScope;
var EffectScope = class {
	constructor(detached = false) {
		this.detached = detached;
		/**
		* @internal
		*/
		this._active = true;
		/**
		* @internal track `on` calls, allow `on` call multiple times
		*/
		this._on = 0;
		/**
		* @internal
		*/
		this.effects = [];
		/**
		* @internal
		*/
		this.cleanups = [];
		this._isPaused = false;
		this._warnOnRun = true;
		this.__v_skip = true;
		if (!detached && activeEffectScope) if (activeEffectScope.active) {
			this.parent = activeEffectScope;
			this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
		} else {
			this._active = false;
			this._warnOnRun = false;
		}
	}
	get active() {
		return this._active;
	}
	pause() {
		if (this._active) {
			this._isPaused = true;
			let i, l;
			if (this.scopes) {
				const scopes = this.scopes.slice();
				for (i = 0, l = scopes.length; i < l; i++) scopes[i].pause();
			}
			for (i = 0, l = this.effects.length; i < l; i++) this.effects[i].pause();
		}
	}
	/**
	* Resumes the effect scope, including all child scopes and effects.
	*/
	resume() {
		if (this._active) {
			if (this._isPaused) {
				this._isPaused = false;
				let i, l;
				if (this.scopes) {
					const scopes = this.scopes.slice();
					for (i = 0, l = scopes.length; i < l; i++) scopes[i].resume();
				}
				const effects = this.effects.slice();
				for (i = 0, l = effects.length; i < l; i++) effects[i].resume();
			}
		}
	}
	run(fn) {
		if (this._active) {
			const currentEffectScope = activeEffectScope;
			try {
				activeEffectScope = this;
				return fn();
			} finally {
				activeEffectScope = currentEffectScope;
			}
		}
	}
	/**
	* This should only be called on non-detached scopes
	* @internal
	*/
	on() {
		if (++this._on === 1) {
			this.prevScope = activeEffectScope;
			activeEffectScope = this;
		}
	}
	/**
	* This should only be called on non-detached scopes
	* @internal
	*/
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (activeEffectScope === this) activeEffectScope = this.prevScope;
			else {
				let current = activeEffectScope;
				while (current) {
					if (current.prevScope === this) {
						current.prevScope = this.prevScope;
						break;
					}
					current = current.prevScope;
				}
			}
			this.prevScope = void 0;
		}
	}
	stop(fromParent) {
		if (this._active) {
			this._active = false;
			let i, l;
			for (i = 0, l = this.effects.length; i < l; i++) this.effects[i].stop();
			this.effects.length = 0;
			for (i = 0, l = this.cleanups.length; i < l; i++) this.cleanups[i]();
			this.cleanups.length = 0;
			if (this.scopes) {
				const scopes = this.scopes.slice();
				for (i = 0, l = scopes.length; i < l; i++) scopes[i].stop(true);
				this.scopes.length = 0;
			}
			if (!this.detached && this.parent && !fromParent) {
				const last = this.parent.scopes.pop();
				if (last && last !== this) {
					this.parent.scopes[this.index] = last;
					last.index = this.index;
				}
			}
			this.parent = void 0;
		}
	}
};
function effectScope(detached) {
	return new EffectScope(detached);
}
function getCurrentScope() {
	return activeEffectScope;
}
function onScopeDispose(fn, failSilently = false) {
	if (activeEffectScope) activeEffectScope.cleanups.push(fn);
}
var activeSub;
var pausedQueueEffects = /* @__PURE__ */ new WeakSet();
var ReactiveEffect = class {
	constructor(fn) {
		this.fn = fn;
		/**
		* @internal
		*/
		this.deps = void 0;
		/**
		* @internal
		*/
		this.depsTail = void 0;
		/**
		* @internal
		*/
		this.flags = 5;
		/**
		* @internal
		*/
		this.next = void 0;
		/**
		* @internal
		*/
		this.cleanup = void 0;
		this.scheduler = void 0;
		if (activeEffectScope) if (activeEffectScope.active) activeEffectScope.effects.push(this);
		else this.flags &= -2;
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		if (this.flags & 64) {
			this.flags &= -65;
			if (pausedQueueEffects.has(this)) {
				pausedQueueEffects.delete(this);
				this.trigger();
			}
		}
	}
	/**
	* @internal
	*/
	notify() {
		if (this.flags & 2 && !(this.flags & 32)) return;
		if (!(this.flags & 8)) batch(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2;
		cleanupEffect(this);
		prepareDeps(this);
		const prevEffect = activeSub;
		const prevShouldTrack = shouldTrack;
		activeSub = this;
		shouldTrack = true;
		try {
			return this.fn();
		} finally {
			cleanupDeps(this);
			activeSub = prevEffect;
			shouldTrack = prevShouldTrack;
			this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let link = this.deps; link; link = link.nextDep) removeSub(link);
			this.deps = this.depsTail = void 0;
			cleanupEffect(this);
			this.onStop && this.onStop();
			this.flags &= -2;
		}
	}
	trigger() {
		if (this.flags & 64) pausedQueueEffects.add(this);
		else if (this.scheduler) this.scheduler();
		else this.runIfDirty();
	}
	/**
	* @internal
	*/
	runIfDirty() {
		if (isDirty(this)) this.run();
	}
	get dirty() {
		return isDirty(this);
	}
};
var batchDepth = 0;
var batchedSub;
var batchedComputed;
function batch(sub, isComputed = false) {
	sub.flags |= 8;
	if (isComputed) {
		sub.next = batchedComputed;
		batchedComputed = sub;
		return;
	}
	sub.next = batchedSub;
	batchedSub = sub;
}
function startBatch() {
	batchDepth++;
}
function endBatch() {
	if (--batchDepth > 0) return;
	if (batchedComputed) {
		let e = batchedComputed;
		batchedComputed = void 0;
		while (e) {
			const next = e.next;
			e.next = void 0;
			e.flags &= -9;
			e = next;
		}
	}
	let error;
	while (batchedSub) {
		let e = batchedSub;
		batchedSub = void 0;
		while (e) {
			const next = e.next;
			e.next = void 0;
			e.flags &= -9;
			if (e.flags & 1) try {
				e.trigger();
			} catch (err) {
				if (!error) error = err;
			}
			e = next;
		}
	}
	if (error) throw error;
}
function prepareDeps(sub) {
	for (let link = sub.deps; link; link = link.nextDep) {
		link.version = -1;
		link.prevActiveLink = link.dep.activeLink;
		link.dep.activeLink = link;
	}
}
function cleanupDeps(sub) {
	let head;
	let tail = sub.depsTail;
	let link = tail;
	while (link) {
		const prev = link.prevDep;
		if (link.version === -1) {
			if (link === tail) tail = prev;
			removeSub(link);
			removeDep(link);
		} else head = link;
		link.dep.activeLink = link.prevActiveLink;
		link.prevActiveLink = void 0;
		link = prev;
	}
	sub.deps = head;
	sub.depsTail = tail;
}
function isDirty(sub) {
	for (let link = sub.deps; link; link = link.nextDep) if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) return true;
	if (sub._dirty) return true;
	return false;
}
function refreshComputed(computed) {
	if (computed.flags & 4 && !(computed.flags & 16)) return;
	computed.flags &= -17;
	if (computed.globalVersion === globalVersion) return;
	computed.globalVersion = globalVersion;
	if (!computed.isSSR && computed.flags & 128 && (!computed.deps && !computed._dirty || !isDirty(computed))) return;
	computed.flags |= 2;
	const dep = computed.dep;
	const prevSub = activeSub;
	const prevShouldTrack = shouldTrack;
	activeSub = computed;
	shouldTrack = true;
	try {
		prepareDeps(computed);
		const value = computed.fn(computed._value);
		if (dep.version === 0 || hasChanged(value, computed._value)) {
			computed.flags |= 128;
			computed._value = value;
			dep.version++;
		}
	} catch (err) {
		dep.version++;
		throw err;
	} finally {
		activeSub = prevSub;
		shouldTrack = prevShouldTrack;
		cleanupDeps(computed);
		computed.flags &= -3;
	}
}
function removeSub(link, soft = false) {
	const { dep, prevSub, nextSub } = link;
	if (prevSub) {
		prevSub.nextSub = nextSub;
		link.prevSub = void 0;
	}
	if (nextSub) {
		nextSub.prevSub = prevSub;
		link.nextSub = void 0;
	}
	if (dep.subs === link) {
		dep.subs = prevSub;
		if (!prevSub && dep.computed) {
			dep.computed.flags &= -5;
			for (let l = dep.computed.deps; l; l = l.nextDep) removeSub(l, true);
		}
	}
	if (!soft && !--dep.sc && dep.map) dep.map.delete(dep.key);
}
function removeDep(link) {
	const { prevDep, nextDep } = link;
	if (prevDep) {
		prevDep.nextDep = nextDep;
		link.prevDep = void 0;
	}
	if (nextDep) {
		nextDep.prevDep = prevDep;
		link.nextDep = void 0;
	}
}
var shouldTrack = true;
var trackStack = [];
function pauseTracking() {
	trackStack.push(shouldTrack);
	shouldTrack = false;
}
function resetTracking() {
	const last = trackStack.pop();
	shouldTrack = last === void 0 ? true : last;
}
function cleanupEffect(e) {
	const { cleanup } = e;
	e.cleanup = void 0;
	if (cleanup) {
		const prevSub = activeSub;
		activeSub = void 0;
		try {
			cleanup();
		} finally {
			activeSub = prevSub;
		}
	}
}
var globalVersion = 0;
var Link = class {
	constructor(sub, dep) {
		this.sub = sub;
		this.dep = dep;
		this.version = dep.version;
		this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
};
var Dep = class {
	constructor(computed) {
		this.computed = computed;
		this.version = 0;
		/**
		* Link between this dep and the current active effect
		*/
		this.activeLink = void 0;
		/**
		* Doubly linked list representing the subscribing effects (tail)
		*/
		this.subs = void 0;
		/**
		* For object property deps cleanup
		*/
		this.map = void 0;
		this.key = void 0;
		/**
		* Subscriber counter
		*/
		this.sc = 0;
		/**
		* @internal
		*/
		this.__v_skip = true;
	}
	track(debugInfo) {
		if (!activeSub || !shouldTrack || activeSub === this.computed) return;
		let link = this.activeLink;
		if (link === void 0 || link.sub !== activeSub) {
			link = this.activeLink = new Link(activeSub, this);
			if (!activeSub.deps) activeSub.deps = activeSub.depsTail = link;
			else {
				link.prevDep = activeSub.depsTail;
				activeSub.depsTail.nextDep = link;
				activeSub.depsTail = link;
			}
			addSub(link);
		} else if (link.version === -1) {
			link.version = this.version;
			if (link.nextDep) {
				const next = link.nextDep;
				next.prevDep = link.prevDep;
				if (link.prevDep) link.prevDep.nextDep = next;
				link.prevDep = activeSub.depsTail;
				link.nextDep = void 0;
				activeSub.depsTail.nextDep = link;
				activeSub.depsTail = link;
				if (activeSub.deps === link) activeSub.deps = next;
			}
		}
		return link;
	}
	trigger(debugInfo) {
		this.version++;
		globalVersion++;
		this.notify(debugInfo);
	}
	notify(debugInfo) {
		startBatch();
		try {
			for (let link = this.subs; link; link = link.prevSub) if (link.sub.notify()) link.sub.dep.notify();
		} finally {
			endBatch();
		}
	}
};
function addSub(link) {
	link.dep.sc++;
	if (link.sub.flags & 4) {
		const computed = link.dep.computed;
		if (computed && !link.dep.subs) {
			computed.flags |= 20;
			for (let l = computed.deps; l; l = l.nextDep) addSub(l);
		}
		const currentTail = link.dep.subs;
		if (currentTail !== link) {
			link.prevSub = currentTail;
			if (currentTail) currentTail.nextSub = link;
		}
		link.dep.subs = link;
	}
}
var targetMap = /* @__PURE__ */ new WeakMap();
var ITERATE_KEY = /* @__PURE__ */ Symbol("");
var MAP_KEY_ITERATE_KEY = /* @__PURE__ */ Symbol("");
var ARRAY_ITERATE_KEY = /* @__PURE__ */ Symbol("");
function track(target, type, key) {
	if (shouldTrack && activeSub) {
		let depsMap = targetMap.get(target);
		if (!depsMap) targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
		let dep = depsMap.get(key);
		if (!dep) {
			depsMap.set(key, dep = new Dep());
			dep.map = depsMap;
			dep.key = key;
		}
		dep.track();
	}
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
	const depsMap = targetMap.get(target);
	if (!depsMap) {
		globalVersion++;
		return;
	}
	const run = (dep) => {
		if (dep) dep.trigger();
	};
	startBatch();
	if (type === "clear") depsMap.forEach(run);
	else {
		const targetIsArray = isArray$1(target);
		const isArrayIndex = targetIsArray && isIntegerKey(key);
		if (targetIsArray && key === "length") {
			const newLength = Number(newValue);
			depsMap.forEach((dep, key2) => {
				if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol$1(key2) && key2 >= newLength) run(dep);
			});
		} else {
			if (key !== void 0 || depsMap.has(void 0)) run(depsMap.get(key));
			if (isArrayIndex) run(depsMap.get(ARRAY_ITERATE_KEY));
			switch (type) {
				case "add":
					if (!targetIsArray) {
						run(depsMap.get(ITERATE_KEY));
						if (isMap$1(target)) run(depsMap.get(MAP_KEY_ITERATE_KEY));
					} else if (isArrayIndex) run(depsMap.get("length"));
					break;
				case "delete":
					if (!targetIsArray) {
						run(depsMap.get(ITERATE_KEY));
						if (isMap$1(target)) run(depsMap.get(MAP_KEY_ITERATE_KEY));
					}
					break;
				case "set":
					if (isMap$1(target)) run(depsMap.get(ITERATE_KEY));
					break;
			}
		}
	}
	endBatch();
}
function getDepFromReactive(object, key) {
	const depMap = targetMap.get(object);
	return depMap && depMap.get(key);
}
function reactiveReadArray(array) {
	const raw = /* @__PURE__ */ toRaw(array);
	if (raw === array) return raw;
	track(raw, "iterate", ARRAY_ITERATE_KEY);
	return /* @__PURE__ */ isShallow(array) ? raw : raw.map(toReactive$1);
}
function shallowReadArray(arr) {
	track(arr = /* @__PURE__ */ toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
	return arr;
}
function toWrapped(target, item) {
	if (/* @__PURE__ */ isReadonly(target)) return /* @__PURE__ */ isReactive(target) ? toReadonly(toReactive$1(item)) : toReadonly(item);
	return toReactive$1(item);
}
var arrayInstrumentations = {
	__proto__: null,
	[Symbol.iterator]() {
		return iterator(this, Symbol.iterator, (item) => toWrapped(this, item));
	},
	concat(...args) {
		return reactiveReadArray(this).concat(...args.map((x) => isArray$1(x) ? reactiveReadArray(x) : x));
	},
	entries() {
		return iterator(this, "entries", (value) => {
			value[1] = toWrapped(this, value[1]);
			return value;
		});
	},
	every(fn, thisArg) {
		return apply$1(this, "every", fn, thisArg, void 0, arguments);
	},
	filter(fn, thisArg) {
		return apply$1(this, "filter", fn, thisArg, (v) => v.map((item) => toWrapped(this, item)), arguments);
	},
	find(fn, thisArg) {
		return apply$1(this, "find", fn, thisArg, (item) => toWrapped(this, item), arguments);
	},
	findIndex(fn, thisArg) {
		return apply$1(this, "findIndex", fn, thisArg, void 0, arguments);
	},
	findLast(fn, thisArg) {
		return apply$1(this, "findLast", fn, thisArg, (item) => toWrapped(this, item), arguments);
	},
	findLastIndex(fn, thisArg) {
		return apply$1(this, "findLastIndex", fn, thisArg, void 0, arguments);
	},
	forEach(fn, thisArg) {
		return apply$1(this, "forEach", fn, thisArg, void 0, arguments);
	},
	includes(...args) {
		return searchProxy(this, "includes", args);
	},
	indexOf(...args) {
		return searchProxy(this, "indexOf", args);
	},
	join(separator) {
		return reactiveReadArray(this).join(separator);
	},
	lastIndexOf(...args) {
		return searchProxy(this, "lastIndexOf", args);
	},
	map(fn, thisArg) {
		return apply$1(this, "map", fn, thisArg, void 0, arguments);
	},
	pop() {
		return noTracking(this, "pop");
	},
	push(...args) {
		return noTracking(this, "push", args);
	},
	reduce(fn, ...args) {
		return reduce(this, "reduce", fn, args);
	},
	reduceRight(fn, ...args) {
		return reduce(this, "reduceRight", fn, args);
	},
	shift() {
		return noTracking(this, "shift");
	},
	some(fn, thisArg) {
		return apply$1(this, "some", fn, thisArg, void 0, arguments);
	},
	splice(...args) {
		return noTracking(this, "splice", args);
	},
	toReversed() {
		return reactiveReadArray(this).toReversed();
	},
	toSorted(comparer) {
		return reactiveReadArray(this).toSorted(comparer);
	},
	toSpliced(...args) {
		return reactiveReadArray(this).toSpliced(...args);
	},
	unshift(...args) {
		return noTracking(this, "unshift", args);
	},
	values() {
		return iterator(this, "values", (item) => toWrapped(this, item));
	}
};
function iterator(self, method, wrapValue) {
	const arr = shallowReadArray(self);
	const iter = arr[method]();
	if (arr !== self && !/* @__PURE__ */ isShallow(self)) {
		iter._next = iter.next;
		iter.next = () => {
			const result = iter._next();
			if (!result.done) result.value = wrapValue(result.value);
			return result;
		};
	}
	return iter;
}
var arrayProto = Array.prototype;
function apply$1(self, method, fn, thisArg, wrappedRetFn, args) {
	const arr = shallowReadArray(self);
	const needsWrap = arr !== self && !/* @__PURE__ */ isShallow(self);
	const methodFn = arr[method];
	if (methodFn !== arrayProto[method]) {
		const result2 = methodFn.apply(self, args);
		return needsWrap ? toReactive$1(result2) : result2;
	}
	let wrappedFn = fn;
	if (arr !== self) {
		if (needsWrap) wrappedFn = function(item, index) {
			return fn.call(this, toWrapped(self, item), index, self);
		};
		else if (fn.length > 2) wrappedFn = function(item, index) {
			return fn.call(this, item, index, self);
		};
	}
	const result = methodFn.call(arr, wrappedFn, thisArg);
	return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
}
function reduce(self, method, fn, args) {
	const arr = shallowReadArray(self);
	const needsWrap = arr !== self && !/* @__PURE__ */ isShallow(self);
	let wrappedFn = fn;
	let wrapInitialAccumulator = false;
	if (arr !== self) {
		if (needsWrap) {
			wrapInitialAccumulator = args.length === 0;
			wrappedFn = function(acc, item, index) {
				if (wrapInitialAccumulator) {
					wrapInitialAccumulator = false;
					acc = toWrapped(self, acc);
				}
				return fn.call(this, acc, toWrapped(self, item), index, self);
			};
		} else if (fn.length > 3) wrappedFn = function(acc, item, index) {
			return fn.call(this, acc, item, index, self);
		};
	}
	const result = arr[method](wrappedFn, ...args);
	return wrapInitialAccumulator ? toWrapped(self, result) : result;
}
function searchProxy(self, method, args) {
	const arr = /* @__PURE__ */ toRaw(self);
	track(arr, "iterate", ARRAY_ITERATE_KEY);
	const res = arr[method](...args);
	if ((res === -1 || res === false) && /* @__PURE__ */ isProxy(args[0])) {
		args[0] = /* @__PURE__ */ toRaw(args[0]);
		return arr[method](...args);
	}
	return res;
}
function noTracking(self, method, args = []) {
	pauseTracking();
	startBatch();
	const res = (/* @__PURE__ */ toRaw(self))[method].apply(self, args);
	endBatch();
	resetTracking();
	return res;
}
var isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
var builtInSymbols = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol$1));
function hasOwnProperty$14(key) {
	if (!isSymbol$1(key)) key = String(key);
	const obj = /* @__PURE__ */ toRaw(this);
	track(obj, "has", key);
	return obj.hasOwnProperty(key);
}
var BaseReactiveHandler = class {
	constructor(_isReadonly = false, _isShallow = false) {
		this._isReadonly = _isReadonly;
		this._isShallow = _isShallow;
	}
	get(target, key, receiver) {
		if (key === "__v_skip") return target["__v_skip"];
		const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
		if (key === "__v_isReactive") return !isReadonly2;
		else if (key === "__v_isReadonly") return isReadonly2;
		else if (key === "__v_isShallow") return isShallow2;
		else if (key === "__v_raw") {
			if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) return target;
			return;
		}
		const targetIsArray = isArray$1(target);
		if (!isReadonly2) {
			let fn;
			if (targetIsArray && (fn = arrayInstrumentations[key])) return fn;
			if (key === "hasOwnProperty") return hasOwnProperty$14;
		}
		const res = Reflect.get(target, key, /* @__PURE__ */ isRef(target) ? target : receiver);
		if (isSymbol$1(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) return res;
		if (!isReadonly2) track(target, "get", key);
		if (isShallow2) return res;
		if (/* @__PURE__ */ isRef(res)) {
			const value = targetIsArray && isIntegerKey(key) ? res : res.value;
			return isReadonly2 && isObject$2(value) ? /* @__PURE__ */ readonly(value) : value;
		}
		if (isObject$2(res)) return isReadonly2 ? /* @__PURE__ */ readonly(res) : /* @__PURE__ */ reactive(res);
		return res;
	}
};
var MutableReactiveHandler = class extends BaseReactiveHandler {
	constructor(isShallow2 = false) {
		super(false, isShallow2);
	}
	set(target, key, value, receiver) {
		let oldValue = target[key];
		const isArrayWithIntegerKey = isArray$1(target) && isIntegerKey(key);
		if (!this._isShallow) {
			const isOldValueReadonly = /* @__PURE__ */ isReadonly(oldValue);
			if (!/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) {
				oldValue = /* @__PURE__ */ toRaw(oldValue);
				value = /* @__PURE__ */ toRaw(value);
			}
			if (!isArrayWithIntegerKey && /* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) if (isOldValueReadonly) return true;
			else {
				oldValue.value = value;
				return true;
			}
		}
		const hadKey = isArrayWithIntegerKey ? Number(key) < target.length : hasOwn(target, key);
		const result = Reflect.set(target, key, value, /* @__PURE__ */ isRef(target) ? target : receiver);
		if (target === /* @__PURE__ */ toRaw(receiver) && result) {
			if (!hadKey) trigger(target, "add", key, value);
			else if (hasChanged(value, oldValue)) trigger(target, "set", key, value, oldValue);
		}
		return result;
	}
	deleteProperty(target, key) {
		const hadKey = hasOwn(target, key);
		const oldValue = target[key];
		const result = Reflect.deleteProperty(target, key);
		if (result && hadKey) trigger(target, "delete", key, void 0, oldValue);
		return result;
	}
	has(target, key) {
		const result = Reflect.has(target, key);
		if (!isSymbol$1(key) || !builtInSymbols.has(key)) track(target, "has", key);
		return result;
	}
	ownKeys(target) {
		track(target, "iterate", isArray$1(target) ? "length" : ITERATE_KEY);
		return Reflect.ownKeys(target);
	}
};
var ReadonlyReactiveHandler = class extends BaseReactiveHandler {
	constructor(isShallow2 = false) {
		super(true, isShallow2);
	}
	set(target, key) {
		return true;
	}
	deleteProperty(target, key) {
		return true;
	}
};
var mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
var readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
var shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
var shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
var toShallow = (value) => value;
var getProto = (v) => Reflect.getPrototypeOf(v);
function createIterableMethod(method, isReadonly2, isShallow2) {
	return function(...args) {
		const target = this["__v_raw"];
		const rawTarget = /* @__PURE__ */ toRaw(target);
		const targetIsMap = isMap$1(rawTarget);
		const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
		const isKeyOnly = method === "keys" && targetIsMap;
		const innerIterator = target[method](...args);
		const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive$1;
		!isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
		return extend(Object.create(innerIterator), { next() {
			const { value, done } = innerIterator.next();
			return done ? {
				value,
				done
			} : {
				value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
				done
			};
		} });
	};
}
function createReadonlyMethod(type) {
	return function(...args) {
		return type === "delete" ? false : type === "clear" ? void 0 : this;
	};
}
function createInstrumentations(readonly, shallow) {
	const instrumentations = {
		get(key) {
			const target = this["__v_raw"];
			const rawTarget = /* @__PURE__ */ toRaw(target);
			const rawKey = /* @__PURE__ */ toRaw(key);
			if (!readonly) {
				if (hasChanged(key, rawKey)) track(rawTarget, "get", key);
				track(rawTarget, "get", rawKey);
			}
			const { has } = getProto(rawTarget);
			const wrap = shallow ? toShallow : readonly ? toReadonly : toReactive$1;
			if (has.call(rawTarget, key)) return wrap(target.get(key));
			else if (has.call(rawTarget, rawKey)) return wrap(target.get(rawKey));
			else if (target !== rawTarget) target.get(key);
		},
		get size() {
			const target = this["__v_raw"];
			!readonly && track(/* @__PURE__ */ toRaw(target), "iterate", ITERATE_KEY);
			return target.size;
		},
		has(key) {
			const target = this["__v_raw"];
			const rawTarget = /* @__PURE__ */ toRaw(target);
			const rawKey = /* @__PURE__ */ toRaw(key);
			if (!readonly) {
				if (hasChanged(key, rawKey)) track(rawTarget, "has", key);
				track(rawTarget, "has", rawKey);
			}
			return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
		},
		forEach(callback, thisArg) {
			const observed = this;
			const target = observed["__v_raw"];
			const rawTarget = /* @__PURE__ */ toRaw(target);
			const wrap = shallow ? toShallow : readonly ? toReadonly : toReactive$1;
			!readonly && track(rawTarget, "iterate", ITERATE_KEY);
			return target.forEach((value, key) => {
				return callback.call(thisArg, wrap(value), wrap(key), observed);
			});
		}
	};
	extend(instrumentations, readonly ? {
		add: createReadonlyMethod("add"),
		set: createReadonlyMethod("set"),
		delete: createReadonlyMethod("delete"),
		clear: createReadonlyMethod("clear")
	} : {
		add(value) {
			const target = /* @__PURE__ */ toRaw(this);
			const proto = getProto(target);
			const rawValue = /* @__PURE__ */ toRaw(value);
			const valueToAdd = !shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value) ? rawValue : value;
			if (!(proto.has.call(target, valueToAdd) || hasChanged(value, valueToAdd) && proto.has.call(target, value) || hasChanged(rawValue, valueToAdd) && proto.has.call(target, rawValue))) {
				target.add(valueToAdd);
				trigger(target, "add", valueToAdd, valueToAdd);
			}
			return this;
		},
		set(key, value) {
			if (!shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) value = /* @__PURE__ */ toRaw(value);
			const target = /* @__PURE__ */ toRaw(this);
			const { has, get } = getProto(target);
			let hadKey = has.call(target, key);
			if (!hadKey) {
				key = /* @__PURE__ */ toRaw(key);
				hadKey = has.call(target, key);
			}
			const oldValue = get.call(target, key);
			target.set(key, value);
			if (!hadKey) trigger(target, "add", key, value);
			else if (hasChanged(value, oldValue)) trigger(target, "set", key, value, oldValue);
			return this;
		},
		delete(key) {
			const target = /* @__PURE__ */ toRaw(this);
			const { has, get } = getProto(target);
			let hadKey = has.call(target, key);
			if (!hadKey) {
				key = /* @__PURE__ */ toRaw(key);
				hadKey = has.call(target, key);
			}
			const oldValue = get ? get.call(target, key) : void 0;
			const result = target.delete(key);
			if (hadKey) trigger(target, "delete", key, void 0, oldValue);
			return result;
		},
		clear() {
			const target = /* @__PURE__ */ toRaw(this);
			const hadItems = target.size !== 0;
			const oldTarget = void 0;
			const result = target.clear();
			if (hadItems) trigger(target, "clear", void 0, void 0, oldTarget);
			return result;
		}
	});
	[
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((method) => {
		instrumentations[method] = createIterableMethod(method, readonly, shallow);
	});
	return instrumentations;
}
function createInstrumentationGetter(isReadonly2, shallow) {
	const instrumentations = createInstrumentations(isReadonly2, shallow);
	return (target, key, receiver) => {
		if (key === "__v_isReactive") return !isReadonly2;
		else if (key === "__v_isReadonly") return isReadonly2;
		else if (key === "__v_raw") return target;
		return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
	};
}
var mutableCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(false, false) };
var shallowCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(false, true) };
var readonlyCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(true, false) };
var shallowReadonlyCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(true, true) };
var reactiveMap = /* @__PURE__ */ new WeakMap();
var shallowReactiveMap = /* @__PURE__ */ new WeakMap();
var readonlyMap = /* @__PURE__ */ new WeakMap();
var shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
	switch (rawType) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
// @__NO_SIDE_EFFECTS__
function reactive(target) {
	if (/* @__PURE__ */ isReadonly(target)) return target;
	return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
// @__NO_SIDE_EFFECTS__
function shallowReactive(target) {
	return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
}
// @__NO_SIDE_EFFECTS__
function readonly(target) {
	return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
// @__NO_SIDE_EFFECTS__
function shallowReadonly(target) {
	return createReactiveObject(target, true, shallowReadonlyHandlers, shallowReadonlyCollectionHandlers, shallowReadonlyMap);
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
	if (!isObject$2(target)) return target;
	if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) return target;
	if (target["__v_skip"] || !Object.isExtensible(target)) return target;
	const existingProxy = proxyMap.get(target);
	if (existingProxy) return existingProxy;
	const targetType = targetTypeMap(toRawType(target));
	if (targetType === 0) return target;
	const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
	proxyMap.set(target, proxy);
	return proxy;
}
// @__NO_SIDE_EFFECTS__
function isReactive(value) {
	if (/* @__PURE__ */ isReadonly(value)) return /* @__PURE__ */ isReactive(value["__v_raw"]);
	return !!(value && value["__v_isReactive"]);
}
// @__NO_SIDE_EFFECTS__
function isReadonly(value) {
	return !!(value && value["__v_isReadonly"]);
}
// @__NO_SIDE_EFFECTS__
function isShallow(value) {
	return !!(value && value["__v_isShallow"]);
}
// @__NO_SIDE_EFFECTS__
function isProxy(value) {
	return value ? !!value["__v_raw"] : false;
}
// @__NO_SIDE_EFFECTS__
function toRaw(observed) {
	const raw = observed && observed["__v_raw"];
	return raw ? /* @__PURE__ */ toRaw(raw) : observed;
}
function markRaw(value) {
	if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) def(value, "__v_skip", true);
	return value;
}
var toReactive$1 = (value) => isObject$2(value) ? /* @__PURE__ */ reactive(value) : value;
var toReadonly = (value) => isObject$2(value) ? /* @__PURE__ */ readonly(value) : value;
// @__NO_SIDE_EFFECTS__
function isRef(r) {
	return r ? r["__v_isRef"] === true : false;
}
// @__NO_SIDE_EFFECTS__
function ref(value) {
	return createRef(value, false);
}
// @__NO_SIDE_EFFECTS__
function shallowRef(value) {
	return createRef(value, true);
}
function createRef(rawValue, shallow) {
	if (/* @__PURE__ */ isRef(rawValue)) return rawValue;
	return new RefImpl(rawValue, shallow);
}
var RefImpl = class {
	constructor(value, isShallow2) {
		this.dep = new Dep();
		this["__v_isRef"] = true;
		this["__v_isShallow"] = false;
		this._rawValue = isShallow2 ? value : /* @__PURE__ */ toRaw(value);
		this._value = isShallow2 ? value : toReactive$1(value);
		this["__v_isShallow"] = isShallow2;
	}
	get value() {
		this.dep.track();
		return this._value;
	}
	set value(newValue) {
		const oldValue = this._rawValue;
		const useDirectValue = this["__v_isShallow"] || /* @__PURE__ */ isShallow(newValue) || /* @__PURE__ */ isReadonly(newValue);
		newValue = useDirectValue ? newValue : /* @__PURE__ */ toRaw(newValue);
		if (hasChanged(newValue, oldValue)) {
			this._rawValue = newValue;
			this._value = useDirectValue ? newValue : toReactive$1(newValue);
			this.dep.trigger();
		}
	}
};
function triggerRef(ref2) {
	if (ref2.dep) ref2.dep.trigger();
}
function unref(ref2) {
	return /* @__PURE__ */ isRef(ref2) ? ref2.value : ref2;
}
function toValue(source) {
	return isFunction$1(source) ? source() : unref(source);
}
var shallowUnwrapHandlers = {
	get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
	set: (target, key, value, receiver) => {
		const oldValue = target[key];
		if (/* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) {
			oldValue.value = value;
			return true;
		} else return Reflect.set(target, key, value, receiver);
	}
};
function proxyRefs(objectWithRefs) {
	return /* @__PURE__ */ isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
// @__NO_SIDE_EFFECTS__
function toRefs(object) {
	const ret = isArray$1(object) ? new Array(object.length) : {};
	for (const key in object) ret[key] = propertyToRef(object, key);
	return ret;
}
var ObjectRefImpl = class {
	constructor(_object, key, _defaultValue) {
		this._object = _object;
		this._defaultValue = _defaultValue;
		this["__v_isRef"] = true;
		this._value = void 0;
		this._key = isSymbol$1(key) ? key : String(key);
		this._raw = /* @__PURE__ */ toRaw(_object);
		let shallow = true;
		let obj = _object;
		if (!isArray$1(_object) || isSymbol$1(this._key) || !isIntegerKey(this._key)) do
			shallow = !/* @__PURE__ */ isProxy(obj) || /* @__PURE__ */ isShallow(obj);
		while (shallow && (obj = obj["__v_raw"]));
		this._shallow = shallow;
	}
	get value() {
		let val = this._object[this._key];
		if (this._shallow) val = unref(val);
		return this._value = val === void 0 ? this._defaultValue : val;
	}
	set value(newVal) {
		if (this._shallow && /* @__PURE__ */ isRef(this._raw[this._key])) {
			const nestedRef = this._object[this._key];
			if (/* @__PURE__ */ isRef(nestedRef)) {
				nestedRef.value = newVal;
				return;
			}
		}
		this._object[this._key] = newVal;
	}
	get dep() {
		return getDepFromReactive(this._raw, this._key);
	}
};
var GetterRefImpl = class {
	constructor(_getter) {
		this._getter = _getter;
		this["__v_isRef"] = true;
		this["__v_isReadonly"] = true;
		this._value = void 0;
	}
	get value() {
		return this._value = this._getter();
	}
};
// @__NO_SIDE_EFFECTS__
function toRef(source, key, defaultValue) {
	if (/* @__PURE__ */ isRef(source)) return source;
	else if (isFunction$1(source)) return new GetterRefImpl(source);
	else if (isObject$2(source) && arguments.length > 1) return propertyToRef(source, key, defaultValue);
	else return /* @__PURE__ */ ref(source);
}
function propertyToRef(source, key, defaultValue) {
	return new ObjectRefImpl(source, key, defaultValue);
}
var ComputedRefImpl = class {
	constructor(fn, setter, isSSR) {
		this.fn = fn;
		this.setter = setter;
		/**
		* @internal
		*/
		this._value = void 0;
		/**
		* @internal
		*/
		this.dep = new Dep(this);
		/**
		* @internal
		*/
		this.__v_isRef = true;
		/**
		* @internal
		*/
		this.deps = void 0;
		/**
		* @internal
		*/
		this.depsTail = void 0;
		/**
		* @internal
		*/
		this.flags = 16;
		/**
		* @internal
		*/
		this.globalVersion = globalVersion - 1;
		/**
		* @internal
		*/
		this.next = void 0;
		this.effect = this;
		this["__v_isReadonly"] = !setter;
		this.isSSR = isSSR;
	}
	/**
	* @internal
	*/
	notify() {
		this.flags |= 16;
		if (!(this.flags & 8) && activeSub !== this) {
			batch(this, true);
			return true;
		}
	}
	get value() {
		const link = this.dep.track();
		refreshComputed(this);
		if (link) link.version = this.dep.version;
		return this._value;
	}
	set value(newValue) {
		if (this.setter) this.setter(newValue);
	}
};
// @__NO_SIDE_EFFECTS__
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
	let getter;
	let setter;
	if (isFunction$1(getterOrOptions)) getter = getterOrOptions;
	else {
		getter = getterOrOptions.get;
		setter = getterOrOptions.set;
	}
	return new ComputedRefImpl(getter, setter, isSSR);
}
var INITIAL_WATCHER_VALUE = {};
var cleanupMap = /* @__PURE__ */ new WeakMap();
var activeWatcher = void 0;
function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
	if (owner) {
		let cleanups = cleanupMap.get(owner);
		if (!cleanups) cleanupMap.set(owner, cleanups = []);
		cleanups.push(cleanupFn);
	}
}
function watch$1(source, cb, options = EMPTY_OBJ) {
	const { immediate, deep, once, scheduler, augmentJob, call } = options;
	const reactiveGetter = (source2) => {
		if (deep) return source2;
		if (/* @__PURE__ */ isShallow(source2) || deep === false || deep === 0) return traverse(source2, 1);
		return traverse(source2);
	};
	let effect;
	let getter;
	let cleanup;
	let boundCleanup;
	let forceTrigger = false;
	let isMultiSource = false;
	if (/* @__PURE__ */ isRef(source)) {
		getter = () => source.value;
		forceTrigger = /* @__PURE__ */ isShallow(source);
	} else if (/* @__PURE__ */ isReactive(source)) {
		getter = () => reactiveGetter(source);
		forceTrigger = true;
	} else if (isArray$1(source)) {
		isMultiSource = true;
		forceTrigger = source.some((s) => /* @__PURE__ */ isReactive(s) || /* @__PURE__ */ isShallow(s));
		getter = () => source.map((s) => {
			if (/* @__PURE__ */ isRef(s)) return s.value;
			else if (/* @__PURE__ */ isReactive(s)) return reactiveGetter(s);
			else if (isFunction$1(s)) return call ? call(s, 2) : s();
		});
	} else if (isFunction$1(source)) if (cb) getter = call ? () => call(source, 2) : source;
	else getter = () => {
		if (cleanup) {
			pauseTracking();
			try {
				cleanup();
			} finally {
				resetTracking();
			}
		}
		const currentEffect = activeWatcher;
		activeWatcher = effect;
		try {
			return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
		} finally {
			activeWatcher = currentEffect;
		}
	};
	else getter = NOOP;
	if (cb && deep) {
		const baseGetter = getter;
		const depth = deep === true ? Infinity : deep;
		getter = () => traverse(baseGetter(), depth);
	}
	const scope = getCurrentScope();
	const watchHandle = () => {
		effect.stop();
		if (scope && scope.active) remove(scope.effects, effect);
	};
	if (once && cb) {
		const _cb = cb;
		cb = (...args) => {
			const res = _cb(...args);
			watchHandle();
			return res;
		};
	}
	let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
	const job = (immediateFirstRun) => {
		if (!(effect.flags & 1) || !effect.dirty && !immediateFirstRun) return;
		if (cb) {
			const newValue = effect.run();
			if (immediateFirstRun || deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
				if (cleanup) cleanup();
				const currentWatcher = activeWatcher;
				activeWatcher = effect;
				try {
					const args = [
						newValue,
						oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
						boundCleanup
					];
					oldValue = newValue;
					call ? call(cb, 3, args) : cb(...args);
				} finally {
					activeWatcher = currentWatcher;
				}
			}
		} else effect.run();
	};
	if (augmentJob) augmentJob(job);
	effect = new ReactiveEffect(getter);
	effect.scheduler = scheduler ? () => scheduler(job, false) : job;
	boundCleanup = (fn) => onWatcherCleanup(fn, false, effect);
	cleanup = effect.onStop = () => {
		const cleanups = cleanupMap.get(effect);
		if (cleanups) {
			if (call) call(cleanups, 4);
			else for (const cleanup2 of cleanups) cleanup2();
			cleanupMap.delete(effect);
		}
	};
	if (cb) if (immediate) job(true);
	else oldValue = effect.run();
	else if (scheduler) scheduler(job.bind(null, true), true);
	else effect.run();
	watchHandle.pause = effect.pause.bind(effect);
	watchHandle.resume = effect.resume.bind(effect);
	watchHandle.stop = watchHandle;
	return watchHandle;
}
function traverse(value, depth = Infinity, seen) {
	if (depth <= 0 || !isObject$2(value) || value["__v_skip"]) return value;
	seen = seen || /* @__PURE__ */ new Map();
	if ((seen.get(value) || 0) >= depth) return value;
	seen.set(value, depth);
	depth--;
	if (/* @__PURE__ */ isRef(value)) traverse(value.value, depth, seen);
	else if (isArray$1(value)) for (let i = 0; i < value.length; i++) traverse(value[i], depth, seen);
	else if (isSet$1(value) || isMap$1(value)) value.forEach((v) => {
		traverse(v, depth, seen);
	});
	else if (isPlainObject$1(value)) {
		for (const key in value) traverse(value[key], depth, seen);
		for (const key of Object.getOwnPropertySymbols(value)) if (Object.prototype.propertyIsEnumerable.call(value, key)) traverse(value[key], depth, seen);
	}
	return value;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
/**
* @vue/runtime-core v3.5.40
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function callWithErrorHandling(fn, instance, type, args) {
	try {
		return args ? fn(...args) : fn();
	} catch (err) {
		handleError(err, instance, type);
	}
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
	if (isFunction$1(fn)) {
		const res = callWithErrorHandling(fn, instance, type, args);
		if (res && isPromise(res)) res.catch((err) => {
			handleError(err, instance, type);
		});
		return res;
	}
	if (isArray$1(fn)) {
		const values = [];
		for (let i = 0; i < fn.length; i++) values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
		return values;
	}
}
function handleError(err, instance, type, throwInDev = true) {
	const contextVNode = instance ? instance.vnode : null;
	const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
	if (instance) {
		let cur = instance.parent;
		const exposedInstance = instance.proxy;
		const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
		while (cur) {
			const errorCapturedHooks = cur.ec;
			if (errorCapturedHooks) {
				for (let i = 0; i < errorCapturedHooks.length; i++) if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) return;
			}
			cur = cur.parent;
		}
		if (errorHandler) {
			pauseTracking();
			callWithErrorHandling(errorHandler, null, 10, [
				err,
				exposedInstance,
				errorInfo
			]);
			resetTracking();
			return;
		}
	}
	logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
}
function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
	if (throwInProd) throw err;
	else console.error(err);
}
var queue = [];
var flushIndex = -1;
var pendingPostFlushCbs = [];
var activePostFlushCbs = null;
var postFlushIndex = 0;
var resolvedPromise = /* @__PURE__ */ Promise.resolve();
var currentFlushPromise = null;
function nextTick(fn) {
	const p = currentFlushPromise || resolvedPromise;
	return fn ? p.then(this ? fn.bind(this) : fn) : p;
}
function findInsertionIndex(id) {
	let start = flushIndex + 1;
	let end = queue.length;
	while (start < end) {
		const middle = start + end >>> 1;
		const middleJob = queue[middle];
		const middleJobId = getId(middleJob);
		if (middleJobId < id || middleJobId === id && middleJob.flags & 2) start = middle + 1;
		else end = middle;
	}
	return start;
}
function queueJob(job) {
	if (!(job.flags & 1)) {
		const jobId = getId(job);
		const lastJob = queue[queue.length - 1];
		if (!lastJob || !(job.flags & 2) && jobId >= getId(lastJob)) queue.push(job);
		else queue.splice(findInsertionIndex(jobId), 0, job);
		job.flags |= 1;
		queueFlush();
	}
}
function queueFlush() {
	if (!currentFlushPromise) currentFlushPromise = resolvedPromise.then(flushJobs);
}
function queuePostFlushCb(cb) {
	if (!isArray$1(cb)) {
		if (activePostFlushCbs && cb.id === -1) activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
		else if (!(cb.flags & 1)) {
			pendingPostFlushCbs.push(cb);
			cb.flags |= 1;
		}
	} else pendingPostFlushCbs.push(...cb);
	queueFlush();
}
function flushPreFlushCbs(instance, seen, i = flushIndex + 1) {
	for (; i < queue.length; i++) {
		const cb = queue[i];
		if (cb && cb.flags & 2) {
			if (instance && cb.id !== instance.uid) continue;
			queue.splice(i, 1);
			i--;
			if (cb.flags & 4) cb.flags &= -2;
			cb();
			if (!(cb.flags & 4)) cb.flags &= -2;
		}
	}
}
function flushPostFlushCbs(seen) {
	if (pendingPostFlushCbs.length) {
		const deduped = [...new Set(pendingPostFlushCbs)].sort((a, b) => getId(a) - getId(b));
		pendingPostFlushCbs.length = 0;
		if (activePostFlushCbs) {
			activePostFlushCbs.push(...deduped);
			return;
		}
		activePostFlushCbs = deduped;
		for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
			const cb = activePostFlushCbs[postFlushIndex];
			if (cb.flags & 4) cb.flags &= -2;
			if (!(cb.flags & 8)) cb();
			cb.flags &= -2;
		}
		activePostFlushCbs = null;
		postFlushIndex = 0;
	}
}
var getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
function flushJobs(seen) {
	try {
		for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
			const job = queue[flushIndex];
			if (job && !(job.flags & 8)) {
				if (job.flags & 4) job.flags &= -2;
				callWithErrorHandling(job, job.i, job.i ? 15 : 14);
				if (!(job.flags & 4)) job.flags &= -2;
			}
		}
	} finally {
		for (; flushIndex < queue.length; flushIndex++) {
			const job = queue[flushIndex];
			if (job) job.flags &= -2;
		}
		flushIndex = -1;
		queue.length = 0;
		flushPostFlushCbs(seen);
		currentFlushPromise = null;
		if (queue.length || pendingPostFlushCbs.length) flushJobs(seen);
	}
}
var currentRenderingInstance = null;
var currentScopeId = null;
function setCurrentRenderingInstance(instance) {
	const prev = currentRenderingInstance;
	currentRenderingInstance = instance;
	currentScopeId = instance && instance.type.__scopeId || null;
	return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
	if (!ctx) return fn;
	if (fn._n) return fn;
	const renderFnWithContext = (...args) => {
		if (renderFnWithContext._d) setBlockTracking(-1);
		const prevInstance = setCurrentRenderingInstance(ctx);
		const prevStackSize = blockStack.length;
		let res;
		try {
			res = fn(...args);
		} finally {
			for (let i = blockStack.length; i > prevStackSize; i--) closeBlock();
			setCurrentRenderingInstance(prevInstance);
			if (renderFnWithContext._d) setBlockTracking(1);
		}
		return res;
	};
	renderFnWithContext._n = true;
	renderFnWithContext._c = true;
	renderFnWithContext._d = true;
	return renderFnWithContext;
}
function withDirectives(vnode, directives) {
	if (currentRenderingInstance === null) return vnode;
	const instance = getComponentPublicInstance(currentRenderingInstance);
	const bindings = vnode.dirs || (vnode.dirs = []);
	for (let i = 0; i < directives.length; i++) {
		let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
		if (dir) {
			if (isFunction$1(dir)) dir = {
				mounted: dir,
				updated: dir
			};
			if (dir.deep) traverse(value);
			bindings.push({
				dir,
				instance,
				value,
				oldValue: void 0,
				arg,
				modifiers
			});
		}
	}
	return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
	const bindings = vnode.dirs;
	const oldBindings = prevVNode && prevVNode.dirs;
	for (let i = 0; i < bindings.length; i++) {
		const binding = bindings[i];
		if (oldBindings) binding.oldValue = oldBindings[i].value;
		let hook = binding.dir[name];
		if (hook) {
			pauseTracking();
			callWithAsyncErrorHandling(hook, instance, 8, [
				vnode.el,
				binding,
				vnode,
				prevVNode
			]);
			resetTracking();
		}
	}
}
function provide(key, value) {
	if (currentInstance) {
		let provides = currentInstance.provides;
		const parentProvides = currentInstance.parent && currentInstance.parent.provides;
		if (parentProvides === provides) provides = currentInstance.provides = Object.create(parentProvides);
		provides[key] = value;
	}
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
	const instance = getCurrentInstance();
	if (instance || currentApp) {
		let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
		if (provides && key in provides) return provides[key];
		else if (arguments.length > 1) return treatDefaultAsFactory && isFunction$1(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
	}
}
function hasInjectionContext() {
	return !!(getCurrentInstance() || currentApp);
}
var ssrContextKey = /* @__PURE__ */ Symbol.for("v-scx");
var useSSRContext = () => {
	{
		const ctx = inject(ssrContextKey);
		if (!ctx) {}
		return ctx;
	}
};
function watchEffect(effect, options) {
	return doWatch(effect, null, options);
}
function watch(source, cb, options) {
	return doWatch(source, cb, options);
}
function doWatch(source, cb, options = EMPTY_OBJ) {
	const { immediate, deep, flush, once } = options;
	const baseWatchOptions = extend({}, options);
	const runsImmediately = cb && immediate || !cb && flush !== "post";
	let ssrCleanup;
	if (isInSSRComponentSetup) {
		if (flush === "sync") {
			const ctx = useSSRContext();
			ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
		} else if (!runsImmediately) {
			const watchStopHandle = () => {};
			watchStopHandle.stop = NOOP;
			watchStopHandle.resume = NOOP;
			watchStopHandle.pause = NOOP;
			return watchStopHandle;
		}
	}
	const instance = currentInstance;
	baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
	let isPre = false;
	if (flush === "post") baseWatchOptions.scheduler = (job) => {
		queuePostRenderEffect(job, instance && instance.suspense);
	};
	else if (flush !== "sync") {
		isPre = true;
		baseWatchOptions.scheduler = (job, isFirstRun) => {
			if (isFirstRun) job();
			else queueJob(job);
		};
	}
	baseWatchOptions.augmentJob = (job) => {
		if (cb) job.flags |= 4;
		if (isPre) {
			job.flags |= 2;
			if (instance) {
				job.id = instance.uid;
				job.i = instance;
			}
		}
	};
	const watchHandle = watch$1(source, cb, baseWatchOptions);
	if (isInSSRComponentSetup) {
		if (ssrCleanup) ssrCleanup.push(watchHandle);
		else if (runsImmediately) watchHandle();
	}
	return watchHandle;
}
function instanceWatch(source, value, options) {
	const publicThis = this.proxy;
	const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
	let cb;
	if (isFunction$1(value)) cb = value;
	else {
		cb = value.handler;
		options = value;
	}
	const reset = setCurrentInstance(this);
	const res = doWatch(getter, cb.bind(publicThis), options);
	reset();
	return res;
}
function createPathGetter(ctx, path) {
	const segments = path.split(".");
	return () => {
		let cur = ctx;
		for (let i = 0; i < segments.length && cur; i++) cur = cur[segments[i]];
		return cur;
	};
}
var pendingMounts = /* @__PURE__ */ new WeakMap();
var TeleportEndKey = /* @__PURE__ */ Symbol("_vte");
var isTeleport = (type) => type.__isTeleport;
var isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
var isTeleportDeferred = (props) => props && (props.defer || props.defer === "");
var isTargetSVG = (target) => typeof SVGElement !== "undefined" && target instanceof SVGElement;
var isTargetMathML = (target) => typeof MathMLElement === "function" && target instanceof MathMLElement;
var resolveTarget = (props, select) => {
	const targetSelector = props && props.to;
	if (isString(targetSelector)) if (!select) return null;
	else return select(targetSelector);
	else return targetSelector;
};
var TeleportImpl = {
	name: "Teleport",
	__isTeleport: true,
	process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals) {
		const { mc: mountChildren, pc: patchChildren, pbc: patchBlockChildren, o: { insert, querySelector, createText, createComment, parentNode } } = internals;
		const disabled = isTeleportDisabled(n2.props);
		let { dynamicChildren } = n2;
		const mount = (vnode, container2, anchor2) => {
			if (vnode.shapeFlag & 16) mountChildren(vnode.children, container2, anchor2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		};
		const mountToTarget = (vnode = n2) => {
			const disabled2 = isTeleportDisabled(vnode.props);
			const target = vnode.target = resolveTarget(vnode.props, querySelector);
			const targetAnchor = prepareAnchor(target, vnode, createText, insert);
			if (target) {
				if (namespace !== "svg" && isTargetSVG(target)) namespace = "svg";
				else if (namespace !== "mathml" && isTargetMathML(target)) namespace = "mathml";
				if (parentComponent && parentComponent.isCE) (parentComponent.ce._teleportTargets || (parentComponent.ce._teleportTargets = /* @__PURE__ */ new Set())).add(target);
				if (!disabled2) {
					mount(vnode, target, targetAnchor);
					updateCssVars(vnode, false);
				}
			}
		};
		const queuePendingMount = (vnode) => {
			const mountJob = () => {
				if (pendingMounts.get(vnode) !== mountJob) return;
				pendingMounts.delete(vnode);
				if (isTeleportDisabled(vnode.props)) {
					const mountContainer = parentNode(vnode.el) || container;
					mount(vnode, mountContainer, vnode.anchor);
					updateCssVars(vnode, true);
				}
				mountToTarget(vnode);
			};
			pendingMounts.set(vnode, mountJob);
			queuePostRenderEffect(mountJob, parentSuspense);
		};
		if (n1 == null) {
			const placeholder = n2.el = createText("");
			const mainAnchor = n2.anchor = createText("");
			insert(placeholder, container, anchor);
			insert(mainAnchor, container, anchor);
			if (isTeleportDeferred(n2.props) || parentSuspense && parentSuspense.pendingBranch) {
				queuePendingMount(n2);
				return;
			}
			if (disabled) {
				mount(n2, container, mainAnchor);
				updateCssVars(n2, true);
			}
			mountToTarget();
		} else {
			n2.el = n1.el;
			const mainAnchor = n2.anchor = n1.anchor;
			const pendingMount = pendingMounts.get(n1);
			if (pendingMount) {
				pendingMount.flags |= 8;
				pendingMounts.delete(n1);
				queuePendingMount(n2);
				return;
			}
			n2.targetStart = n1.targetStart;
			const target = n2.target = n1.target;
			const targetAnchor = n2.targetAnchor = n1.targetAnchor;
			const wasDisabled = isTeleportDisabled(n1.props);
			const currentContainer = wasDisabled ? container : target;
			const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
			if (namespace === "svg" || isTargetSVG(target)) namespace = "svg";
			else if (namespace === "mathml" || isTargetMathML(target)) namespace = "mathml";
			if (dynamicChildren) {
				patchBlockChildren(n1.dynamicChildren, dynamicChildren, currentContainer, parentComponent, parentSuspense, namespace, slotScopeIds);
				traverseStaticChildren(n1, n2, true);
			} else if (!optimized) patchChildren(n1, n2, currentContainer, currentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, false);
			if (disabled) {
				if (!wasDisabled) moveTeleport(n2, container, mainAnchor, internals, 1);
				else if (n2.props && n1.props && n2.props.to !== n1.props.to) n2.props.to = n1.props.to;
			} else if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
				const nextTarget = resolveTarget(n2.props, querySelector);
				if (nextTarget) {
					n2.target = nextTarget;
					moveTeleport(n2, nextTarget, null, internals, 0);
				}
			} else if (wasDisabled) moveTeleport(n2, target, targetAnchor, internals, 1);
			updateCssVars(n2, disabled);
		}
	},
	remove(vnode, parentComponent, parentSuspense, { um: unmount, o: { remove: hostRemove } }, doRemove) {
		const { shapeFlag, children, anchor, targetStart, targetAnchor, target, props } = vnode;
		const disabled = isTeleportDisabled(props);
		const shouldRemove = doRemove || !disabled;
		const pendingMount = pendingMounts.get(vnode);
		if (pendingMount) {
			pendingMount.flags |= 8;
			pendingMounts.delete(vnode);
		}
		if (target) {
			hostRemove(targetStart);
			hostRemove(targetAnchor);
		}
		doRemove && hostRemove(anchor);
		if (!pendingMount && (disabled || target) && shapeFlag & 16) for (let i = 0; i < children.length; i++) {
			const child = children[i];
			unmount(child, parentComponent, parentSuspense, shouldRemove, !!child.dynamicChildren);
		}
	},
	move: moveTeleport,
	hydrate: hydrateTeleport
};
function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2) {
	if (moveType === 0) insert(vnode.targetAnchor, container, parentAnchor);
	const { el, anchor, shapeFlag, children, props } = vnode;
	const isReorder = moveType === 2;
	if (isReorder) insert(el, container, parentAnchor);
	if (!pendingMounts.has(vnode) && (!isReorder || isTeleportDisabled(props))) {
		if (shapeFlag & 16) for (let i = 0; i < children.length; i++) move(children[i], container, parentAnchor, 2);
	}
	if (isReorder) insert(anchor, container, parentAnchor);
}
function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, { o: { nextSibling, parentNode, querySelector, insert, createText } }, hydrateChildren) {
	function hydrateAnchor(target2, targetNode) {
		let targetAnchor = targetNode;
		while (targetAnchor) {
			if (targetAnchor && targetAnchor.nodeType === 8) {
				if (targetAnchor.data === "teleport start anchor") vnode.targetStart = targetAnchor;
				else if (targetAnchor.data === "teleport anchor") {
					vnode.targetAnchor = targetAnchor;
					target2._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
					break;
				}
			}
			targetAnchor = nextSibling(targetAnchor);
		}
	}
	function hydrateDisabledTeleport(node2, vnode2) {
		vnode2.anchor = hydrateChildren(nextSibling(node2), vnode2, parentNode(node2), parentComponent, parentSuspense, slotScopeIds, optimized);
	}
	const target = vnode.target = resolveTarget(vnode.props, querySelector);
	const disabled = isTeleportDisabled(vnode.props);
	if (target) {
		const targetNode = target._lpa || target.firstChild;
		if (vnode.shapeFlag & 16) if (disabled) {
			hydrateDisabledTeleport(node, vnode);
			hydrateAnchor(target, targetNode);
			if (!vnode.targetAnchor) prepareAnchor(target, vnode, createText, insert, parentNode(node) === target ? node : null);
		} else {
			vnode.anchor = nextSibling(node);
			hydrateAnchor(target, targetNode);
			if (!vnode.targetAnchor) prepareAnchor(target, vnode, createText, insert);
			hydrateChildren(targetNode && nextSibling(targetNode), vnode, target, parentComponent, parentSuspense, slotScopeIds, optimized);
		}
		updateCssVars(vnode, disabled);
	} else if (disabled) {
		if (vnode.shapeFlag & 16) {
			hydrateDisabledTeleport(node, vnode);
			vnode.targetStart = node;
			vnode.targetAnchor = nextSibling(node);
		}
	}
	return vnode.anchor && nextSibling(vnode.anchor);
}
var Teleport = TeleportImpl;
function updateCssVars(vnode, isDisabled) {
	const ctx = vnode.ctx;
	if (ctx && ctx.ut) {
		let node, anchor;
		if (isDisabled) {
			node = vnode.el;
			anchor = vnode.anchor;
		} else {
			node = vnode.targetStart;
			anchor = vnode.targetAnchor;
		}
		while (node && node !== anchor) {
			if (node.nodeType === 1) node.setAttribute("data-v-owner", ctx.uid);
			node = node.nextSibling;
		}
		ctx.ut();
	}
}
function prepareAnchor(target, vnode, createText, insert, anchor = null) {
	const targetStart = vnode.targetStart = createText("");
	const targetAnchor = vnode.targetAnchor = createText("");
	targetStart[TeleportEndKey] = targetAnchor;
	if (target) {
		insert(targetStart, target, anchor);
		insert(targetAnchor, target, anchor);
	}
	return targetAnchor;
}
var leaveCbKey = /* @__PURE__ */ Symbol("_leaveCb");
var enterCbKey$1 = /* @__PURE__ */ Symbol("_enterCb");
function useTransitionState() {
	const state = {
		isMounted: false,
		isLeaving: false,
		isUnmounting: false,
		leavingVNodes: /* @__PURE__ */ new Map()
	};
	onMounted(() => {
		state.isMounted = true;
	});
	onBeforeUnmount(() => {
		state.isUnmounting = true;
	});
	return state;
}
var TransitionHookValidator = [Function, Array];
var BaseTransitionPropsValidators = {
	mode: String,
	appear: Boolean,
	persisted: Boolean,
	onBeforeEnter: TransitionHookValidator,
	onEnter: TransitionHookValidator,
	onAfterEnter: TransitionHookValidator,
	onEnterCancelled: TransitionHookValidator,
	onBeforeLeave: TransitionHookValidator,
	onLeave: TransitionHookValidator,
	onAfterLeave: TransitionHookValidator,
	onLeaveCancelled: TransitionHookValidator,
	onBeforeAppear: TransitionHookValidator,
	onAppear: TransitionHookValidator,
	onAfterAppear: TransitionHookValidator,
	onAppearCancelled: TransitionHookValidator
};
var recursiveGetSubtree = (instance) => {
	const subTree = instance.subTree;
	return subTree.component ? recursiveGetSubtree(subTree.component) : subTree;
};
var BaseTransitionImpl = {
	name: `BaseTransition`,
	props: BaseTransitionPropsValidators,
	setup(props, { slots }) {
		const instance = getCurrentInstance();
		const state = useTransitionState();
		return () => {
			const children = slots.default && getTransitionRawChildren(slots.default(), true);
			const child = children && children.length ? findNonCommentChild(children) : instance.subTree ? createCommentVNode() : void 0;
			if (!child) return;
			const rawProps = /* @__PURE__ */ toRaw(props);
			const { mode } = rawProps;
			if (state.isLeaving) return emptyPlaceholder(child);
			const innerChild = getInnerChild$1(child);
			if (!innerChild) return emptyPlaceholder(child);
			let enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance, (hooks) => enterHooks = hooks);
			if (innerChild.type !== Comment) setTransitionHooks(innerChild, enterHooks);
			let oldInnerChild = instance.subTree && getInnerChild$1(instance.subTree);
			if (oldInnerChild && oldInnerChild.type !== Comment && !isSameVNodeType(oldInnerChild, innerChild) && recursiveGetSubtree(instance).type !== Comment) {
				let leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance);
				setTransitionHooks(oldInnerChild, leavingHooks);
				if (mode === "out-in" && innerChild.type !== Comment) {
					state.isLeaving = true;
					leavingHooks.afterLeave = () => {
						state.isLeaving = false;
						if (!(instance.job.flags & 8)) instance.update();
						delete leavingHooks.afterLeave;
						oldInnerChild = void 0;
					};
					return emptyPlaceholder(child);
				} else if (mode === "in-out" && innerChild.type !== Comment) leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
					const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
					leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
					el[leaveCbKey] = () => {
						earlyRemove();
						el[leaveCbKey] = void 0;
						delete enterHooks.delayedLeave;
						oldInnerChild = void 0;
					};
					enterHooks.delayedLeave = () => {
						delayedLeave();
						delete enterHooks.delayedLeave;
						oldInnerChild = void 0;
					};
				};
				else oldInnerChild = void 0;
			} else if (oldInnerChild) oldInnerChild = void 0;
			return child;
		};
	}
};
function findNonCommentChild(children) {
	let child = children[0];
	if (children.length > 1) {
		for (const c of children) if (c.type !== Comment) {
			child = c;
			break;
		}
	}
	return child;
}
var BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
	const { leavingVNodes } = state;
	let leavingVNodesCache = leavingVNodes.get(vnode.type);
	if (!leavingVNodesCache) {
		leavingVNodesCache = /* @__PURE__ */ Object.create(null);
		leavingVNodes.set(vnode.type, leavingVNodesCache);
	}
	return leavingVNodesCache;
}
function resolveTransitionHooks(vnode, props, state, instance, postClone) {
	const { appear, mode, persisted = false, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, onBeforeAppear, onAppear, onAfterAppear, onAppearCancelled } = props;
	const key = String(vnode.key);
	const leavingVNodesCache = getLeavingNodesForType(state, vnode);
	const callHook = (hook, args) => {
		hook && callWithAsyncErrorHandling(hook, instance, 9, args);
	};
	const callAsyncHook = (hook, args) => {
		const done = args[1];
		callHook(hook, args);
		if (isArray$1(hook)) {
			if (hook.every((hook2) => hook2.length <= 1)) done();
		} else if (hook.length <= 1) done();
	};
	const hooks = {
		mode,
		persisted,
		beforeEnter(el) {
			let hook = onBeforeEnter;
			if (!state.isMounted) if (appear) hook = onBeforeAppear || onBeforeEnter;
			else return;
			if (el[leaveCbKey]) el[leaveCbKey](true);
			const leavingVNode = leavingVNodesCache[key];
			if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el[leaveCbKey]) leavingVNode.el[leaveCbKey]();
			callHook(hook, [el]);
		},
		enter(el) {
			if (leavingVNodesCache[key] === vnode) return;
			let hook = onEnter;
			let afterHook = onAfterEnter;
			let cancelHook = onEnterCancelled;
			if (!state.isMounted) if (appear) {
				hook = onAppear || onEnter;
				afterHook = onAfterAppear || onAfterEnter;
				cancelHook = onAppearCancelled || onEnterCancelled;
			} else return;
			let called = false;
			el[enterCbKey$1] = (cancelled) => {
				if (called) return;
				called = true;
				if (cancelled) callHook(cancelHook, [el]);
				else callHook(afterHook, [el]);
				if (hooks.delayedLeave) hooks.delayedLeave();
				el[enterCbKey$1] = void 0;
			};
			const done = el[enterCbKey$1].bind(null, false);
			if (hook) callAsyncHook(hook, [el, done]);
			else done();
		},
		leave(el, remove) {
			const key2 = String(vnode.key);
			if (el[enterCbKey$1]) el[enterCbKey$1](true);
			if (state.isUnmounting) return remove();
			callHook(onBeforeLeave, [el]);
			let called = false;
			el[leaveCbKey] = (cancelled) => {
				if (called) return;
				called = true;
				remove();
				if (cancelled) callHook(onLeaveCancelled, [el]);
				else callHook(onAfterLeave, [el]);
				el[leaveCbKey] = void 0;
				if (leavingVNodesCache[key2] === vnode) delete leavingVNodesCache[key2];
			};
			const done = el[leaveCbKey].bind(null, false);
			leavingVNodesCache[key2] = vnode;
			if (onLeave) callAsyncHook(onLeave, [el, done]);
			else done();
		},
		clone(vnode2) {
			const hooks2 = resolveTransitionHooks(vnode2, props, state, instance, postClone);
			if (postClone) postClone(hooks2);
			return hooks2;
		}
	};
	return hooks;
}
function emptyPlaceholder(vnode) {
	if (isKeepAlive(vnode)) {
		vnode = cloneVNode(vnode);
		vnode.children = null;
		return vnode;
	}
}
function getInnerChild$1(vnode) {
	if (!isKeepAlive(vnode)) {
		if (isTeleport(vnode.type) && vnode.children) return findNonCommentChild(vnode.children);
		return vnode;
	}
	if (vnode.component) return vnode.component.subTree;
	const { shapeFlag, children } = vnode;
	if (children) {
		if (shapeFlag & 16) return children[0];
		if (shapeFlag & 32 && isFunction$1(children.default)) return children.default();
	}
}
function setTransitionHooks(vnode, hooks) {
	if (vnode.shapeFlag & 6 && vnode.component) {
		vnode.transition = hooks;
		setTransitionHooks(vnode.component.subTree, hooks);
	} else if (vnode.shapeFlag & 128) {
		vnode.ssContent.transition = hooks.clone(vnode.ssContent);
		vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
	} else vnode.transition = hooks;
}
function getTransitionRawChildren(children, keepComment = false, parentKey) {
	let ret = [];
	let keyedFragmentCount = 0;
	for (let i = 0; i < children.length; i++) {
		let child = children[i];
		const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
		if (child.type === Fragment) {
			if (child.patchFlag & 128) keyedFragmentCount++;
			ret = ret.concat(getTransitionRawChildren(child.children, keepComment, key));
		} else if (keepComment || child.type !== Comment) ret.push(key != null ? cloneVNode(child, { key }) : child);
	}
	if (keyedFragmentCount > 1) for (let i = 0; i < ret.length; i++) ret[i].patchFlag = -2;
	return ret;
}
// @__NO_SIDE_EFFECTS__
function defineComponent(options, extraOptions) {
	return isFunction$1(options) ? /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))() : options;
}
function markAsyncBoundary(instance) {
	instance.ids = [
		instance.ids[0] + instance.ids[2]++ + "-",
		0,
		0
	];
}
function isTemplateRefKey(refs, key) {
	let desc;
	return !!((desc = Object.getOwnPropertyDescriptor(refs, key)) && !desc.configurable);
}
var pendingSetRefMap = /* @__PURE__ */ new WeakMap();
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
	if (isArray$1(rawRef)) {
		rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray$1(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
		return;
	}
	if (isAsyncWrapper(vnode) && !isUnmount) {
		if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
		return;
	}
	const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
	const value = isUnmount ? null : refValue;
	const { i: owner, r: ref } = rawRef;
	const oldRef = oldRawRef && oldRawRef.r;
	const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
	const setupState = owner.setupState;
	const rawSetupState = /* @__PURE__ */ toRaw(setupState);
	const canSetSetupRef = setupState === EMPTY_OBJ ? NO : (key) => {
		if (isTemplateRefKey(refs, key)) return false;
		return hasOwn(rawSetupState, key);
	};
	const canSetRef = (ref2, key) => {
		if (key && isTemplateRefKey(refs, key)) return false;
		return true;
	};
	if (oldRef != null && oldRef !== ref) {
		invalidatePendingSetRef(oldRawRef);
		if (isString(oldRef)) {
			refs[oldRef] = null;
			if (canSetSetupRef(oldRef)) setupState[oldRef] = null;
		} else if (/* @__PURE__ */ isRef(oldRef)) {
			const oldRawRefAtom = oldRawRef;
			if (canSetRef(oldRef, oldRawRefAtom.k)) oldRef.value = null;
			if (oldRawRefAtom.k) refs[oldRawRefAtom.k] = null;
		}
	}
	if (isFunction$1(ref)) callWithErrorHandling(ref, owner, 12, [value, refs]);
	else {
		const _isString = isString(ref);
		const _isRef = /* @__PURE__ */ isRef(ref);
		if (_isString || _isRef) {
			const doSet = () => {
				if (rawRef.f) {
					const existing = _isString ? canSetSetupRef(ref) ? setupState[ref] : refs[ref] : canSetRef(ref) || !rawRef.k ? ref.value : refs[rawRef.k];
					if (isUnmount) isArray$1(existing) && remove(existing, refValue);
					else if (!isArray$1(existing)) if (_isString) {
						refs[ref] = [refValue];
						if (canSetSetupRef(ref)) setupState[ref] = refs[ref];
					} else {
						const newVal = [refValue];
						if (canSetRef(ref, rawRef.k)) ref.value = newVal;
						if (rawRef.k) refs[rawRef.k] = newVal;
					}
					else if (!existing.includes(refValue)) existing.push(refValue);
				} else if (_isString) {
					refs[ref] = value;
					if (canSetSetupRef(ref)) setupState[ref] = value;
				} else if (_isRef) {
					if (canSetRef(ref, rawRef.k)) ref.value = value;
					if (rawRef.k) refs[rawRef.k] = value;
				}
			};
			if (value) {
				const job = () => {
					doSet();
					pendingSetRefMap.delete(rawRef);
				};
				job.id = -1;
				pendingSetRefMap.set(rawRef, job);
				queuePostRenderEffect(job, parentSuspense);
			} else {
				invalidatePendingSetRef(rawRef);
				doSet();
			}
		}
	}
}
function invalidatePendingSetRef(rawRef) {
	const pendingSetRef = pendingSetRefMap.get(rawRef);
	if (pendingSetRef) {
		pendingSetRef.flags |= 8;
		pendingSetRefMap.delete(rawRef);
	}
}
getGlobalThis().requestIdleCallback;
getGlobalThis().cancelIdleCallback;
var isAsyncWrapper = (i) => !!i.type.__asyncLoader;
var isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
	registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
	registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
	const wrappedHook = hook.__wdc || (hook.__wdc = () => {
		let current = target;
		while (current) {
			if (current.isDeactivated) return;
			current = current.parent;
		}
		return hook();
	});
	injectHook(type, wrappedHook, target);
	if (target) {
		let current = target.parent;
		while (current && current.parent) {
			if (isKeepAlive(current.parent.vnode)) injectToKeepAliveRoot(wrappedHook, type, target, current);
			current = current.parent;
		}
	}
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
	const injected = injectHook(type, hook, keepAliveRoot, true);
	onUnmounted(() => {
		remove(keepAliveRoot[type], injected);
	}, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
	if (target) {
		const hooks = target[type] || (target[type] = []);
		const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
			pauseTracking();
			const reset = setCurrentInstance(target);
			const res = callWithAsyncErrorHandling(hook, target, type, args);
			reset();
			resetTracking();
			return res;
		});
		if (prepend) hooks.unshift(wrappedHook);
		else hooks.push(wrappedHook);
		return wrappedHook;
	}
}
var createHook = (lifecycle) => (hook, target = currentInstance) => {
	if (!isInSSRComponentSetup || lifecycle === "sp") injectHook(lifecycle, (...args) => hook(...args), target);
};
var onBeforeMount = createHook("bm");
var onMounted = createHook("m");
var onBeforeUpdate = createHook("bu");
var onUpdated = createHook("u");
var onBeforeUnmount = createHook("bum");
var onUnmounted = createHook("um");
var onServerPrefetch = createHook("sp");
var onRenderTriggered = createHook("rtg");
var onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target = currentInstance) {
	injectHook("ec", hook, target);
}
var COMPONENTS = "components";
var DIRECTIVES = "directives";
function resolveComponent(name, maybeSelfReference) {
	return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
var NULL_DYNAMIC_COMPONENT = /* @__PURE__ */ Symbol.for("v-ndc");
function resolveDynamicComponent(component) {
	if (isString(component)) return resolveAsset(COMPONENTS, component, false) || component;
	else return component || NULL_DYNAMIC_COMPONENT;
}
function resolveDirective(name) {
	return resolveAsset(DIRECTIVES, name);
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
	const instance = currentRenderingInstance || currentInstance;
	if (instance) {
		const Component = instance.type;
		if (type === COMPONENTS) {
			const selfName = getComponentName(Component, false);
			if (selfName && (selfName === name || selfName === camelize$1(name) || selfName === capitalize$1(camelize$1(name)))) return Component;
		}
		const res = resolve(instance[type] || Component[type], name) || resolve(instance.appContext[type], name);
		if (!res && maybeSelfReference) return Component;
		return res;
	}
}
function resolve(registry, name) {
	return registry && (registry[name] || registry[camelize$1(name)] || registry[capitalize$1(camelize$1(name))]);
}
function renderList(source, renderItem, cache, index) {
	let ret;
	const cached = cache && cache[index];
	const sourceIsArray = isArray$1(source);
	if (sourceIsArray || isString(source)) {
		const sourceIsReactiveArray = sourceIsArray && /* @__PURE__ */ isReactive(source);
		let needsWrap = false;
		let isReadonlySource = false;
		if (sourceIsReactiveArray) {
			needsWrap = !/* @__PURE__ */ isShallow(source);
			isReadonlySource = /* @__PURE__ */ isReadonly(source);
			source = shallowReadArray(source);
		}
		ret = new Array(source.length);
		for (let i = 0, l = source.length; i < l; i++) ret[i] = renderItem(needsWrap ? isReadonlySource ? toReadonly(toReactive$1(source[i])) : toReactive$1(source[i]) : source[i], i, void 0, cached && cached[i]);
	} else if (typeof source === "number") {
		ret = new Array(source);
		for (let i = 0; i < source; i++) ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
	} else if (isObject$2(source)) if (source[Symbol.iterator]) ret = Array.from(source, (item, i) => renderItem(item, i, void 0, cached && cached[i]));
	else {
		const keys = Object.keys(source);
		ret = new Array(keys.length);
		for (let i = 0, l = keys.length; i < l; i++) {
			const key = keys[i];
			ret[i] = renderItem(source[key], key, i, cached && cached[i]);
		}
	}
	else ret = [];
	if (cache) cache[index] = ret;
	return ret;
}
function createSlots(slots, dynamicSlots) {
	for (let i = 0; i < dynamicSlots.length; i++) {
		const slot = dynamicSlots[i];
		if (isArray$1(slot)) for (let j = 0; j < slot.length; j++) slots[slot[j].name] = slot[j].fn;
		else if (slot) slots[slot.name] = slot.key ? (...args) => {
			const res = slot.fn(...args);
			if (res) res.key = slot.key;
			return res;
		} : slot.fn;
	}
	return slots;
}
function renderSlot(slots, name, props = {}, fallback, noSlotted, branchKey) {
	if (currentRenderingInstance.ce || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.ce) {
		const slotProps = branchKey != null && props.key == null ? extend({}, props, { key: branchKey }) : props;
		const hasProps = Object.keys(slotProps).length > 0;
		if (name !== "default") slotProps.name = name;
		return openBlock(), createBlock(Fragment, null, [createVNode("slot", slotProps, fallback && fallback())], hasProps ? -2 : 64);
	}
	let slot = slots[name];
	if (slot && slot._c) slot._d = false;
	const prevStackSize = blockStack.length;
	openBlock();
	let rendered;
	try {
		const validSlotContent = slot && ensureValidVNode$1(slot(props));
		const slotKey = props.key || branchKey || validSlotContent && validSlotContent.key;
		rendered = createBlock(Fragment, { key: (slotKey && !isSymbol$1(slotKey) ? slotKey : `_${name}`) + (!validSlotContent && fallback ? "_fb" : "") }, validSlotContent || (fallback ? fallback() : []), validSlotContent && slots._ === 1 ? 64 : -2);
	} catch (err) {
		for (let i = blockStack.length; i > prevStackSize; i--) closeBlock();
		throw err;
	} finally {
		if (slot && slot._c) slot._d = true;
	}
	if (!noSlotted && rendered.scopeId) rendered.slotScopeIds = [rendered.scopeId + "-s"];
	return rendered;
}
function ensureValidVNode$1(vnodes) {
	return vnodes.some((child) => {
		if (!isVNode(child)) return true;
		if (child.type === Comment) return false;
		if (child.type === Fragment && !ensureValidVNode$1(child.children)) return false;
		return true;
	}) ? vnodes : null;
}
function toHandlers(obj, preserveCaseIfNecessary) {
	const ret = {};
	for (const key in obj) ret[preserveCaseIfNecessary && /[A-Z]/.test(key) ? `on:${key}` : toHandlerKey(key)] = obj[key];
	return ret;
}
var getPublicInstance = (i) => {
	if (!i) return null;
	if (isStatefulComponent(i)) return getComponentPublicInstance(i);
	return getPublicInstance(i.parent);
};
var publicPropertiesMap = /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
	$: (i) => i,
	$el: (i) => i.vnode.el,
	$data: (i) => i.data,
	$props: (i) => i.props,
	$attrs: (i) => i.attrs,
	$slots: (i) => i.slots,
	$refs: (i) => i.refs,
	$parent: (i) => getPublicInstance(i.parent),
	$root: (i) => getPublicInstance(i.root),
	$host: (i) => i.ce,
	$emit: (i) => i.emit,
	$options: (i) => resolveMergedOptions(i),
	$forceUpdate: (i) => i.f || (i.f = () => {
		queueJob(i.update);
	}),
	$nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
	$watch: (i) => instanceWatch.bind(i)
});
var hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
var PublicInstanceProxyHandlers = {
	get({ _: instance }, key) {
		if (key === "__v_skip") return true;
		const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
		if (key[0] !== "$") {
			const n = accessCache[key];
			if (n !== void 0) switch (n) {
				case 1: return setupState[key];
				case 2: return data[key];
				case 4: return ctx[key];
				case 3: return props[key];
			}
			else if (hasSetupBinding(setupState, key)) {
				accessCache[key] = 1;
				return setupState[key];
			} else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
				accessCache[key] = 2;
				return data[key];
			} else if (hasOwn(props, key)) {
				accessCache[key] = 3;
				return props[key];
			} else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
				accessCache[key] = 4;
				return ctx[key];
			} else if (shouldCacheAccess) accessCache[key] = 0;
		}
		const publicGetter = publicPropertiesMap[key];
		let cssModule, globalProperties;
		if (publicGetter) {
			if (key === "$attrs") track(instance.attrs, "get", "");
			return publicGetter(instance);
		} else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) return cssModule;
		else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
			accessCache[key] = 4;
			return ctx[key];
		} else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) return globalProperties[key];
	},
	set({ _: instance }, key, value) {
		const { data, setupState, ctx } = instance;
		if (hasSetupBinding(setupState, key)) {
			setupState[key] = value;
			return true;
		} else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
			data[key] = value;
			return true;
		} else if (hasOwn(instance.props, key)) return false;
		if (key[0] === "$" && key.slice(1) in instance) return false;
		else ctx[key] = value;
		return true;
	},
	has({ _: { data, setupState, accessCache, ctx, appContext, props, type } }, key) {
		let cssModules;
		return !!(accessCache[key] || data !== EMPTY_OBJ && key[0] !== "$" && hasOwn(data, key) || hasSetupBinding(setupState, key) || hasOwn(props, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key) || (cssModules = type.__cssModules) && cssModules[key]);
	},
	defineProperty(target, key, descriptor) {
		if (descriptor.get != null) target._.accessCache[key] = 0;
		else if (hasOwn(descriptor, "value")) this.set(target, key, descriptor.value, null);
		return Reflect.defineProperty(target, key, descriptor);
	}
};
function useSlots() {
	return getContext("useSlots").slots;
}
function useAttrs$1() {
	return getContext("useAttrs").attrs;
}
function getContext(calledFunctionName) {
	const i = getCurrentInstance();
	return i.setupContext || (i.setupContext = createSetupContext(i));
}
function normalizePropsOrEmits(props) {
	return isArray$1(props) ? props.reduce((normalized, p) => (normalized[p] = null, normalized), {}) : props;
}
var shouldCacheAccess = true;
function applyOptions(instance) {
	const options = resolveMergedOptions(instance);
	const publicThis = instance.proxy;
	const ctx = instance.ctx;
	shouldCacheAccess = false;
	if (options.beforeCreate) callHook$1(options.beforeCreate, instance, "bc");
	const { data: dataOptions, computed: computedOptions, methods, watch: watchOptions, provide: provideOptions, inject: injectOptions, created, beforeMount, mounted, beforeUpdate, updated, activated, deactivated, beforeDestroy, beforeUnmount, destroyed, unmounted, render, renderTracked, renderTriggered, errorCaptured, serverPrefetch, expose, inheritAttrs, components, directives, filters } = options;
	const checkDuplicateProperties = null;
	if (injectOptions) resolveInjections(injectOptions, ctx, checkDuplicateProperties);
	if (methods) for (const key in methods) {
		const methodHandler = methods[key];
		if (isFunction$1(methodHandler)) ctx[key] = methodHandler.bind(publicThis);
	}
	if (dataOptions) {
		const data = dataOptions.call(publicThis, publicThis);
		if (!isObject$2(data)) {} else instance.data = /* @__PURE__ */ reactive(data);
	}
	shouldCacheAccess = true;
	if (computedOptions) for (const key in computedOptions) {
		const opt = computedOptions[key];
		const c = computed({
			get: isFunction$1(opt) ? opt.bind(publicThis, publicThis) : isFunction$1(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP,
			set: !isFunction$1(opt) && isFunction$1(opt.set) ? opt.set.bind(publicThis) : NOOP
		});
		Object.defineProperty(ctx, key, {
			enumerable: true,
			configurable: true,
			get: () => c.value,
			set: (v) => c.value = v
		});
	}
	if (watchOptions) for (const key in watchOptions) createWatcher(watchOptions[key], ctx, publicThis, key);
	if (provideOptions) {
		const provides = isFunction$1(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
		Reflect.ownKeys(provides).forEach((key) => {
			provide(key, provides[key]);
		});
	}
	if (created) callHook$1(created, instance, "c");
	function registerLifecycleHook(register, hook) {
		if (isArray$1(hook)) hook.forEach((_hook) => register(_hook.bind(publicThis)));
		else if (hook) register(hook.bind(publicThis));
	}
	registerLifecycleHook(onBeforeMount, beforeMount);
	registerLifecycleHook(onMounted, mounted);
	registerLifecycleHook(onBeforeUpdate, beforeUpdate);
	registerLifecycleHook(onUpdated, updated);
	registerLifecycleHook(onActivated, activated);
	registerLifecycleHook(onDeactivated, deactivated);
	registerLifecycleHook(onErrorCaptured, errorCaptured);
	registerLifecycleHook(onRenderTracked, renderTracked);
	registerLifecycleHook(onRenderTriggered, renderTriggered);
	registerLifecycleHook(onBeforeUnmount, beforeUnmount);
	registerLifecycleHook(onUnmounted, unmounted);
	registerLifecycleHook(onServerPrefetch, serverPrefetch);
	if (isArray$1(expose)) {
		if (expose.length) {
			const exposed = instance.exposed || (instance.exposed = {});
			expose.forEach((key) => {
				Object.defineProperty(exposed, key, {
					get: () => publicThis[key],
					set: (val) => publicThis[key] = val,
					enumerable: true
				});
			});
		} else if (!instance.exposed) instance.exposed = {};
	}
	if (render && instance.render === NOOP) instance.render = render;
	if (inheritAttrs != null) instance.inheritAttrs = inheritAttrs;
	if (components) instance.components = components;
	if (directives) instance.directives = directives;
	if (serverPrefetch) markAsyncBoundary(instance);
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
	if (isArray$1(injectOptions)) injectOptions = normalizeInject(injectOptions);
	for (const key in injectOptions) {
		const opt = injectOptions[key];
		let injected;
		if (isObject$2(opt)) if ("default" in opt) injected = inject(opt.from || key, opt.default, true);
		else injected = inject(opt.from || key);
		else injected = inject(opt);
		if (/* @__PURE__ */ isRef(injected)) Object.defineProperty(ctx, key, {
			enumerable: true,
			configurable: true,
			get: () => injected.value,
			set: (v) => injected.value = v
		});
		else ctx[key] = injected;
	}
}
function callHook$1(hook, instance, type) {
	callWithAsyncErrorHandling(isArray$1(hook) ? hook.map((h) => h.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
}
function createWatcher(raw, ctx, publicThis, key) {
	let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
	if (isString(raw)) {
		const handler = ctx[raw];
		if (isFunction$1(handler)) watch(getter, handler);
	} else if (isFunction$1(raw)) watch(getter, raw.bind(publicThis));
	else if (isObject$2(raw)) if (isArray$1(raw)) raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
	else {
		const handler = isFunction$1(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
		if (isFunction$1(handler)) watch(getter, handler, raw);
	}
}
function resolveMergedOptions(instance) {
	const base = instance.type;
	const { mixins, extends: extendsOptions } = base;
	const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance.appContext;
	const cached = cache.get(base);
	let resolved;
	if (cached) resolved = cached;
	else if (!globalMixins.length && !mixins && !extendsOptions) resolved = base;
	else {
		resolved = {};
		if (globalMixins.length) globalMixins.forEach((m) => mergeOptions$1(resolved, m, optionMergeStrategies, true));
		mergeOptions$1(resolved, base, optionMergeStrategies);
	}
	if (isObject$2(base)) cache.set(base, resolved);
	return resolved;
}
function mergeOptions$1(to, from, strats, asMixin = false) {
	const { mixins, extends: extendsOptions } = from;
	if (extendsOptions) mergeOptions$1(to, extendsOptions, strats, true);
	if (mixins) mixins.forEach((m) => mergeOptions$1(to, m, strats, true));
	for (const key in from) if (asMixin && key === "expose") {} else {
		const strat = internalOptionMergeStrats[key] || strats && strats[key];
		to[key] = strat ? strat(to[key], from[key]) : from[key];
	}
	return to;
}
var internalOptionMergeStrats = {
	data: mergeDataFn,
	props: mergeEmitsOrPropsOptions,
	emits: mergeEmitsOrPropsOptions,
	methods: mergeObjectOptions,
	computed: mergeObjectOptions,
	beforeCreate: mergeAsArray,
	created: mergeAsArray,
	beforeMount: mergeAsArray,
	mounted: mergeAsArray,
	beforeUpdate: mergeAsArray,
	updated: mergeAsArray,
	beforeDestroy: mergeAsArray,
	beforeUnmount: mergeAsArray,
	destroyed: mergeAsArray,
	unmounted: mergeAsArray,
	activated: mergeAsArray,
	deactivated: mergeAsArray,
	errorCaptured: mergeAsArray,
	serverPrefetch: mergeAsArray,
	components: mergeObjectOptions,
	directives: mergeObjectOptions,
	watch: mergeWatchOptions,
	provide: mergeDataFn,
	inject: mergeInject
};
function mergeDataFn(to, from) {
	if (!from) return to;
	if (!to) return from;
	return function mergedDataFn() {
		return extend(isFunction$1(to) ? to.call(this, this) : to, isFunction$1(from) ? from.call(this, this) : from);
	};
}
function mergeInject(to, from) {
	return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
	if (isArray$1(raw)) {
		const res = {};
		for (let i = 0; i < raw.length; i++) res[raw[i]] = raw[i];
		return res;
	}
	return raw;
}
function mergeAsArray(to, from) {
	return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
	return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
	if (to) {
		if (isArray$1(to) && isArray$1(from)) return [.../* @__PURE__ */ new Set([...to, ...from])];
		return extend(/* @__PURE__ */ Object.create(null), normalizePropsOrEmits(to), normalizePropsOrEmits(from != null ? from : {}));
	} else return from;
}
function mergeWatchOptions(to, from) {
	if (!to) return from;
	if (!from) return to;
	const merged = extend(/* @__PURE__ */ Object.create(null), to);
	for (const key in from) merged[key] = mergeAsArray(to[key], from[key]);
	return merged;
}
function createAppContext() {
	return {
		app: null,
		config: {
			isNativeTag: NO,
			performance: false,
			globalProperties: {},
			optionMergeStrategies: {},
			errorHandler: void 0,
			warnHandler: void 0,
			compilerOptions: {}
		},
		mixins: [],
		components: {},
		directives: {},
		provides: /* @__PURE__ */ Object.create(null),
		optionsCache: /* @__PURE__ */ new WeakMap(),
		propsCache: /* @__PURE__ */ new WeakMap(),
		emitsCache: /* @__PURE__ */ new WeakMap()
	};
}
var uid$1 = 0;
function createAppAPI(render, hydrate) {
	return function createApp(rootComponent, rootProps = null) {
		if (!isFunction$1(rootComponent)) rootComponent = extend({}, rootComponent);
		if (rootProps != null && !isObject$2(rootProps)) rootProps = null;
		const context = createAppContext();
		const installedPlugins = /* @__PURE__ */ new WeakSet();
		const pluginCleanupFns = [];
		let isMounted = false;
		const app = context.app = {
			_uid: uid$1++,
			_component: rootComponent,
			_props: rootProps,
			_container: null,
			_context: context,
			_instance: null,
			version,
			get config() {
				return context.config;
			},
			set config(v) {},
			use(plugin, ...options) {
				if (installedPlugins.has(plugin)) {} else if (plugin && isFunction$1(plugin.install)) {
					installedPlugins.add(plugin);
					plugin.install(app, ...options);
				} else if (isFunction$1(plugin)) {
					installedPlugins.add(plugin);
					plugin(app, ...options);
				}
				return app;
			},
			mixin(mixin) {
				if (!context.mixins.includes(mixin)) context.mixins.push(mixin);
				return app;
			},
			component(name, component) {
				if (!component) return context.components[name];
				context.components[name] = component;
				return app;
			},
			directive(name, directive) {
				if (!directive) return context.directives[name];
				context.directives[name] = directive;
				return app;
			},
			mount(rootContainer, isHydrate, namespace) {
				if (!isMounted) {
					const vnode = app._ceVNode || createVNode(rootComponent, rootProps);
					vnode.appContext = context;
					if (namespace === true) namespace = "svg";
					else if (namespace === false) namespace = void 0;
					if (isHydrate && hydrate) hydrate(vnode, rootContainer);
					else render(vnode, rootContainer, namespace);
					isMounted = true;
					app._container = rootContainer;
					rootContainer.__vue_app__ = app;
					return getComponentPublicInstance(vnode.component);
				}
			},
			onUnmount(cleanupFn) {
				pluginCleanupFns.push(cleanupFn);
			},
			unmount() {
				if (isMounted) {
					callWithAsyncErrorHandling(pluginCleanupFns, app._instance, 16);
					render(null, app._container);
					delete app._container.__vue_app__;
				}
			},
			provide(key, value) {
				context.provides[key] = value;
				return app;
			},
			runWithContext(fn) {
				const lastApp = currentApp;
				currentApp = app;
				try {
					return fn();
				} finally {
					currentApp = lastApp;
				}
			}
		};
		return app;
	};
}
var currentApp = null;
var getModelModifiers = (props, modelName) => {
	return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize$1(modelName)}Modifiers`] || props[`${hyphenate$1(modelName)}Modifiers`];
};
function emit(instance, event, ...rawArgs) {
	if (instance.isUnmounted) return;
	const props = instance.vnode.props || EMPTY_OBJ;
	let args = rawArgs;
	const isModelListener = event.startsWith("update:");
	const modifiers = isModelListener && getModelModifiers(props, event.slice(7));
	if (modifiers) {
		if (modifiers.trim) args = rawArgs.map((a) => isString(a) ? a.trim() : a);
		if (modifiers.number) args = rawArgs.map(looseToNumber$1);
	}
	let handlerName;
	let handler = props[handlerName = toHandlerKey(event)] || props[handlerName = toHandlerKey(camelize$1(event))];
	if (!handler && isModelListener) handler = props[handlerName = toHandlerKey(hyphenate$1(event))];
	if (handler) callWithAsyncErrorHandling(handler, instance, 6, args);
	const onceHandler = props[handlerName + `Once`];
	if (onceHandler) {
		if (!instance.emitted) instance.emitted = {};
		else if (instance.emitted[handlerName]) return;
		instance.emitted[handlerName] = true;
		callWithAsyncErrorHandling(onceHandler, instance, 6, args);
	}
}
var mixinEmitsCache = /* @__PURE__ */ new WeakMap();
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
	const cache = asMixin ? mixinEmitsCache : appContext.emitsCache;
	const cached = cache.get(comp);
	if (cached !== void 0) return cached;
	const raw = comp.emits;
	let normalized = {};
	let hasExtends = false;
	if (!isFunction$1(comp)) {
		const extendEmits = (raw2) => {
			const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
			if (normalizedFromExtend) {
				hasExtends = true;
				extend(normalized, normalizedFromExtend);
			}
		};
		if (!asMixin && appContext.mixins.length) appContext.mixins.forEach(extendEmits);
		if (comp.extends) extendEmits(comp.extends);
		if (comp.mixins) comp.mixins.forEach(extendEmits);
	}
	if (!raw && !hasExtends) {
		if (isObject$2(comp)) cache.set(comp, null);
		return null;
	}
	if (isArray$1(raw)) raw.forEach((key) => normalized[key] = null);
	else extend(normalized, raw);
	if (isObject$2(comp)) cache.set(comp, normalized);
	return normalized;
}
function isEmitListener(options, key) {
	if (!options || !isOn(key)) return false;
	key = key.slice(2);
	key = key === "Once" ? key : key.replace(/Once$/, "");
	return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate$1(key)) || hasOwn(options, key);
}
function renderComponentRoot(instance) {
	const { type: Component, vnode, proxy, withProxy, propsOptions: [propsOptions], slots, attrs, emit, render, renderCache, props, data, setupState, ctx, inheritAttrs } = instance;
	const prev = setCurrentRenderingInstance(instance);
	let result;
	let fallthroughAttrs;
	try {
		if (vnode.shapeFlag & 4) {
			const proxyToUse = withProxy || proxy;
			const thisProxy = proxyToUse;
			result = normalizeVNode(render.call(thisProxy, proxyToUse, renderCache, props, setupState, data, ctx));
			fallthroughAttrs = attrs;
		} else {
			const render2 = Component;
			result = normalizeVNode(render2.length > 1 ? render2(props, {
				attrs,
				slots,
				emit
			}) : render2(props, null));
			fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
		}
	} catch (err) {
		blockStack.length = 0;
		handleError(err, instance, 1);
		result = createVNode(Comment);
	}
	let root = result;
	if (fallthroughAttrs && inheritAttrs !== false) {
		const keys = Object.keys(fallthroughAttrs);
		const { shapeFlag } = root;
		if (keys.length) {
			if (shapeFlag & 7) {
				if (propsOptions && keys.some(isModelListener)) fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
				root = cloneVNode(root, fallthroughAttrs, false, true);
			}
		}
	}
	if (vnode.dirs) {
		root = cloneVNode(root, null, false, true);
		root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
	}
	if (vnode.transition) setTransitionHooks(root, vnode.transition);
	result = root;
	setCurrentRenderingInstance(prev);
	return result;
}
var getFunctionalFallthrough = (attrs) => {
	let res;
	for (const key in attrs) if (key === "class" || key === "style" || isOn(key)) (res || (res = {}))[key] = attrs[key];
	return res;
};
var filterModelListeners = (attrs, props) => {
	const res = {};
	for (const key in attrs) if (!isModelListener(key) || !(key.slice(9) in props)) res[key] = attrs[key];
	return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
	const { props: prevProps, children: prevChildren, component } = prevVNode;
	const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
	const emits = component.emitsOptions;
	if (nextVNode.dirs || nextVNode.transition) return true;
	if (optimized && patchFlag >= 0) {
		if (patchFlag & 1024) return true;
		if (patchFlag & 16) {
			if (!prevProps) return !!nextProps;
			return hasPropsChanged(prevProps, nextProps, emits);
		} else if (patchFlag & 8) {
			const dynamicProps = nextVNode.dynamicProps;
			for (let i = 0; i < dynamicProps.length; i++) {
				const key = dynamicProps[i];
				if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emits, key)) return true;
			}
		}
	} else {
		if (prevChildren || nextChildren) {
			if (!nextChildren || !nextChildren.$stable) return true;
		}
		if (prevProps === nextProps) return false;
		if (!prevProps) return !!nextProps;
		if (!nextProps) return true;
		return hasPropsChanged(prevProps, nextProps, emits);
	}
	return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
	const nextKeys = Object.keys(nextProps);
	if (nextKeys.length !== Object.keys(prevProps).length) return true;
	for (let i = 0; i < nextKeys.length; i++) {
		const key = nextKeys[i];
		if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emitsOptions, key)) return true;
	}
	return false;
}
function hasPropValueChanged(nextProps, prevProps, key) {
	const nextProp = nextProps[key];
	const prevProp = prevProps[key];
	if (key === "style" && isObject$2(nextProp) && isObject$2(prevProp)) return !looseEqual(nextProp, prevProp);
	return nextProp !== prevProp;
}
function updateHOCHostEl({ vnode, parent, suspense }, el) {
	while (parent) {
		const root = parent.subTree;
		if (root.suspense && root.suspense.activeBranch === vnode) {
			root.suspense.vnode.el = root.el = el;
			vnode = root;
		}
		if (root === vnode) {
			(vnode = parent.vnode).el = el;
			parent = parent.parent;
		} else break;
	}
	if (suspense && suspense.activeBranch === vnode) suspense.vnode.el = el;
}
var internalObjectProto = {};
var createInternalObject = () => Object.create(internalObjectProto);
var isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
function initProps(instance, rawProps, isStateful, isSSR = false) {
	const props = {};
	const attrs = createInternalObject();
	instance.propsDefaults = /* @__PURE__ */ Object.create(null);
	setFullProps(instance, rawProps, props, attrs);
	for (const key in instance.propsOptions[0]) if (!(key in props)) props[key] = void 0;
	if (isStateful) instance.props = isSSR ? props : /* @__PURE__ */ shallowReactive(props);
	else if (!instance.type.props) instance.props = attrs;
	else instance.props = props;
	instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
	const { props, attrs, vnode: { patchFlag } } = instance;
	const rawCurrentProps = /* @__PURE__ */ toRaw(props);
	const [options] = instance.propsOptions;
	let hasAttrsChanged = false;
	if ((optimized || patchFlag > 0) && !(patchFlag & 16)) {
		if (patchFlag & 8) {
			const propsToUpdate = instance.vnode.dynamicProps;
			for (let i = 0; i < propsToUpdate.length; i++) {
				let key = propsToUpdate[i];
				if (isEmitListener(instance.emitsOptions, key)) continue;
				const value = rawProps[key];
				if (options) if (hasOwn(attrs, key)) {
					if (value !== attrs[key]) {
						attrs[key] = value;
						hasAttrsChanged = true;
					}
				} else {
					const camelizedKey = camelize$1(key);
					props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance, false);
				}
				else if (value !== attrs[key]) {
					attrs[key] = value;
					hasAttrsChanged = true;
				}
			}
		}
	} else {
		if (setFullProps(instance, rawProps, props, attrs)) hasAttrsChanged = true;
		let kebabKey;
		for (const key in rawCurrentProps) if (!rawProps || !hasOwn(rawProps, key) && ((kebabKey = hyphenate$1(key)) === key || !hasOwn(rawProps, kebabKey))) if (options) {
			if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) props[key] = resolvePropValue(options, rawCurrentProps, key, void 0, instance, true);
		} else delete props[key];
		if (attrs !== rawCurrentProps) {
			for (const key in attrs) if (!rawProps || !hasOwn(rawProps, key) && true) {
				delete attrs[key];
				hasAttrsChanged = true;
			}
		}
	}
	if (hasAttrsChanged) trigger(instance.attrs, "set", "");
}
function setFullProps(instance, rawProps, props, attrs) {
	const [options, needCastKeys] = instance.propsOptions;
	let hasAttrsChanged = false;
	let rawCastValues;
	if (rawProps) for (let key in rawProps) {
		if (isReservedProp(key)) continue;
		const value = rawProps[key];
		let camelKey;
		if (options && hasOwn(options, camelKey = camelize$1(key))) if (!needCastKeys || !needCastKeys.includes(camelKey)) props[camelKey] = value;
		else (rawCastValues || (rawCastValues = {}))[camelKey] = value;
		else if (!isEmitListener(instance.emitsOptions, key)) {
			if (!(key in attrs) || value !== attrs[key]) {
				attrs[key] = value;
				hasAttrsChanged = true;
			}
		}
	}
	if (needCastKeys) {
		const rawCurrentProps = /* @__PURE__ */ toRaw(props);
		const castValues = rawCastValues || EMPTY_OBJ;
		for (let i = 0; i < needCastKeys.length; i++) {
			const key = needCastKeys[i];
			props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !hasOwn(castValues, key));
		}
	}
	return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
	const opt = options[key];
	if (opt != null) {
		const hasDefault = hasOwn(opt, "default");
		if (hasDefault && value === void 0) {
			const defaultValue = opt.default;
			if (opt.type !== Function && !opt.skipFactory && isFunction$1(defaultValue)) {
				const { propsDefaults } = instance;
				if (key in propsDefaults) value = propsDefaults[key];
				else {
					const reset = setCurrentInstance(instance);
					value = propsDefaults[key] = defaultValue.call(null, props);
					reset();
				}
			} else value = defaultValue;
			if (instance.ce) instance.ce._setProp(key, value);
		}
		if (opt[0]) {
			if (isAbsent && !hasDefault) value = false;
			else if (opt[1] && (value === "" || value === hyphenate$1(key))) value = true;
		}
	}
	return value;
}
var mixinPropsCache = /* @__PURE__ */ new WeakMap();
function normalizePropsOptions(comp, appContext, asMixin = false) {
	const cache = asMixin ? mixinPropsCache : appContext.propsCache;
	const cached = cache.get(comp);
	if (cached) return cached;
	const raw = comp.props;
	const normalized = {};
	const needCastKeys = [];
	let hasExtends = false;
	if (!isFunction$1(comp)) {
		const extendProps = (raw2) => {
			hasExtends = true;
			const [props, keys] = normalizePropsOptions(raw2, appContext, true);
			extend(normalized, props);
			if (keys) needCastKeys.push(...keys);
		};
		if (!asMixin && appContext.mixins.length) appContext.mixins.forEach(extendProps);
		if (comp.extends) extendProps(comp.extends);
		if (comp.mixins) comp.mixins.forEach(extendProps);
	}
	if (!raw && !hasExtends) {
		if (isObject$2(comp)) cache.set(comp, EMPTY_ARR);
		return EMPTY_ARR;
	}
	if (isArray$1(raw)) for (let i = 0; i < raw.length; i++) {
		const normalizedKey = camelize$1(raw[i]);
		if (validatePropName(normalizedKey)) normalized[normalizedKey] = EMPTY_OBJ;
	}
	else if (raw) for (const key in raw) {
		const normalizedKey = camelize$1(key);
		if (validatePropName(normalizedKey)) {
			const opt = raw[key];
			const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction$1(opt) ? { type: opt } : extend({}, opt);
			const propType = prop.type;
			let shouldCast = false;
			let shouldCastTrue = true;
			if (isArray$1(propType)) for (let index = 0; index < propType.length; ++index) {
				const type = propType[index];
				const typeName = isFunction$1(type) && type.name;
				if (typeName === "Boolean") {
					shouldCast = true;
					break;
				} else if (typeName === "String") shouldCastTrue = false;
			}
			else shouldCast = isFunction$1(propType) && propType.name === "Boolean";
			prop[0] = shouldCast;
			prop[1] = shouldCastTrue;
			if (shouldCast || hasOwn(prop, "default")) needCastKeys.push(normalizedKey);
		}
	}
	const res = [normalized, needCastKeys];
	if (isObject$2(comp)) cache.set(comp, res);
	return res;
}
function validatePropName(key) {
	if (key[0] !== "$" && !isReservedProp(key)) return true;
	return false;
}
var isInternalKey = (key) => key === "_" || key === "_ctx" || key === "$stable";
var normalizeSlotValue = (value) => isArray$1(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
var normalizeSlot = (key, rawSlot, ctx) => {
	if (rawSlot._n) return rawSlot;
	const normalized = withCtx((...args) => {
		return normalizeSlotValue(rawSlot(...args));
	}, ctx);
	normalized._c = false;
	return normalized;
};
var normalizeObjectSlots = (rawSlots, slots, instance) => {
	const ctx = rawSlots._ctx;
	for (const key in rawSlots) {
		if (isInternalKey(key)) continue;
		const value = rawSlots[key];
		if (isFunction$1(value)) slots[key] = normalizeSlot(key, value, ctx);
		else if (value != null) {
			const normalized = normalizeSlotValue(value);
			slots[key] = () => normalized;
		}
	}
};
var normalizeVNodeSlots = (instance, children) => {
	const normalized = normalizeSlotValue(children);
	instance.slots.default = () => normalized;
};
var assignSlots = (slots, children, optimized) => {
	for (const key in children) if (optimized || !isInternalKey(key)) slots[key] = children[key];
};
var initSlots = (instance, children, optimized) => {
	const slots = instance.slots = createInternalObject();
	if (instance.vnode.shapeFlag & 32) {
		const type = children._;
		if (type) {
			assignSlots(slots, children, optimized);
			if (optimized) def(slots, "_", type, true);
		} else normalizeObjectSlots(children, slots);
	} else if (children) normalizeVNodeSlots(instance, children);
};
var updateSlots = (instance, children, optimized) => {
	const { vnode, slots } = instance;
	let needDeletionCheck = true;
	let deletionComparisonTarget = EMPTY_OBJ;
	if (vnode.shapeFlag & 32) {
		const type = children._;
		if (type) if (optimized && type === 1) needDeletionCheck = false;
		else assignSlots(slots, children, optimized);
		else {
			needDeletionCheck = !children.$stable;
			normalizeObjectSlots(children, slots);
		}
		deletionComparisonTarget = children;
	} else if (children) {
		normalizeVNodeSlots(instance, children);
		deletionComparisonTarget = { default: 1 };
	}
	if (needDeletionCheck) {
		for (const key in slots) if (!isInternalKey(key) && deletionComparisonTarget[key] == null) delete slots[key];
	}
};
var queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
	return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
	const target = getGlobalThis();
	target.__VUE__ = true;
	const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, insertStaticContent: hostInsertStaticContent } = options;
	const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
		if (n1 === n2) return;
		if (n1 && !isSameVNodeType(n1, n2)) {
			anchor = getNextHostNode(n1);
			unmount(n1, parentComponent, parentSuspense, true);
			n1 = null;
		}
		if (n2.patchFlag === -2) {
			optimized = false;
			n2.dynamicChildren = null;
		}
		const { type, ref, shapeFlag } = n2;
		switch (type) {
			case Text:
				processText(n1, n2, container, anchor);
				break;
			case Comment:
				processCommentNode(n1, n2, container, anchor);
				break;
			case Static:
				if (n1 == null) mountStaticNode(n2, container, anchor, namespace);
				break;
			case Fragment:
				processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				break;
			default: if (shapeFlag & 1) processElement(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else if (shapeFlag & 6) processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else if (shapeFlag & 64) type.process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals);
			else if (shapeFlag & 128) type.process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals);
		}
		if (ref != null && parentComponent) setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
		else if (ref == null && n1 && n1.ref != null) setRef(n1.ref, null, parentSuspense, n1, true);
	};
	const processText = (n1, n2, container, anchor) => {
		if (n1 == null) hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
		else {
			const el = n2.el = n1.el;
			if (n2.children !== n1.children) hostSetText(el, n2.children);
		}
	};
	const processCommentNode = (n1, n2, container, anchor) => {
		if (n1 == null) hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
		else n2.el = n1.el;
	};
	const mountStaticNode = (n2, container, anchor, namespace) => {
		[n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, namespace, n2.el, n2.anchor);
	};
	const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
		let next;
		while (el && el !== anchor) {
			next = hostNextSibling(el);
			hostInsert(el, container, nextSibling);
			el = next;
		}
		hostInsert(anchor, container, nextSibling);
	};
	const removeStaticNode = ({ el, anchor }) => {
		let next;
		while (el && el !== anchor) {
			next = hostNextSibling(el);
			hostRemove(el);
			el = next;
		}
		hostRemove(anchor);
	};
	const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		if (n2.type === "svg") namespace = "svg";
		else if (n2.type === "math") namespace = "mathml";
		if (n1 == null) mountElement(n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		else {
			const customElement = n1.el && n1.el._isVueCE ? n1.el : null;
			try {
				if (customElement) customElement._beginPatch();
				patchElement(n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			} finally {
				if (customElement) customElement._endPatch();
			}
		}
	};
	const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		let el;
		let vnodeHook;
		const { props, shapeFlag, transition, dirs } = vnode;
		el = vnode.el = hostCreateElement(vnode.type, namespace, props && props.is, props);
		if (shapeFlag & 8) hostSetElementText(el, vnode.children);
		else if (shapeFlag & 16) mountChildren(vnode.children, el, null, parentComponent, parentSuspense, resolveChildrenNamespace(vnode, namespace), slotScopeIds, optimized);
		if (dirs) invokeDirectiveHook(vnode, null, parentComponent, "created");
		setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
		if (props) {
			for (const key in props) if (key !== "value" && !isReservedProp(key)) hostPatchProp(el, key, null, props[key], namespace, parentComponent);
			if ("value" in props) hostPatchProp(el, "value", null, props.value, namespace);
			if (vnodeHook = props.onVnodeBeforeMount) invokeVNodeHook(vnodeHook, parentComponent, vnode);
		}
		if (dirs) invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
		const needCallTransitionHooks = needTransition(parentSuspense, transition);
		if (needCallTransitionHooks) transition.beforeEnter(el);
		hostInsert(el, container, anchor);
		if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) queuePostRenderEffect(() => {
			try {
				vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
				needCallTransitionHooks && transition.enter(el);
				dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
			} finally {}
		}, parentSuspense);
	};
	const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
		if (scopeId) hostSetScopeId(el, scopeId);
		if (slotScopeIds) for (let i = 0; i < slotScopeIds.length; i++) hostSetScopeId(el, slotScopeIds[i]);
		if (parentComponent) {
			let subTree = parentComponent.subTree;
			if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
				const parentVNode = parentComponent.vnode;
				setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
			}
		}
	};
	const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
		for (let i = start; i < children.length; i++) {
			const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
			patch(null, child, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		}
	};
	const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		const el = n2.el = n1.el;
		let { patchFlag, dynamicChildren, dirs } = n2;
		patchFlag |= n1.patchFlag & 16;
		const oldProps = n1.props || EMPTY_OBJ;
		const newProps = n2.props || EMPTY_OBJ;
		let vnodeHook;
		parentComponent && toggleRecurse(parentComponent, false);
		if (vnodeHook = newProps.onVnodeBeforeUpdate) invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
		if (dirs) invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
		parentComponent && toggleRecurse(parentComponent, true);
		if (dynamicChildren && (!n1.dynamicChildren || n1.dynamicChildren.length !== dynamicChildren.length)) {
			patchFlag = 0;
			optimized = false;
			dynamicChildren = null;
		}
		if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) hostSetElementText(el, "");
		if (dynamicChildren) patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, resolveChildrenNamespace(n2, namespace), slotScopeIds);
		else if (!optimized) patchChildren(n1, n2, el, null, parentComponent, parentSuspense, resolveChildrenNamespace(n2, namespace), slotScopeIds, false);
		if (patchFlag > 0) {
			if (patchFlag & 16) patchProps(el, oldProps, newProps, parentComponent, namespace);
			else {
				if (patchFlag & 2) {
					if (oldProps.class !== newProps.class) hostPatchProp(el, "class", null, newProps.class, namespace);
				}
				if (patchFlag & 4) hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
				if (patchFlag & 8) {
					const propsToUpdate = n2.dynamicProps;
					for (let i = 0; i < propsToUpdate.length; i++) {
						const key = propsToUpdate[i];
						const prev = oldProps[key];
						const next = newProps[key];
						if (next !== prev || key === "value") hostPatchProp(el, key, prev, next, namespace, parentComponent);
					}
				}
			}
			if (patchFlag & 1) {
				if (n1.children !== n2.children) hostSetElementText(el, n2.children);
			}
		} else if (!optimized && dynamicChildren == null) patchProps(el, oldProps, newProps, parentComponent, namespace);
		if ((vnodeHook = newProps.onVnodeUpdated) || dirs) queuePostRenderEffect(() => {
			vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
			dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
		}, parentSuspense);
	};
	const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
		for (let i = 0; i < newChildren.length; i++) {
			const oldVNode = oldChildren[i];
			const newVNode = newChildren[i];
			const container = oldVNode.el && (oldVNode.type === Fragment || !isSameVNodeType(oldVNode, newVNode) || oldVNode.shapeFlag & 198) ? hostParentNode(oldVNode.el) : fallbackContainer;
			patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, true);
		}
	};
	const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
		if (oldProps !== newProps) {
			if (oldProps !== EMPTY_OBJ) {
				for (const key in oldProps) if (!isReservedProp(key) && !(key in newProps)) hostPatchProp(el, key, oldProps[key], null, namespace, parentComponent);
			}
			for (const key in newProps) {
				if (isReservedProp(key)) continue;
				const next = newProps[key];
				const prev = oldProps[key];
				if (next !== prev && key !== "value") hostPatchProp(el, key, prev, next, namespace, parentComponent);
			}
			if ("value" in newProps) hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
		}
	};
	const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
		const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
		let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
		if (fragmentSlotScopeIds) slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
		if (n1 == null) {
			hostInsert(fragmentStartAnchor, container, anchor);
			hostInsert(fragmentEndAnchor, container, anchor);
			mountChildren(n2.children || [], container, fragmentEndAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		} else if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && n1.dynamicChildren && n1.dynamicChildren.length === dynamicChildren.length) {
			patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, namespace, slotScopeIds);
			if (n2.key != null || parentComponent && n2 === parentComponent.subTree) traverseStaticChildren(n1, n2, true);
		} else patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
	};
	const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		n2.slotScopeIds = slotScopeIds;
		if (n1 == null) if (n2.shapeFlag & 512) parentComponent.ctx.activate(n2, container, anchor, namespace, optimized);
		else mountComponent(n2, container, anchor, parentComponent, parentSuspense, namespace, optimized);
		else updateComponent(n1, n2, optimized);
	};
	const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
		const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
		if (isKeepAlive(initialVNode)) instance.ctx.renderer = internals;
		setupComponent(instance, false, optimized);
		if (instance.asyncDep) {
			parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
			if (!initialVNode.el) {
				const placeholder = instance.subTree = createVNode(Comment);
				processCommentNode(null, placeholder, container, anchor);
				initialVNode.placeholder = placeholder.el;
			}
		} else setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, namespace, optimized);
	};
	const updateComponent = (n1, n2, optimized) => {
		const instance = n2.component = n1.component;
		if (shouldUpdateComponent(n1, n2, optimized)) if (instance.asyncDep && !instance.asyncResolved) {
			updateComponentPreRender(instance, n2, optimized);
			return;
		} else {
			instance.next = n2;
			instance.update();
		}
		else {
			n2.el = n1.el;
			instance.vnode = n2;
		}
	};
	const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
		const componentUpdateFn = () => {
			if (!instance.isMounted) {
				let vnodeHook;
				const { el, props } = initialVNode;
				const { bm, m, parent, root, type } = instance;
				const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
				toggleRecurse(instance, false);
				if (bm) invokeArrayFns(bm);
				if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) invokeVNodeHook(vnodeHook, parent, initialVNode);
				toggleRecurse(instance, true);
				if (el && hydrateNode) {
					const hydrateSubTree = () => {
						instance.subTree = renderComponentRoot(instance);
						hydrateNode(el, instance.subTree, instance, parentSuspense, null);
					};
					if (isAsyncWrapperVNode && type.__asyncHydrate) type.__asyncHydrate(el, instance, hydrateSubTree);
					else hydrateSubTree();
				} else {
					if (root.ce && root.ce._hasShadowRoot()) root.ce._injectChildStyle(type, instance.parent ? instance.parent.type : void 0);
					const subTree = instance.subTree = renderComponentRoot(instance);
					patch(null, subTree, container, anchor, instance, parentSuspense, namespace);
					initialVNode.el = subTree.el;
				}
				if (m) queuePostRenderEffect(m, parentSuspense);
				if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
					const scopedInitialVNode = initialVNode;
					queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
				}
				if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) instance.a && queuePostRenderEffect(instance.a, parentSuspense);
				instance.isMounted = true;
				initialVNode = container = anchor = null;
			} else {
				let { next, bu, u, parent, vnode } = instance;
				{
					const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
					if (nonHydratedAsyncRoot) {
						if (next) {
							next.el = vnode.el;
							updateComponentPreRender(instance, next, optimized);
						}
						nonHydratedAsyncRoot.asyncDep.then(() => {
							queuePostRenderEffect(() => {
								if (!instance.isUnmounted) update();
							}, parentSuspense);
						});
						return;
					}
				}
				let originNext = next;
				let vnodeHook;
				toggleRecurse(instance, false);
				if (next) {
					next.el = vnode.el;
					updateComponentPreRender(instance, next, optimized);
				} else next = vnode;
				if (bu) invokeArrayFns(bu);
				if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) invokeVNodeHook(vnodeHook, parent, next, vnode);
				toggleRecurse(instance, true);
				const nextTree = renderComponentRoot(instance);
				const prevTree = instance.subTree;
				instance.subTree = nextTree;
				patch(prevTree, nextTree, hostParentNode(prevTree.el), getNextHostNode(prevTree), instance, parentSuspense, namespace);
				next.el = nextTree.el;
				if (originNext === null) updateHOCHostEl(instance, nextTree.el);
				if (u) queuePostRenderEffect(u, parentSuspense);
				if (vnodeHook = next.props && next.props.onVnodeUpdated) queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
			}
		};
		instance.scope.on();
		const effect = instance.effect = new ReactiveEffect(componentUpdateFn);
		instance.scope.off();
		const update = instance.update = effect.run.bind(effect);
		const job = instance.job = effect.runIfDirty.bind(effect);
		job.i = instance;
		job.id = instance.uid;
		effect.scheduler = () => queueJob(job);
		toggleRecurse(instance, true);
		update();
	};
	const updateComponentPreRender = (instance, nextVNode, optimized) => {
		nextVNode.component = instance;
		const prevProps = instance.vnode.props;
		instance.vnode = nextVNode;
		instance.next = null;
		updateProps(instance, nextVNode.props, prevProps, optimized);
		updateSlots(instance, nextVNode.children, optimized);
		pauseTracking();
		flushPreFlushCbs(instance);
		resetTracking();
	};
	const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
		const c1 = n1 && n1.children;
		const prevShapeFlag = n1 ? n1.shapeFlag : 0;
		const c2 = n2.children;
		const { patchFlag, shapeFlag } = n2;
		if (patchFlag > 0) {
			if (patchFlag & 128) {
				patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				return;
			} else if (patchFlag & 256) {
				patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				return;
			}
		}
		if (shapeFlag & 8) {
			if (prevShapeFlag & 16) unmountChildren(c1, parentComponent, parentSuspense);
			if (c2 !== c1) hostSetElementText(container, c2);
		} else if (prevShapeFlag & 16) if (shapeFlag & 16) patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		else unmountChildren(c1, parentComponent, parentSuspense, true);
		else {
			if (prevShapeFlag & 8) hostSetElementText(container, "");
			if (shapeFlag & 16) mountChildren(c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		}
	};
	const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		c1 = c1 || EMPTY_ARR;
		c2 = c2 || EMPTY_ARR;
		const oldLength = c1.length;
		const newLength = c2.length;
		const commonLength = Math.min(oldLength, newLength);
		let i;
		for (i = 0; i < commonLength; i++) {
			const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
			patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		}
		if (oldLength > newLength) unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
		else mountChildren(c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, commonLength);
	};
	const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		let i = 0;
		const l2 = c2.length;
		let e1 = c1.length - 1;
		let e2 = l2 - 1;
		while (i <= e1 && i <= e2) {
			const n1 = c1[i];
			const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
			if (isSameVNodeType(n1, n2)) patch(n1, n2, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else break;
			i++;
		}
		while (i <= e1 && i <= e2) {
			const n1 = c1[e1];
			const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
			if (isSameVNodeType(n1, n2)) patch(n1, n2, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else break;
			e1--;
			e2--;
		}
		if (i > e1) {
			if (i <= e2) {
				const nextPos = e2 + 1;
				const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
				while (i <= e2) {
					patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
					i++;
				}
			}
		} else if (i > e2) while (i <= e1) {
			unmount(c1[i], parentComponent, parentSuspense, true);
			i++;
		}
		else {
			const s1 = i;
			const s2 = i;
			const keyToNewIndexMap = /* @__PURE__ */ new Map();
			for (i = s2; i <= e2; i++) {
				const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
				if (nextChild.key != null) keyToNewIndexMap.set(nextChild.key, i);
			}
			let j;
			let patched = 0;
			const toBePatched = e2 - s2 + 1;
			let moved = false;
			let maxNewIndexSoFar = 0;
			const newIndexToOldIndexMap = new Array(toBePatched);
			for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
			for (i = s1; i <= e1; i++) {
				const prevChild = c1[i];
				if (patched >= toBePatched) {
					unmount(prevChild, parentComponent, parentSuspense, true);
					continue;
				}
				let newIndex;
				if (prevChild.key != null) newIndex = keyToNewIndexMap.get(prevChild.key);
				else for (j = s2; j <= e2; j++) if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
					newIndex = j;
					break;
				}
				if (newIndex === void 0) unmount(prevChild, parentComponent, parentSuspense, true);
				else {
					newIndexToOldIndexMap[newIndex - s2] = i + 1;
					if (newIndex >= maxNewIndexSoFar) maxNewIndexSoFar = newIndex;
					else moved = true;
					patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
					patched++;
				}
			}
			const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
			j = increasingNewIndexSequence.length - 1;
			for (i = toBePatched - 1; i >= 0; i--) {
				const nextIndex = s2 + i;
				const nextChild = c2[nextIndex];
				const anchorVNode = c2[nextIndex + 1];
				const anchor = nextIndex + 1 < l2 ? anchorVNode.el || resolveAsyncComponentPlaceholder(anchorVNode) : parentAnchor;
				if (newIndexToOldIndexMap[i] === 0) patch(null, nextChild, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				else if (moved) if (j < 0 || i !== increasingNewIndexSequence[j]) move(nextChild, container, anchor, 2);
				else j--;
			}
		}
	};
	const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
		const { el, type, transition, children, shapeFlag } = vnode;
		if (shapeFlag & 6) {
			move(vnode.component.subTree, container, anchor, moveType);
			return;
		}
		if (shapeFlag & 128) {
			vnode.suspense.move(container, anchor, moveType);
			return;
		}
		if (shapeFlag & 64) {
			type.move(vnode, container, anchor, internals);
			return;
		}
		if (type === Fragment) {
			hostInsert(el, container, anchor);
			for (let i = 0; i < children.length; i++) move(children[i], container, anchor, moveType);
			hostInsert(vnode.anchor, container, anchor);
			return;
		}
		if (type === Static) {
			moveStaticNode(vnode, container, anchor);
			return;
		}
		if (moveType !== 2 && shapeFlag & 1 && transition) if (moveType === 0) if (transition.persisted && !el[leaveCbKey]) hostInsert(el, container, anchor);
		else {
			transition.beforeEnter(el);
			hostInsert(el, container, anchor);
			queuePostRenderEffect(() => transition.enter(el), parentSuspense);
		}
		else {
			const { leave, delayLeave, afterLeave } = transition;
			const remove2 = () => {
				if (vnode.ctx.isUnmounted) hostRemove(el);
				else hostInsert(el, container, anchor);
			};
			const performLeave = () => {
				const wasLeaving = el._isLeaving || !!el[leaveCbKey];
				if (el._isLeaving) el[leaveCbKey](true);
				if (transition.persisted && !wasLeaving) remove2();
				else leave(el, () => {
					remove2();
					afterLeave && afterLeave();
				});
			};
			if (delayLeave) delayLeave(el, remove2, performLeave);
			else performLeave();
		}
		else hostInsert(el, container, anchor);
	};
	const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
		const { type, props, ref, children, dynamicChildren, shapeFlag, patchFlag, dirs, cacheIndex, memo } = vnode;
		if (patchFlag === -2) optimized = false;
		if (ref != null) {
			pauseTracking();
			setRef(ref, null, parentSuspense, vnode, true);
			resetTracking();
		}
		if (cacheIndex != null) parentComponent.renderCache[cacheIndex] = void 0;
		if (shapeFlag & 256) {
			parentComponent.ctx.deactivate(vnode);
			return;
		}
		const shouldInvokeDirs = shapeFlag & 1 && dirs;
		const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
		let vnodeHook;
		if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) invokeVNodeHook(vnodeHook, parentComponent, vnode);
		if (shapeFlag & 6) unmountComponent(vnode.component, parentSuspense, doRemove);
		else {
			if (shapeFlag & 128) {
				vnode.suspense.unmount(parentSuspense, doRemove);
				return;
			}
			if (shouldInvokeDirs) invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
			if (shapeFlag & 64) vnode.type.remove(vnode, parentComponent, parentSuspense, internals, doRemove);
			else if (dynamicChildren && !dynamicChildren.hasOnce && (type !== Fragment || patchFlag > 0 && patchFlag & 64)) unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
			else if (type === Fragment && patchFlag & 384 || !optimized && shapeFlag & 16) unmountChildren(children, parentComponent, parentSuspense);
			if (doRemove) remove(vnode);
		}
		const shouldInvalidateMemo = memo != null && cacheIndex == null;
		if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs || shouldInvalidateMemo) queuePostRenderEffect(() => {
			vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
			shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
			if (shouldInvalidateMemo) vnode.el = null;
		}, parentSuspense);
	};
	const remove = (vnode) => {
		const { type, el, anchor, transition } = vnode;
		if (type === Fragment) {
			removeFragment(el, anchor);
			return;
		}
		if (type === Static) {
			removeStaticNode(vnode);
			return;
		}
		const performRemove = () => {
			hostRemove(el);
			if (transition && !transition.persisted && transition.afterLeave) transition.afterLeave();
		};
		if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
			const { leave, delayLeave } = transition;
			const performLeave = () => leave(el, performRemove);
			if (delayLeave) delayLeave(vnode.el, performRemove, performLeave);
			else performLeave();
		} else performRemove();
	};
	const removeFragment = (cur, end) => {
		let next;
		while (cur !== end) {
			next = hostNextSibling(cur);
			hostRemove(cur);
			cur = next;
		}
		hostRemove(end);
	};
	const unmountComponent = (instance, parentSuspense, doRemove) => {
		const { bum, scope, job, subTree, um, m, a } = instance;
		invalidateMount(m);
		invalidateMount(a);
		if (bum) invokeArrayFns(bum);
		scope.stop();
		if (job) {
			job.flags |= 8;
			unmount(subTree, instance, parentSuspense, doRemove);
		}
		if (um) queuePostRenderEffect(um, parentSuspense);
		queuePostRenderEffect(() => {
			instance.isUnmounted = true;
		}, parentSuspense);
	};
	const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
		for (let i = start; i < children.length; i++) unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
	};
	const getNextHostNode = (vnode) => {
		if (vnode.shapeFlag & 6) return getNextHostNode(vnode.component.subTree);
		if (vnode.shapeFlag & 128) return vnode.suspense.next();
		const el = hostNextSibling(vnode.anchor || vnode.el);
		const teleportEnd = el && el[TeleportEndKey];
		return teleportEnd ? hostNextSibling(teleportEnd) : el;
	};
	let isFlushing = false;
	const render = (vnode, container, namespace) => {
		let instance;
		if (vnode == null) {
			if (container._vnode) {
				unmount(container._vnode, null, null, true);
				instance = container._vnode.component;
			}
		} else patch(container._vnode || null, vnode, container, null, null, null, namespace);
		container._vnode = vnode;
		if (!isFlushing) {
			isFlushing = true;
			flushPreFlushCbs(instance);
			flushPostFlushCbs();
			isFlushing = false;
		}
	};
	const internals = {
		p: patch,
		um: unmount,
		m: move,
		r: remove,
		mt: mountComponent,
		mc: mountChildren,
		pc: patchChildren,
		pbc: patchBlockChildren,
		n: getNextHostNode,
		o: options
	};
	let hydrate;
	let hydrateNode;
	if (createHydrationFns) [hydrate, hydrateNode] = createHydrationFns(internals);
	return {
		render,
		hydrate,
		createApp: createAppAPI(render, hydrate)
	};
}
function resolveChildrenNamespace({ type, props }, currentNamespace) {
	return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
}
function toggleRecurse({ effect, job }, allowed) {
	if (allowed) {
		effect.flags |= 32;
		job.flags |= 4;
	} else {
		effect.flags &= -33;
		job.flags &= -5;
	}
}
function needTransition(parentSuspense, transition) {
	return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
}
function traverseStaticChildren(n1, n2, shallow = false) {
	const ch1 = n1.children;
	const ch2 = n2.children;
	if (isArray$1(ch1) && isArray$1(ch2)) for (let i = 0; i < ch1.length; i++) {
		const c1 = ch1[i];
		let c2 = ch2[i];
		if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
			if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
				c2 = ch2[i] = cloneIfMounted(ch2[i]);
				c2.el = c1.el;
			}
			if (!shallow && c2.patchFlag !== -2) traverseStaticChildren(c1, c2);
		}
		if (c2.type === Text) {
			if (c2.patchFlag === -1) c2 = ch2[i] = cloneIfMounted(c2);
			c2.el = c1.el;
		}
		if (c2.type === Comment && !c2.el) c2.el = c1.el;
	}
}
function getSequence(arr) {
	const p = arr.slice();
	const result = [0];
	let i, j, u, v, c;
	const len = arr.length;
	for (i = 0; i < len; i++) {
		const arrI = arr[i];
		if (arrI !== 0) {
			j = result[result.length - 1];
			if (arr[j] < arrI) {
				p[i] = j;
				result.push(i);
				continue;
			}
			u = 0;
			v = result.length - 1;
			while (u < v) {
				c = u + v >> 1;
				if (arr[result[c]] < arrI) u = c + 1;
				else v = c;
			}
			if (arrI < arr[result[u]]) {
				if (u > 0) p[i] = result[u - 1];
				result[u] = i;
			}
		}
	}
	u = result.length;
	v = result[u - 1];
	while (u-- > 0) {
		result[u] = v;
		v = p[v];
	}
	return result;
}
function locateNonHydratedAsyncRoot(instance) {
	const subComponent = instance.subTree.component;
	if (subComponent) if (subComponent.asyncDep && !subComponent.asyncResolved) return subComponent;
	else return locateNonHydratedAsyncRoot(subComponent);
}
function invalidateMount(hooks) {
	if (hooks) for (let i = 0; i < hooks.length; i++) hooks[i].flags |= 8;
}
function resolveAsyncComponentPlaceholder(anchorVnode) {
	if (anchorVnode.placeholder) return anchorVnode.placeholder;
	const instance = anchorVnode.component;
	if (instance) return resolveAsyncComponentPlaceholder(instance.subTree);
	return null;
}
var isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
	if (suspense && suspense.pendingBranch) if (isArray$1(fn)) suspense.effects.push(...fn);
	else suspense.effects.push(fn);
	else queuePostFlushCb(fn);
}
var Fragment = /* @__PURE__ */ Symbol.for("v-fgt");
var Text = /* @__PURE__ */ Symbol.for("v-txt");
var Comment = /* @__PURE__ */ Symbol.for("v-cmt");
var Static = /* @__PURE__ */ Symbol.for("v-stc");
var blockStack = [];
var currentBlock = null;
function openBlock(disableTracking = false) {
	blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
	blockStack.pop();
	currentBlock = blockStack[blockStack.length - 1] || null;
}
var isBlockTreeEnabled = 1;
function setBlockTracking(value, inVOnce = false) {
	isBlockTreeEnabled += value;
	if (value < 0 && currentBlock && inVOnce) currentBlock.hasOnce = true;
}
function setupBlock(vnode) {
	vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
	closeBlock();
	if (isBlockTreeEnabled > 0 && currentBlock) currentBlock.push(vnode);
	return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
	return setupBlock(createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, true));
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
	return setupBlock(createVNode(type, props, children, patchFlag, dynamicProps, true));
}
function isVNode(value) {
	return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
	return n1.type === n2.type && n1.key === n2.key;
}
var normalizeKey = ({ key }) => key != null ? key : null;
var normalizeRef = ({ ref, ref_key, ref_for }) => {
	if (typeof ref === "number") ref = "" + ref;
	return ref != null ? isString(ref) || /* @__PURE__ */ isRef(ref) || isFunction$1(ref) ? {
		i: currentRenderingInstance,
		r: ref,
		k: ref_key,
		f: !!ref_for
	} : ref : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
	const vnode = {
		__v_isVNode: true,
		__v_skip: true,
		type,
		props,
		key: props && normalizeKey(props),
		ref: props && normalizeRef(props),
		scopeId: currentScopeId,
		slotScopeIds: null,
		children,
		component: null,
		suspense: null,
		ssContent: null,
		ssFallback: null,
		dirs: null,
		transition: null,
		el: null,
		anchor: null,
		target: null,
		targetStart: null,
		targetAnchor: null,
		staticCount: 0,
		shapeFlag,
		patchFlag,
		dynamicProps,
		dynamicChildren: null,
		appContext: null,
		ctx: currentRenderingInstance
	};
	if (needFullChildrenNormalization) {
		normalizeChildren(vnode, children);
		if (shapeFlag & 128) type.normalize(vnode);
	} else if (children) vnode.shapeFlag |= isString(children) ? 8 : 16;
	if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6) && vnode.patchFlag !== 32) currentBlock.push(vnode);
	return vnode;
}
var createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
	if (!type || type === NULL_DYNAMIC_COMPONENT) type = Comment;
	if (isVNode(type)) {
		const cloned = cloneVNode(type, props, true);
		if (children) normalizeChildren(cloned, children);
		if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) if (cloned.shapeFlag & 6) currentBlock[currentBlock.indexOf(type)] = cloned;
		else currentBlock.push(cloned);
		cloned.patchFlag = -2;
		return cloned;
	}
	if (isClassComponent(type)) type = type.__vccOpts;
	if (props) {
		props = guardReactiveProps(props);
		let { class: klass, style } = props;
		if (klass && !isString(klass)) props.class = normalizeClass(klass);
		if (isObject$2(style)) {
			if (/* @__PURE__ */ isProxy(style) && !isArray$1(style)) style = extend({}, style);
			props.style = normalizeStyle(style);
		}
	}
	const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$2(type) ? 4 : isFunction$1(type) ? 2 : 0;
	return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
}
function guardReactiveProps(props) {
	if (!props) return null;
	return /* @__PURE__ */ isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
	const { props, ref, patchFlag, children, transition } = vnode;
	const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
	const cloned = {
		__v_isVNode: true,
		__v_skip: true,
		type: vnode.type,
		props: mergedProps,
		key: mergedProps && normalizeKey(mergedProps),
		ref: extraProps && extraProps.ref ? mergeRef && ref ? isArray$1(ref) ? ref.concat(normalizeRef(extraProps)) : [ref, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref,
		scopeId: vnode.scopeId,
		slotScopeIds: vnode.slotScopeIds,
		children,
		target: vnode.target,
		targetStart: vnode.targetStart,
		targetAnchor: vnode.targetAnchor,
		staticCount: vnode.staticCount,
		shapeFlag: vnode.shapeFlag,
		patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
		dynamicProps: vnode.dynamicProps,
		dynamicChildren: vnode.dynamicChildren,
		appContext: vnode.appContext,
		dirs: vnode.dirs,
		transition,
		component: vnode.component,
		suspense: vnode.suspense,
		ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
		ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
		placeholder: vnode.placeholder,
		el: vnode.el,
		anchor: vnode.anchor,
		ctx: vnode.ctx,
		ce: vnode.ce
	};
	if (transition && cloneTransition) setTransitionHooks(cloned, transition.clone(cloned));
	return cloned;
}
function createTextVNode(text = " ", flag = 0) {
	return createVNode(Text, null, text, flag);
}
function createCommentVNode(text = "", asBlock = false) {
	return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
	if (child == null || typeof child === "boolean") return createVNode(Comment);
	else if (isArray$1(child)) return createVNode(Fragment, null, child.slice());
	else if (isVNode(child)) return cloneIfMounted(child);
	else return createVNode(Text, null, String(child));
}
function cloneIfMounted(child) {
	return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
	let type = 0;
	const { shapeFlag } = vnode;
	if (children == null) children = null;
	else if (isArray$1(children)) type = 16;
	else if (typeof children === "object") if (shapeFlag & 65) {
		const slot = children.default;
		if (slot) {
			slot._c && (slot._d = false);
			normalizeChildren(vnode, slot());
			slot._c && (slot._d = true);
		}
		return;
	} else {
		type = 32;
		const slotFlag = children._;
		if (!slotFlag && !isInternalObject(children)) children._ctx = currentRenderingInstance;
		else if (slotFlag === 3 && currentRenderingInstance) if (currentRenderingInstance.slots._ === 1) children._ = 1;
		else {
			children._ = 2;
			vnode.patchFlag |= 1024;
		}
	}
	else if (isFunction$1(children)) {
		if (shapeFlag & 65) {
			normalizeChildren(vnode, { default: children });
			return;
		}
		children = {
			default: children,
			_ctx: currentRenderingInstance
		};
		type = 32;
	} else {
		children = String(children);
		if (shapeFlag & 64) {
			type = 16;
			children = [createTextVNode(children)];
		} else type = 8;
	}
	vnode.children = children;
	vnode.shapeFlag |= type;
}
function mergeProps(...args) {
	const ret = {};
	for (let i = 0; i < args.length; i++) {
		const toMerge = args[i];
		for (const key in toMerge) if (key === "class") {
			if (ret.class !== toMerge.class) ret.class = normalizeClass([ret.class, toMerge.class]);
		} else if (key === "style") ret.style = normalizeStyle([ret.style, toMerge.style]);
		else if (isOn(key)) {
			const existing = ret[key];
			const incoming = toMerge[key];
			if (incoming && existing !== incoming && !(isArray$1(existing) && existing.includes(incoming))) ret[key] = existing ? [].concat(existing, incoming) : incoming;
			else if (incoming == null && existing == null && !isModelListener(key)) ret[key] = incoming;
		} else if (key !== "") ret[key] = toMerge[key];
	}
	return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
	callWithAsyncErrorHandling(hook, instance, 7, [vnode, prevVNode]);
}
var emptyAppContext = createAppContext();
var uid = 0;
function createComponentInstance(vnode, parent, suspense) {
	const type = vnode.type;
	const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
	const instance = {
		uid: uid++,
		vnode,
		type,
		parent,
		appContext,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new EffectScope(true),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: parent ? parent.provides : Object.create(appContext.provides),
		ids: parent ? parent.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: normalizePropsOptions(type, appContext),
		emitsOptions: normalizeEmitsOptions(type, appContext),
		emit: null,
		emitted: null,
		propsDefaults: EMPTY_OBJ,
		inheritAttrs: type.inheritAttrs,
		ctx: EMPTY_OBJ,
		data: EMPTY_OBJ,
		props: EMPTY_OBJ,
		attrs: EMPTY_OBJ,
		slots: EMPTY_OBJ,
		refs: EMPTY_OBJ,
		setupState: EMPTY_OBJ,
		setupContext: null,
		suspense,
		suspenseId: suspense ? suspense.pendingId : 0,
		asyncDep: null,
		asyncResolved: false,
		isMounted: false,
		isUnmounted: false,
		isDeactivated: false,
		bc: null,
		c: null,
		bm: null,
		m: null,
		bu: null,
		u: null,
		um: null,
		bum: null,
		da: null,
		a: null,
		rtg: null,
		rtc: null,
		ec: null,
		sp: null
	};
	instance.ctx = { _: instance };
	instance.root = parent ? parent.root : instance;
	instance.emit = emit.bind(null, instance);
	if (vnode.ce) vnode.ce(instance);
	return instance;
}
var currentInstance = null;
var getCurrentInstance = () => currentInstance || currentRenderingInstance;
var internalSetCurrentInstance;
var setInSSRSetupState;
{
	const g = getGlobalThis();
	const registerGlobalSetter = (key, setter) => {
		let setters;
		if (!(setters = g[key])) setters = g[key] = [];
		setters.push(setter);
		return (v) => {
			if (setters.length > 1) setters.forEach((set) => set(v));
			else setters[0](v);
		};
	};
	internalSetCurrentInstance = registerGlobalSetter(`__VUE_INSTANCE_SETTERS__`, (v) => currentInstance = v);
	setInSSRSetupState = registerGlobalSetter(`__VUE_SSR_SETTERS__`, (v) => isInSSRComponentSetup = v);
}
var setCurrentInstance = (instance) => {
	const prev = currentInstance;
	internalSetCurrentInstance(instance);
	instance.scope.on();
	return () => {
		instance.scope.off();
		internalSetCurrentInstance(prev);
	};
};
var unsetCurrentInstance = () => {
	currentInstance && currentInstance.scope.off();
	internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
	return instance.vnode.shapeFlag & 4;
}
var isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false, optimized = false) {
	isSSR && setInSSRSetupState(isSSR);
	const { props, children } = instance.vnode;
	const isStateful = isStatefulComponent(instance);
	initProps(instance, props, isStateful, isSSR);
	initSlots(instance, children, optimized || isSSR);
	const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
	isSSR && setInSSRSetupState(false);
	return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
	const Component = instance.type;
	instance.accessCache = /* @__PURE__ */ Object.create(null);
	instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
	const { setup } = Component;
	if (setup) {
		pauseTracking();
		const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
		const reset = setCurrentInstance(instance);
		const setupResult = callWithErrorHandling(setup, instance, 0, [instance.props, setupContext]);
		const isAsyncSetup = isPromise(setupResult);
		resetTracking();
		reset();
		if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) markAsyncBoundary(instance);
		if (isAsyncSetup) {
			setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
			if (isSSR) return setupResult.then((resolvedResult) => {
				handleSetupResult(instance, resolvedResult, isSSR);
			}).catch((e) => {
				handleError(e, instance, 0);
			});
			else instance.asyncDep = setupResult;
		} else handleSetupResult(instance, setupResult, isSSR);
	} else finishComponentSetup(instance, isSSR);
}
function handleSetupResult(instance, setupResult, isSSR) {
	if (isFunction$1(setupResult)) if (instance.type.__ssrInlineRender) instance.ssrRender = setupResult;
	else instance.render = setupResult;
	else if (isObject$2(setupResult)) instance.setupState = proxyRefs(setupResult);
	finishComponentSetup(instance, isSSR);
}
var compile;
var installWithProxy;
function finishComponentSetup(instance, isSSR, skipOptions) {
	const Component = instance.type;
	if (!instance.render) {
		if (!isSSR && compile && !Component.render) {
			const template = Component.template || resolveMergedOptions(instance).template;
			if (template) {
				const { isCustomElement, compilerOptions } = instance.appContext.config;
				const { delimiters, compilerOptions: componentCompilerOptions } = Component;
				Component.render = compile(template, extend(extend({
					isCustomElement,
					delimiters
				}, compilerOptions), componentCompilerOptions));
			}
		}
		instance.render = Component.render || NOOP;
		if (installWithProxy) installWithProxy(instance);
	}
	{
		const reset = setCurrentInstance(instance);
		pauseTracking();
		try {
			applyOptions(instance);
		} finally {
			resetTracking();
			reset();
		}
	}
}
var attrsProxyHandlers = { get(target, key) {
	track(target, "get", "");
	return target[key];
} };
function createSetupContext(instance) {
	const expose = (exposed) => {
		instance.exposed = exposed || {};
	};
	return {
		attrs: new Proxy(instance.attrs, attrsProxyHandlers),
		slots: instance.slots,
		emit: instance.emit,
		expose
	};
}
function getComponentPublicInstance(instance) {
	if (instance.exposed) return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
		get(target, key) {
			if (key in target) return target[key];
			else if (key in publicPropertiesMap) return publicPropertiesMap[key](instance);
		},
		has(target, key) {
			return key in target || key in publicPropertiesMap;
		}
	}));
	else return instance.proxy;
}
function getComponentName(Component, includeInferred = true) {
	return isFunction$1(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function isClassComponent(value) {
	return isFunction$1(value) && "__vccOpts" in value;
}
var computed = (getterOrOptions, debugOptions) => {
	return /* @__PURE__ */ computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
function h$1(type, propsOrChildren, children) {
	try {
		setBlockTracking(-1);
		const l = arguments.length;
		if (l === 2) if (isObject$2(propsOrChildren) && !isArray$1(propsOrChildren)) {
			if (isVNode(propsOrChildren)) return createVNode(type, null, [propsOrChildren]);
			return createVNode(type, propsOrChildren);
		} else return createVNode(type, null, propsOrChildren);
		else {
			if (l > 3) children = Array.prototype.slice.call(arguments, 2);
			else if (l === 3 && isVNode(children)) children = [children];
			return createVNode(type, propsOrChildren, children);
		}
	} finally {
		setBlockTracking(1);
	}
}
var version = "3.5.40";
var warn = NOOP;
//#endregion
//#region node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
/**
* @vue/runtime-dom v3.5.40
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
var policy = void 0;
var tt$1 = typeof window !== "undefined" && window.trustedTypes;
if (tt$1) try {
	policy = /* @__PURE__ */ tt$1.createPolicy("vue", { createHTML: (val) => val });
} catch (e) {}
var unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
var svgNS = "http://www.w3.org/2000/svg";
var mathmlNS = "http://www.w3.org/1998/Math/MathML";
var doc = typeof document !== "undefined" ? document : null;
var templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
var nodeOps = {
	insert: (child, parent, anchor) => {
		parent.insertBefore(child, anchor || null);
	},
	remove: (child) => {
		const parent = child.parentNode;
		if (parent) parent.removeChild(child);
	},
	createElement: (tag, namespace, is, props) => {
		const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
		if (tag === "select" && props && props.multiple != null) el.setAttribute("multiple", props.multiple);
		return el;
	},
	createText: (text) => doc.createTextNode(text),
	createComment: (text) => doc.createComment(text),
	setText: (node, text) => {
		node.nodeValue = text;
	},
	setElementText: (el, text) => {
		el.textContent = text;
	},
	parentNode: (node) => node.parentNode,
	nextSibling: (node) => node.nextSibling,
	querySelector: (selector) => doc.querySelector(selector),
	setScopeId(el, id) {
		el.setAttribute(id, "");
	},
	insertStaticContent(content, parent, anchor, namespace, start, end) {
		const before = anchor ? anchor.previousSibling : parent.lastChild;
		if (start && (start === end || start.nextSibling)) while (true) {
			parent.insertBefore(start.cloneNode(true), anchor);
			if (start === end || !(start = start.nextSibling)) break;
		}
		else {
			templateContainer.innerHTML = unsafeToTrustedHTML(namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content);
			const template = templateContainer.content;
			if (namespace === "svg" || namespace === "mathml") {
				const wrapper = template.firstChild;
				while (wrapper.firstChild) template.appendChild(wrapper.firstChild);
				template.removeChild(wrapper);
			}
			parent.insertBefore(template, anchor);
		}
		return [before ? before.nextSibling : parent.firstChild, anchor ? anchor.previousSibling : parent.lastChild];
	}
};
var TRANSITION = "transition";
var ANIMATION = "animation";
var vtcKey = /* @__PURE__ */ Symbol("_vtc");
var DOMTransitionPropsValidators = {
	name: String,
	type: String,
	css: {
		type: Boolean,
		default: true
	},
	duration: [
		String,
		Number,
		Object
	],
	enterFromClass: String,
	enterActiveClass: String,
	enterToClass: String,
	appearFromClass: String,
	appearActiveClass: String,
	appearToClass: String,
	leaveFromClass: String,
	leaveActiveClass: String,
	leaveToClass: String
};
var TransitionPropsValidators = /* @__PURE__ */ extend({}, BaseTransitionPropsValidators, DOMTransitionPropsValidators);
var decorate$1 = (t) => {
	t.displayName = "Transition";
	t.props = TransitionPropsValidators;
	return t;
};
var Transition = /* @__PURE__ */ decorate$1((props, { slots }) => h$1(BaseTransition, resolveTransitionProps(props), slots));
var callHook = (hook, args = []) => {
	if (isArray$1(hook)) hook.forEach((h2) => h2(...args));
	else if (hook) hook(...args);
};
var hasExplicitCallback = (hook) => {
	return hook ? isArray$1(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
};
function resolveTransitionProps(rawProps) {
	const baseProps = {};
	for (const key in rawProps) if (!(key in DOMTransitionPropsValidators)) baseProps[key] = rawProps[key];
	if (rawProps.css === false) return baseProps;
	const { name = "v", type, duration, enterFromClass = `${name}-enter-from`, enterActiveClass = `${name}-enter-active`, enterToClass = `${name}-enter-to`, appearFromClass = enterFromClass, appearActiveClass = enterActiveClass, appearToClass = enterToClass, leaveFromClass = `${name}-leave-from`, leaveActiveClass = `${name}-leave-active`, leaveToClass = `${name}-leave-to` } = rawProps;
	const durations = normalizeDuration(duration);
	const enterDuration = durations && durations[0];
	const leaveDuration = durations && durations[1];
	const { onBeforeEnter, onEnter, onEnterCancelled, onLeave, onLeaveCancelled, onBeforeAppear = onBeforeEnter, onAppear = onEnter, onAppearCancelled = onEnterCancelled } = baseProps;
	const finishEnter = (el, isAppear, done, isCancelled) => {
		el._enterCancelled = isCancelled;
		removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
		removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
		done && done();
	};
	const finishLeave = (el, done) => {
		el._isLeaving = false;
		removeTransitionClass(el, leaveFromClass);
		removeTransitionClass(el, leaveToClass);
		removeTransitionClass(el, leaveActiveClass);
		done && done();
	};
	const makeEnterHook = (isAppear) => {
		return (el, done) => {
			const hook = isAppear ? onAppear : onEnter;
			const resolve = () => finishEnter(el, isAppear, done);
			callHook(hook, [el, resolve]);
			nextFrame(() => {
				removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
				addTransitionClass(el, isAppear ? appearToClass : enterToClass);
				if (!hasExplicitCallback(hook)) whenTransitionEnds(el, type, enterDuration, resolve);
			});
		};
	};
	return extend(baseProps, {
		onBeforeEnter(el) {
			callHook(onBeforeEnter, [el]);
			addTransitionClass(el, enterFromClass);
			addTransitionClass(el, enterActiveClass);
		},
		onBeforeAppear(el) {
			callHook(onBeforeAppear, [el]);
			addTransitionClass(el, appearFromClass);
			addTransitionClass(el, appearActiveClass);
		},
		onEnter: makeEnterHook(false),
		onAppear: makeEnterHook(true),
		onLeave(el, done) {
			el._isLeaving = true;
			const resolve = () => finishLeave(el, done);
			addTransitionClass(el, leaveFromClass);
			if (!el._enterCancelled) {
				forceReflow(el);
				addTransitionClass(el, leaveActiveClass);
			} else {
				addTransitionClass(el, leaveActiveClass);
				forceReflow(el);
			}
			nextFrame(() => {
				if (!el._isLeaving) return;
				removeTransitionClass(el, leaveFromClass);
				addTransitionClass(el, leaveToClass);
				if (!hasExplicitCallback(onLeave)) whenTransitionEnds(el, type, leaveDuration, resolve);
			});
			callHook(onLeave, [el, resolve]);
		},
		onEnterCancelled(el) {
			finishEnter(el, false, void 0, true);
			callHook(onEnterCancelled, [el]);
		},
		onAppearCancelled(el) {
			finishEnter(el, true, void 0, true);
			callHook(onAppearCancelled, [el]);
		},
		onLeaveCancelled(el) {
			finishLeave(el);
			callHook(onLeaveCancelled, [el]);
		}
	});
}
function normalizeDuration(duration) {
	if (duration == null) return null;
	else if (isObject$2(duration)) return [NumberOf(duration.enter), NumberOf(duration.leave)];
	else {
		const n = NumberOf(duration);
		return [n, n];
	}
}
function NumberOf(val) {
	return toNumber$1(val);
}
function addTransitionClass(el, cls) {
	cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
	(el[vtcKey] || (el[vtcKey] = /* @__PURE__ */ new Set())).add(cls);
}
function removeTransitionClass(el, cls) {
	cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
	const _vtc = el[vtcKey];
	if (_vtc) {
		_vtc.delete(cls);
		if (!_vtc.size) el[vtcKey] = void 0;
	}
}
function nextFrame(cb) {
	requestAnimationFrame(() => {
		requestAnimationFrame(cb);
	});
}
var endId = 0;
function whenTransitionEnds(el, expectedType, explicitTimeout, resolve) {
	const id = el._endId = ++endId;
	const resolveIfNotStale = () => {
		if (id === el._endId) resolve();
	};
	if (explicitTimeout != null) return setTimeout(resolveIfNotStale, explicitTimeout);
	const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
	if (!type) return resolve();
	const endEvent = type + "end";
	let ended = 0;
	const end = () => {
		el.removeEventListener(endEvent, onEnd);
		resolveIfNotStale();
	};
	const onEnd = (e) => {
		if (e.target === el && ++ended >= propCount) end();
	};
	setTimeout(() => {
		if (ended < propCount) end();
	}, timeout + 1);
	el.addEventListener(endEvent, onEnd);
}
function getTransitionInfo(el, expectedType) {
	const styles = window.getComputedStyle(el);
	const getStyleProperties = (key) => (styles[key] || "").split(", ");
	const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
	const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
	const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
	const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
	const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
	const animationTimeout = getTimeout(animationDelays, animationDurations);
	let type = null;
	let timeout = 0;
	let propCount = 0;
	if (expectedType === TRANSITION) {
		if (transitionTimeout > 0) {
			type = TRANSITION;
			timeout = transitionTimeout;
			propCount = transitionDurations.length;
		}
	} else if (expectedType === ANIMATION) {
		if (animationTimeout > 0) {
			type = ANIMATION;
			timeout = animationTimeout;
			propCount = animationDurations.length;
		}
	} else {
		timeout = Math.max(transitionTimeout, animationTimeout);
		type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
		propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
	}
	const hasTransform = type === TRANSITION && /\b(?:transform|all)(?:,|$)/.test(getStyleProperties(`${TRANSITION}Property`).toString());
	return {
		type,
		timeout,
		propCount,
		hasTransform
	};
}
function getTimeout(delays, durations) {
	while (delays.length < durations.length) delays = delays.concat(delays);
	return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
}
function toMs(s) {
	if (s === "auto") return 0;
	return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
}
function forceReflow(el) {
	return (el ? el.ownerDocument : document).body.offsetHeight;
}
function patchClass(el, value, isSVG) {
	const transitionClasses = el[vtcKey];
	if (transitionClasses) value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
	if (value == null) el.removeAttribute("class");
	else if (isSVG) el.setAttribute("class", value);
	else el.className = value;
}
var vShowOriginalDisplay = /* @__PURE__ */ Symbol("_vod");
var vShowHidden = /* @__PURE__ */ Symbol("_vsh");
var vShow = {
	name: "show",
	beforeMount(el, { value }, { transition }) {
		el[vShowOriginalDisplay] = el.style.display === "none" ? "" : el.style.display;
		if (transition && value) transition.beforeEnter(el);
		else setDisplay(el, value);
	},
	mounted(el, { value }, { transition }) {
		if (transition && value) transition.enter(el);
	},
	updated(el, { value, oldValue }, { transition }) {
		if (!value === !oldValue) return;
		if (transition) if (value) {
			transition.beforeEnter(el);
			setDisplay(el, true);
			transition.enter(el);
		} else transition.leave(el, () => {
			setDisplay(el, false);
		});
		else setDisplay(el, value);
	},
	beforeUnmount(el, { value }) {
		setDisplay(el, value);
	}
};
function setDisplay(el, value) {
	el.style.display = value ? el[vShowOriginalDisplay] : "none";
	el[vShowHidden] = !value;
}
var CSS_VAR_TEXT = /* @__PURE__ */ Symbol("");
var displayRE = /(?:^|;)\s*display\s*:/;
function patchStyle(el, prev, next) {
	const style = el.style;
	const isCssString = isString(next);
	let hasControlledDisplay = false;
	if (next && !isCssString) {
		if (prev) if (!isString(prev)) {
			for (const key in prev) if (next[key] == null) setStyle$1(style, key, "");
		} else for (const prevStyle of prev.split(";")) {
			const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
			if (next[key] == null) setStyle$1(style, key, "");
		}
		for (const key in next) {
			if (key === "display") hasControlledDisplay = true;
			const value = next[key];
			if (value != null) {
				if (!shouldPreserveTextareaResizeStyle(el, key, !isString(prev) && prev ? prev[key] : void 0, value)) setStyle$1(style, key, value);
			} else setStyle$1(style, key, "");
		}
	} else if (isCssString) {
		if (prev !== next) {
			const cssVarText = style[CSS_VAR_TEXT];
			if (cssVarText) next += ";" + cssVarText;
			style.cssText = next;
			hasControlledDisplay = displayRE.test(next);
		}
	} else if (prev) el.removeAttribute("style");
	if (vShowOriginalDisplay in el) {
		el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
		if (el[vShowHidden]) style.display = "none";
	}
}
var importantRE = /\s*!important$/;
function setStyle$1(style, name, val) {
	if (isArray$1(val)) val.forEach((v) => setStyle$1(style, name, v));
	else {
		if (val == null) val = "";
		if (name.startsWith("--")) style.setProperty(name, val);
		else {
			const prefixed = autoPrefix(style, name);
			if (importantRE.test(val)) style.setProperty(hyphenate$1(prefixed), val.replace(importantRE, ""), "important");
			else style[prefixed] = val;
		}
	}
}
var prefixes = [
	"Webkit",
	"Moz",
	"ms"
];
var prefixCache = {};
function autoPrefix(style, rawName) {
	const cached = prefixCache[rawName];
	if (cached) return cached;
	let name = camelize$1(rawName);
	if (name !== "filter" && name in style) return prefixCache[rawName] = name;
	name = capitalize$1(name);
	for (let i = 0; i < prefixes.length; i++) {
		const prefixed = prefixes[i] + name;
		if (prefixed in style) return prefixCache[rawName] = prefixed;
	}
	return rawName;
}
function shouldPreserveTextareaResizeStyle(el, key, prev, next) {
	return el.tagName === "TEXTAREA" && (key === "width" || key === "height") && isString(next) && prev === next;
}
var xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
	if (isSVG && key.startsWith("xlink:")) if (value == null) el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
	else el.setAttributeNS(xlinkNS, key, value);
	else if (value == null || isBoolean && !includeBooleanAttr(value)) el.removeAttribute(key);
	else el.setAttribute(key, isBoolean ? "" : isSymbol$1(value) ? String(value) : value);
}
function patchDOMProp(el, key, value, parentComponent, attrName) {
	if (key === "innerHTML" || key === "textContent") {
		if (value != null) el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
		return;
	}
	const tag = el.tagName;
	if (key === "value" && tag !== "PROGRESS" && !tag.includes("-")) {
		const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
		const newValue = value == null ? el.type === "checkbox" ? "on" : "" : String(value);
		if (oldValue !== newValue || !("_value" in el)) el.value = newValue;
		if (value == null) el.removeAttribute(key);
		el._value = value;
		return;
	}
	let needRemove = false;
	if (value === "" || value == null) {
		const type = typeof el[key];
		if (type === "boolean") value = includeBooleanAttr(value);
		else if (value == null && type === "string") {
			value = "";
			needRemove = true;
		} else if (type === "number") {
			value = 0;
			needRemove = true;
		}
	}
	try {
		el[key] = value;
	} catch (e) {}
	needRemove && el.removeAttribute(attrName || key);
}
function addEventListener(el, event, handler, options) {
	el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
	el.removeEventListener(event, handler, options);
}
var veiKey = /* @__PURE__ */ Symbol("_vei");
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
	const invokers = el[veiKey] || (el[veiKey] = {});
	const existingInvoker = invokers[rawName];
	if (nextValue && existingInvoker) existingInvoker.value = nextValue;
	else {
		const [name, options] = parseName(rawName);
		if (nextValue) addEventListener(el, name, invokers[rawName] = createInvoker(nextValue, instance), options);
		else if (existingInvoker) {
			removeEventListener(el, name, existingInvoker, options);
			invokers[rawName] = void 0;
		}
	}
}
var optionsModifierRE = /(Once|Passive|Capture)$/;
var optionsModifierEventRE = /^on:?(?:Once|Passive|Capture)$/;
function parseName(name) {
	let options;
	let m;
	while ((m = name.match(optionsModifierRE)) && !optionsModifierEventRE.test(name)) {
		if (!options) options = {};
		name = name.slice(0, name.length - m[1].length);
		options[m[1].toLowerCase()] = true;
	}
	return [name[2] === ":" ? name.slice(3) : hyphenate$1(name.slice(2)), options];
}
var cachedNow = 0;
var p$1 = /* @__PURE__ */ Promise.resolve();
var getNow = () => cachedNow || (p$1.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
	const invoker = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= invoker.attached) return;
		const value = invoker.value;
		if (isArray$1(value)) {
			const originalStop = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				originalStop.call(e);
				e._stopped = true;
			};
			const handlers = value.slice();
			const args = [e];
			for (let i = 0; i < handlers.length; i++) {
				if (e._stopped) break;
				const handler = handlers[i];
				if (handler) callWithAsyncErrorHandling(handler, instance, 5, args);
			}
		} else callWithAsyncErrorHandling(value, instance, 5, [e]);
	};
	invoker.value = initialValue;
	invoker.attached = getNow();
	return invoker;
}
var isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
var patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
	const isSVG = namespace === "svg";
	if (key === "class") patchClass(el, nextValue, isSVG);
	else if (key === "style") patchStyle(el, prevValue, nextValue);
	else if (isOn(key)) {
		if (!isModelListener(key)) patchEvent(el, key, prevValue, nextValue, parentComponent);
	} else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
		patchDOMProp(el, key, nextValue);
		if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
	} else if (el._isVueCE && (shouldSetAsPropForVueCE(el, key) || el._def.__asyncLoader && (/[A-Z]/.test(key) || !isString(nextValue)))) patchDOMProp(el, camelize$1(key), nextValue, parentComponent, key);
	else {
		if (key === "true-value") el._trueValue = nextValue;
		else if (key === "false-value") el._falseValue = nextValue;
		patchAttr(el, key, nextValue, isSVG);
	}
};
function shouldSetAsProp(el, key, value, isSVG) {
	if (isSVG) {
		if (key === "innerHTML" || key === "textContent") return true;
		if (key in el && isNativeOn(key) && isFunction$1(value)) return true;
		return false;
	}
	if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "autocorrect") return false;
	if (key === "sandbox" && el.tagName === "IFRAME") return false;
	if (key === "form") return false;
	if (key === "list" && el.tagName === "INPUT") return false;
	if (key === "type" && el.tagName === "TEXTAREA") return false;
	if (key === "width" || key === "height") {
		const tag = el.tagName;
		if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") return false;
	}
	if (isNativeOn(key) && isString(value)) return false;
	return key in el;
}
function shouldSetAsPropForVueCE(el, key) {
	const props = el._def.props;
	if (!props) return false;
	const camelKey = camelize$1(key);
	return Array.isArray(props) ? props.some((prop) => camelize$1(prop) === camelKey) : Object.keys(props).some((prop) => camelize$1(prop) === camelKey);
}
var positionMap = /* @__PURE__ */ new WeakMap();
var newPositionMap = /* @__PURE__ */ new WeakMap();
var moveCbKey = /* @__PURE__ */ Symbol("_moveCb");
var enterCbKey = /* @__PURE__ */ Symbol("_enterCb");
var decorate = (t) => {
	delete t.props.mode;
	return t;
};
var TransitionGroup = /* @__PURE__ */ decorate({
	name: "TransitionGroup",
	props: /* @__PURE__ */ extend({}, TransitionPropsValidators, {
		tag: String,
		moveClass: String
	}),
	setup(props, { slots }) {
		const instance = getCurrentInstance();
		const state = useTransitionState();
		let prevChildren;
		let children;
		onUpdated(() => {
			if (!prevChildren.length) return;
			const moveClass = props.moveClass || `${props.name || "v"}-move`;
			if (!hasCSSTransform(prevChildren[0].el, instance.vnode.el, moveClass)) {
				prevChildren = [];
				return;
			}
			prevChildren.forEach(callPendingCbs);
			prevChildren.forEach(recordPosition);
			const movedChildren = prevChildren.filter(applyTranslation);
			forceReflow(instance.vnode.el);
			movedChildren.forEach((c) => {
				const el = c.el;
				const style = el.style;
				addTransitionClass(el, moveClass);
				style.transform = style.webkitTransform = style.transitionDuration = "";
				const cb = el[moveCbKey] = (e) => {
					if (e && e.target !== el) return;
					if (!e || e.propertyName.endsWith("transform")) {
						el.removeEventListener("transitionend", cb);
						el[moveCbKey] = null;
						removeTransitionClass(el, moveClass);
					}
				};
				el.addEventListener("transitionend", cb);
			});
			prevChildren = [];
		});
		return () => {
			const rawProps = /* @__PURE__ */ toRaw(props);
			const cssTransitionProps = resolveTransitionProps(rawProps);
			let tag = rawProps.tag || Fragment;
			prevChildren = [];
			if (children) for (let i = 0; i < children.length; i++) {
				const child = children[i];
				if (child.el && child.el instanceof Element && !child.el[vShowHidden]) {
					prevChildren.push(child);
					setTransitionHooks(child, resolveTransitionHooks(child, cssTransitionProps, state, instance));
					positionMap.set(child, getPosition(child.el));
				}
			}
			children = slots.default ? getTransitionRawChildren(slots.default()) : [];
			for (let i = 0; i < children.length; i++) {
				const child = children[i];
				if (child.key != null) setTransitionHooks(child, resolveTransitionHooks(child, cssTransitionProps, state, instance));
			}
			return createVNode(tag, null, children);
		};
	}
});
function callPendingCbs(c) {
	const el = c.el;
	if (el[moveCbKey]) el[moveCbKey]();
	if (el[enterCbKey]) el[enterCbKey]();
}
function recordPosition(c) {
	newPositionMap.set(c, getPosition(c.el));
}
function applyTranslation(c) {
	const oldPos = positionMap.get(c);
	const newPos = newPositionMap.get(c);
	const dx = oldPos.left - newPos.left;
	const dy = oldPos.top - newPos.top;
	if (dx || dy) {
		const el = c.el;
		const s = el.style;
		const rect = el.getBoundingClientRect();
		let scaleX = 1;
		let scaleY = 1;
		if (el.offsetWidth) scaleX = rect.width / el.offsetWidth;
		if (el.offsetHeight) scaleY = rect.height / el.offsetHeight;
		if (!Number.isFinite(scaleX) || scaleX === 0) scaleX = 1;
		if (!Number.isFinite(scaleY) || scaleY === 0) scaleY = 1;
		if (Math.abs(scaleX - 1) < .01) scaleX = 1;
		if (Math.abs(scaleY - 1) < .01) scaleY = 1;
		s.transform = s.webkitTransform = `translate(${dx / scaleX}px,${dy / scaleY}px)`;
		s.transitionDuration = "0s";
		return c;
	}
}
function getPosition(el) {
	const rect = el.getBoundingClientRect();
	return {
		left: rect.left,
		top: rect.top
	};
}
function hasCSSTransform(el, root, moveClass) {
	const clone = el.cloneNode();
	const _vtc = el[vtcKey];
	if (_vtc) _vtc.forEach((cls) => {
		cls.split(/\s+/).forEach((c) => c && clone.classList.remove(c));
	});
	moveClass.split(/\s+/).forEach((c) => c && clone.classList.add(c));
	clone.style.display = "none";
	const container = root.nodeType === 1 ? root : root.parentNode;
	container.appendChild(clone);
	const { hasTransform } = getTransitionInfo(clone);
	container.removeChild(clone);
	return hasTransform;
}
var getModelAssigner = (vnode) => {
	const fn = vnode.props["onUpdate:modelValue"] || false;
	return isArray$1(fn) ? (value) => invokeArrayFns(fn, value) : fn;
};
function onCompositionStart(e) {
	e.target.composing = true;
}
function onCompositionEnd(e) {
	const target = e.target;
	if (target.composing) {
		target.composing = false;
		target.dispatchEvent(new Event("input"));
	}
}
var assignKey = /* @__PURE__ */ Symbol("_assign");
function castValue(value, trim, number) {
	if (trim) value = value.trim();
	if (number) value = looseToNumber$1(value);
	return value;
}
var vModelText = {
	created(el, { modifiers: { lazy, trim, number } }, vnode) {
		el[assignKey] = getModelAssigner(vnode);
		const castToNumber = number || vnode.props && vnode.props.type === "number";
		addEventListener(el, lazy ? "change" : "input", (e) => {
			if (e.target.composing) return;
			el[assignKey](castValue(el.value, trim, castToNumber));
		});
		if (trim || castToNumber) addEventListener(el, "change", () => {
			el.value = castValue(el.value, trim, castToNumber);
		});
		if (!lazy) {
			addEventListener(el, "compositionstart", onCompositionStart);
			addEventListener(el, "compositionend", onCompositionEnd);
			addEventListener(el, "change", onCompositionEnd);
		}
	},
	mounted(el, { value }) {
		el.value = value == null ? "" : value;
	},
	beforeUpdate(el, { value, oldValue, modifiers: { lazy, trim, number } }, vnode) {
		el[assignKey] = getModelAssigner(vnode);
		if (el.composing) return;
		const elValue = (number || el.type === "number") && !/^0\d/.test(el.value) ? looseToNumber$1(el.value) : el.value;
		const newValue = value == null ? "" : value;
		if (elValue === newValue) return;
		const rootNode = el.getRootNode();
		if ((rootNode instanceof Document || rootNode instanceof ShadowRoot) && rootNode.activeElement === el && el.type !== "range") {
			if (lazy && value === oldValue) return;
			if (trim && el.value.trim() === newValue) return;
		}
		el.value = newValue;
	}
};
var vModelCheckbox = {
	deep: true,
	created(el, _, vnode) {
		el[assignKey] = getModelAssigner(vnode);
		addEventListener(el, "change", () => {
			const modelValue = el._modelValue;
			const elementValue = getValue$1(el);
			const checked = el.checked;
			const assign = el[assignKey];
			if (isArray$1(modelValue)) {
				const index = looseIndexOf(modelValue, elementValue);
				const found = index !== -1;
				if (checked && !found) assign(modelValue.concat(elementValue));
				else if (!checked && found) {
					const filtered = [...modelValue];
					filtered.splice(index, 1);
					assign(filtered);
				}
			} else if (isSet$1(modelValue)) {
				const cloned = new Set(modelValue);
				if (checked) cloned.add(elementValue);
				else cloned.delete(elementValue);
				assign(cloned);
			} else assign(getCheckboxValue(el, checked));
		});
	},
	mounted: setChecked,
	beforeUpdate(el, binding, vnode) {
		el[assignKey] = getModelAssigner(vnode);
		setChecked(el, binding, vnode);
	}
};
function setChecked(el, { value, oldValue }, vnode) {
	el._modelValue = value;
	let checked;
	if (isArray$1(value)) checked = looseIndexOf(value, vnode.props.value) > -1;
	else if (isSet$1(value)) checked = value.has(vnode.props.value);
	else {
		if (value === oldValue) return;
		checked = looseEqual(value, getCheckboxValue(el, true));
	}
	if (el.checked !== checked) el.checked = checked;
}
var vModelRadio = {
	created(el, { value }, vnode) {
		el.checked = looseEqual(value, vnode.props.value);
		el[assignKey] = getModelAssigner(vnode);
		addEventListener(el, "change", () => {
			el[assignKey](getValue$1(el));
		});
	},
	beforeUpdate(el, { value, oldValue }, vnode) {
		el[assignKey] = getModelAssigner(vnode);
		if (value !== oldValue) el.checked = looseEqual(value, vnode.props.value);
	}
};
function getValue$1(el) {
	return "_value" in el ? el._value : el.value;
}
function getCheckboxValue(el, checked) {
	const key = checked ? "_trueValue" : "_falseValue";
	return key in el ? el[key] : checked;
}
var systemModifiers = [
	"ctrl",
	"shift",
	"alt",
	"meta"
];
var modifierGuards = {
	stop: (e) => e.stopPropagation(),
	prevent: (e) => e.preventDefault(),
	self: (e) => e.target !== e.currentTarget,
	ctrl: (e) => !e.ctrlKey,
	shift: (e) => !e.shiftKey,
	alt: (e) => !e.altKey,
	meta: (e) => !e.metaKey,
	left: (e) => "button" in e && e.button !== 0,
	middle: (e) => "button" in e && e.button !== 1,
	right: (e) => "button" in e && e.button !== 2,
	exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
};
var withModifiers = (fn, modifiers) => {
	if (!fn) return fn;
	const cache = fn._withMods || (fn._withMods = {});
	const cacheKey = modifiers.join(".");
	return cache[cacheKey] || (cache[cacheKey] = ((event, ...args) => {
		for (let i = 0; i < modifiers.length; i++) {
			const guard = modifierGuards[modifiers[i]];
			if (guard && guard(event, modifiers)) return;
		}
		return fn(event, ...args);
	}));
};
var keyNames = {
	esc: "escape",
	space: " ",
	up: "arrow-up",
	left: "arrow-left",
	right: "arrow-right",
	down: "arrow-down",
	delete: "backspace"
};
var withKeys = (fn, modifiers) => {
	const cache = fn._withKeys || (fn._withKeys = {});
	const cacheKey = modifiers.join(".");
	return cache[cacheKey] || (cache[cacheKey] = ((event) => {
		if (!("key" in event)) return;
		const eventKey = hyphenate$1(event.key);
		if (modifiers.some((k) => k === eventKey || keyNames[k] === eventKey)) return fn(event);
	}));
};
var rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
var renderer;
function ensureRenderer() {
	return renderer || (renderer = createRenderer(rendererOptions));
}
var render = ((...args) => {
	ensureRenderer().render(...args);
});
var createApp = ((...args) => {
	const app = ensureRenderer().createApp(...args);
	const { mount } = app;
	app.mount = (containerOrSelector) => {
		const container = normalizeContainer(containerOrSelector);
		if (!container) return;
		const component = app._component;
		if (!isFunction$1(component) && !component.render && !component.template) component.template = container.innerHTML;
		if (container.nodeType === 1) container.textContent = "";
		const proxy = mount(container, false, resolveRootNamespace(container));
		if (container instanceof Element) {
			container.removeAttribute("v-cloak");
			container.setAttribute("data-v-app", "");
		}
		return proxy;
	};
	return app;
});
function resolveRootNamespace(container) {
	if (container instanceof SVGElement) return "svg";
	if (typeof MathMLElement === "function" && container instanceof MathMLElement) return "mathml";
}
function normalizeContainer(container) {
	if (isString(container)) return document.querySelector(container);
	return container;
}
//#endregion
//#region node_modules/element-plus/es/constants/aria.mjs
var EVENT_CODE = {
	tab: "Tab",
	enter: "Enter",
	space: "Space",
	left: "ArrowLeft",
	up: "ArrowUp",
	right: "ArrowRight",
	down: "ArrowDown",
	esc: "Escape",
	delete: "Delete",
	backspace: "Backspace",
	numpadEnter: "NumpadEnter",
	pageUp: "PageUp",
	pageDown: "PageDown",
	home: "Home",
	end: "End"
};
//#endregion
//#region node_modules/element-plus/es/constants/event.mjs
var UPDATE_MODEL_EVENT = "update:modelValue";
var CHANGE_EVENT = "change";
var INPUT_EVENT = "input";
//#endregion
//#region node_modules/element-plus/es/constants/size.mjs
var componentSizes = [
	"",
	"default",
	"small",
	"large"
];
//#endregion
//#region node_modules/element-plus/es/constants/column-alignment.mjs
var columnAlignment = [
	"left",
	"center",
	"right"
];
//#endregion
//#region node_modules/lodash-es/_freeGlobal.js
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
//#endregion
//#region node_modules/lodash-es/_root.js
/** Detect free variable `self`. */
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function("return this")();
//#endregion
//#region node_modules/lodash-es/_Symbol.js
/** Built-in value references. */
var Symbol$1 = root.Symbol;
//#endregion
//#region node_modules/lodash-es/_getRawTag.js
/** Used for built-in method references. */
var objectProto$4 = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty$13 = objectProto$4.hasOwnProperty;
/**
* Used to resolve the
* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
* of values.
*/
var nativeObjectToString$1 = objectProto$4.toString;
/** Built-in value references. */
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : void 0;
/**
* A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
*
* @private
* @param {*} value The value to query.
* @returns {string} Returns the raw `toStringTag`.
*/
function getRawTag(value) {
	var isOwn = hasOwnProperty$13.call(value, symToStringTag$1), tag = value[symToStringTag$1];
	try {
		value[symToStringTag$1] = void 0;
		var unmasked = true;
	} catch (e) {}
	var result = nativeObjectToString$1.call(value);
	if (unmasked) if (isOwn) value[symToStringTag$1] = tag;
	else delete value[symToStringTag$1];
	return result;
}
//#endregion
//#region node_modules/lodash-es/_objectToString.js
/**
* Used to resolve the
* [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
* of values.
*/
var nativeObjectToString = Object.prototype.toString;
/**
* Converts `value` to a string using `Object.prototype.toString`.
*
* @private
* @param {*} value The value to convert.
* @returns {string} Returns the converted string.
*/
function objectToString(value) {
	return nativeObjectToString.call(value);
}
//#endregion
//#region node_modules/lodash-es/_baseGetTag.js
/** `Object#toString` result references. */
var nullTag = "[object Null]";
var undefinedTag = "[object Undefined]";
/** Built-in value references. */
var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : void 0;
/**
* The base implementation of `getTag` without fallbacks for buggy environments.
*
* @private
* @param {*} value The value to query.
* @returns {string} Returns the `toStringTag`.
*/
function baseGetTag(value) {
	if (value == null) return value === void 0 ? undefinedTag : nullTag;
	return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
//#endregion
//#region node_modules/lodash-es/isObjectLike.js
/**
* Checks if `value` is object-like. A value is object-like if it's not `null`
* and has a `typeof` result of "object".
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is object-like, else `false`.
* @example
*
* _.isObjectLike({});
* // => true
*
* _.isObjectLike([1, 2, 3]);
* // => true
*
* _.isObjectLike(_.noop);
* // => false
*
* _.isObjectLike(null);
* // => false
*/
function isObjectLike(value) {
	return value != null && typeof value == "object";
}
//#endregion
//#region node_modules/lodash-es/isSymbol.js
/** `Object#toString` result references. */
var symbolTag$3 = "[object Symbol]";
/**
* Checks if `value` is classified as a `Symbol` primitive or object.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
* @example
*
* _.isSymbol(Symbol.iterator);
* // => true
*
* _.isSymbol('abc');
* // => false
*/
function isSymbol(value) {
	return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag$3;
}
//#endregion
//#region node_modules/lodash-es/_arrayMap.js
/**
* A specialized version of `_.map` for arrays without support for iteratee
* shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Array} Returns the new mapped array.
*/
function arrayMap(array, iteratee) {
	var index = -1, length = array == null ? 0 : array.length, result = Array(length);
	while (++index < length) result[index] = iteratee(array[index], index, array);
	return result;
}
//#endregion
//#region node_modules/lodash-es/isArray.js
/**
* Checks if `value` is classified as an `Array` object.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an array, else `false`.
* @example
*
* _.isArray([1, 2, 3]);
* // => true
*
* _.isArray(document.body.children);
* // => false
*
* _.isArray('abc');
* // => false
*
* _.isArray(_.noop);
* // => false
*/
var isArray = Array.isArray;
//#endregion
//#region node_modules/lodash-es/_baseToString.js
/** Used as references for various `Number` constants. */
var INFINITY$2 = Infinity;
/** Used to convert symbols to primitives and strings. */
var symbolProto$2 = Symbol$1 ? Symbol$1.prototype : void 0;
var symbolToString = symbolProto$2 ? symbolProto$2.toString : void 0;
/**
* The base implementation of `_.toString` which doesn't convert nullish
* values to empty strings.
*
* @private
* @param {*} value The value to process.
* @returns {string} Returns the string.
*/
function baseToString(value) {
	if (typeof value == "string") return value;
	if (isArray(value)) return arrayMap(value, baseToString) + "";
	if (isSymbol(value)) return symbolToString ? symbolToString.call(value) : "";
	var result = value + "";
	return result == "0" && 1 / value == -INFINITY$2 ? "-0" : result;
}
//#endregion
//#region node_modules/lodash-es/_trimmedEndIndex.js
/** Used to match a single whitespace character. */
var reWhitespace = /\s/;
/**
* Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
* character of `string`.
*
* @private
* @param {string} string The string to inspect.
* @returns {number} Returns the index of the last non-whitespace character.
*/
function trimmedEndIndex(string) {
	var index = string.length;
	while (index-- && reWhitespace.test(string.charAt(index)));
	return index;
}
//#endregion
//#region node_modules/lodash-es/_baseTrim.js
/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;
/**
* The base implementation of `_.trim`.
*
* @private
* @param {string} string The string to trim.
* @returns {string} Returns the trimmed string.
*/
function baseTrim(string) {
	return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
}
//#endregion
//#region node_modules/lodash-es/isObject.js
/**
* Checks if `value` is the
* [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
* of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an object, else `false`.
* @example
*
* _.isObject({});
* // => true
*
* _.isObject([1, 2, 3]);
* // => true
*
* _.isObject(_.noop);
* // => true
*
* _.isObject(null);
* // => false
*/
function isObject$1(value) {
	var type = typeof value;
	return value != null && (type == "object" || type == "function");
}
//#endregion
//#region node_modules/lodash-es/toNumber.js
/** Used as references for various `Number` constants. */
var NAN = NaN;
/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;
/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;
/**
* Converts `value` to a number.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to process.
* @returns {number} Returns the number.
* @example
*
* _.toNumber(3.2);
* // => 3.2
*
* _.toNumber(Number.MIN_VALUE);
* // => 5e-324
*
* _.toNumber(Infinity);
* // => Infinity
*
* _.toNumber('3.2');
* // => 3.2
*/
function toNumber(value) {
	if (typeof value == "number") return value;
	if (isSymbol(value)) return NAN;
	if (isObject$1(value)) {
		var other = typeof value.valueOf == "function" ? value.valueOf() : value;
		value = isObject$1(other) ? other + "" : other;
	}
	if (typeof value != "string") return value === 0 ? value : +value;
	value = baseTrim(value);
	var isBinary = reIsBinary.test(value);
	return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
//#endregion
//#region node_modules/lodash-es/toFinite.js
/** Used as references for various `Number` constants. */
var INFINITY$1 = Infinity;
var MAX_INTEGER = 17976931348623157e292;
/**
* Converts `value` to a finite number.
*
* @static
* @memberOf _
* @since 4.12.0
* @category Lang
* @param {*} value The value to convert.
* @returns {number} Returns the converted number.
* @example
*
* _.toFinite(3.2);
* // => 3.2
*
* _.toFinite(Number.MIN_VALUE);
* // => 5e-324
*
* _.toFinite(Infinity);
* // => 1.7976931348623157e+308
*
* _.toFinite('3.2');
* // => 3.2
*/
function toFinite(value) {
	if (!value) return value === 0 ? value : 0;
	value = toNumber(value);
	if (value === INFINITY$1 || value === -INFINITY$1) return (value < 0 ? -1 : 1) * MAX_INTEGER;
	return value === value ? value : 0;
}
//#endregion
//#region node_modules/lodash-es/toInteger.js
/**
* Converts `value` to an integer.
*
* **Note:** This method is loosely based on
* [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to convert.
* @returns {number} Returns the converted integer.
* @example
*
* _.toInteger(3.2);
* // => 3
*
* _.toInteger(Number.MIN_VALUE);
* // => 0
*
* _.toInteger(Infinity);
* // => 1.7976931348623157e+308
*
* _.toInteger('3.2');
* // => 3
*/
function toInteger(value) {
	var result = toFinite(value), remainder = result % 1;
	return result === result ? remainder ? result - remainder : result : 0;
}
//#endregion
//#region node_modules/lodash-es/identity.js
/**
* This method returns the first argument it receives.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Util
* @param {*} value Any value.
* @returns {*} Returns `value`.
* @example
*
* var object = { 'a': 1 };
*
* console.log(_.identity(object) === object);
* // => true
*/
function identity(value) {
	return value;
}
//#endregion
//#region node_modules/lodash-es/isFunction.js
/** `Object#toString` result references. */
var asyncTag = "[object AsyncFunction]";
var funcTag$2 = "[object Function]";
var genTag$1 = "[object GeneratorFunction]";
var proxyTag = "[object Proxy]";
/**
* Checks if `value` is classified as a `Function` object.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a function, else `false`.
* @example
*
* _.isFunction(_);
* // => true
*
* _.isFunction(/abc/);
* // => false
*/
function isFunction(value) {
	if (!isObject$1(value)) return false;
	var tag = baseGetTag(value);
	return tag == funcTag$2 || tag == genTag$1 || tag == asyncTag || tag == proxyTag;
}
//#endregion
//#region node_modules/lodash-es/_coreJsData.js
/** Used to detect overreaching core-js shims. */
var coreJsData = root["__core-js_shared__"];
//#endregion
//#region node_modules/lodash-es/_isMasked.js
/** Used to detect methods masquerading as native. */
var maskSrcKey = function() {
	var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
	return uid ? "Symbol(src)_1." + uid : "";
}();
/**
* Checks if `func` has its source masked.
*
* @private
* @param {Function} func The function to check.
* @returns {boolean} Returns `true` if `func` is masked, else `false`.
*/
function isMasked(func) {
	return !!maskSrcKey && maskSrcKey in func;
}
//#endregion
//#region node_modules/lodash-es/_toSource.js
/** Used to resolve the decompiled source of functions. */
var funcToString$2 = Function.prototype.toString;
/**
* Converts `func` to its source code.
*
* @private
* @param {Function} func The function to convert.
* @returns {string} Returns the source code.
*/
function toSource(func) {
	if (func != null) {
		try {
			return funcToString$2.call(func);
		} catch (e) {}
		try {
			return func + "";
		} catch (e) {}
	}
	return "";
}
//#endregion
//#region node_modules/lodash-es/_baseIsNative.js
/**
* Used to match `RegExp`
* [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
*/
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;
/** Used for built-in method references. */
var funcProto$1 = Function.prototype;
var objectProto$3 = Object.prototype;
/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;
/** Used to check objects for own properties. */
var hasOwnProperty$12 = objectProto$3.hasOwnProperty;
/** Used to detect if a method is native. */
var reIsNative = RegExp("^" + funcToString$1.call(hasOwnProperty$12).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
/**
* The base implementation of `_.isNative` without bad shim checks.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a native function,
*  else `false`.
*/
function baseIsNative(value) {
	if (!isObject$1(value) || isMasked(value)) return false;
	return (isFunction(value) ? reIsNative : reIsHostCtor).test(toSource(value));
}
//#endregion
//#region node_modules/lodash-es/_getValue.js
/**
* Gets the value at `key` of `object`.
*
* @private
* @param {Object} [object] The object to query.
* @param {string} key The key of the property to get.
* @returns {*} Returns the property value.
*/
function getValue(object, key) {
	return object == null ? void 0 : object[key];
}
//#endregion
//#region node_modules/lodash-es/_getNative.js
/**
* Gets the native function at `key` of `object`.
*
* @private
* @param {Object} object The object to query.
* @param {string} key The key of the method to get.
* @returns {*} Returns the function if it's native, else `undefined`.
*/
function getNative(object, key) {
	var value = getValue(object, key);
	return baseIsNative(value) ? value : void 0;
}
//#endregion
//#region node_modules/lodash-es/_WeakMap.js
var WeakMap$1 = getNative(root, "WeakMap");
//#endregion
//#region node_modules/lodash-es/_baseCreate.js
/** Built-in value references. */
var objectCreate = Object.create;
/**
* The base implementation of `_.create` without support for assigning
* properties to the created object.
*
* @private
* @param {Object} proto The object to inherit from.
* @returns {Object} Returns the new object.
*/
var baseCreate = function() {
	function object() {}
	return function(proto) {
		if (!isObject$1(proto)) return {};
		if (objectCreate) return objectCreate(proto);
		object.prototype = proto;
		var result = new object();
		object.prototype = void 0;
		return result;
	};
}();
//#endregion
//#region node_modules/lodash-es/_apply.js
/**
* A faster alternative to `Function#apply`, this function invokes `func`
* with the `this` binding of `thisArg` and the arguments of `args`.
*
* @private
* @param {Function} func The function to invoke.
* @param {*} thisArg The `this` binding of `func`.
* @param {Array} args The arguments to invoke `func` with.
* @returns {*} Returns the result of `func`.
*/
function apply(func, thisArg, args) {
	switch (args.length) {
		case 0: return func.call(thisArg);
		case 1: return func.call(thisArg, args[0]);
		case 2: return func.call(thisArg, args[0], args[1]);
		case 3: return func.call(thisArg, args[0], args[1], args[2]);
	}
	return func.apply(thisArg, args);
}
//#endregion
//#region node_modules/lodash-es/_copyArray.js
/**
* Copies the values of `source` to `array`.
*
* @private
* @param {Array} source The array to copy values from.
* @param {Array} [array=[]] The array to copy values to.
* @returns {Array} Returns `array`.
*/
function copyArray(source, array) {
	var index = -1, length = source.length;
	array || (array = Array(length));
	while (++index < length) array[index] = source[index];
	return array;
}
//#endregion
//#region node_modules/lodash-es/_shortOut.js
/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800;
var HOT_SPAN = 16;
var nativeNow = Date.now;
/**
* Creates a function that'll short out and invoke `identity` instead
* of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
* milliseconds.
*
* @private
* @param {Function} func The function to restrict.
* @returns {Function} Returns the new shortable function.
*/
function shortOut(func) {
	var count = 0, lastCalled = 0;
	return function() {
		var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
		lastCalled = stamp;
		if (remaining > 0) {
			if (++count >= HOT_COUNT) return arguments[0];
		} else count = 0;
		return func.apply(void 0, arguments);
	};
}
//#endregion
//#region node_modules/lodash-es/constant.js
/**
* Creates a function that returns `value`.
*
* @static
* @memberOf _
* @since 2.4.0
* @category Util
* @param {*} value The value to return from the new function.
* @returns {Function} Returns the new constant function.
* @example
*
* var objects = _.times(2, _.constant({ 'a': 1 }));
*
* console.log(objects);
* // => [{ 'a': 1 }, { 'a': 1 }]
*
* console.log(objects[0] === objects[1]);
* // => true
*/
function constant(value) {
	return function() {
		return value;
	};
}
//#endregion
//#region node_modules/lodash-es/_defineProperty.js
var defineProperty = function() {
	try {
		var func = getNative(Object, "defineProperty");
		func({}, "", {});
		return func;
	} catch (e) {}
}();
//#endregion
//#region node_modules/lodash-es/_setToString.js
/**
* Sets the `toString` method of `func` to return `string`.
*
* @private
* @param {Function} func The function to modify.
* @param {Function} string The `toString` result.
* @returns {Function} Returns `func`.
*/
var setToString = shortOut(!defineProperty ? identity : function(func, string) {
	return defineProperty(func, "toString", {
		"configurable": true,
		"enumerable": false,
		"value": constant(string),
		"writable": true
	});
});
//#endregion
//#region node_modules/lodash-es/_arrayEach.js
/**
* A specialized version of `_.forEach` for arrays without support for
* iteratee shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Array} Returns `array`.
*/
function arrayEach(array, iteratee) {
	var index = -1, length = array == null ? 0 : array.length;
	while (++index < length) if (iteratee(array[index], index, array) === false) break;
	return array;
}
//#endregion
//#region node_modules/lodash-es/_baseFindIndex.js
/**
* The base implementation of `_.findIndex` and `_.findLastIndex` without
* support for iteratee shorthands.
*
* @private
* @param {Array} array The array to inspect.
* @param {Function} predicate The function invoked per iteration.
* @param {number} fromIndex The index to search from.
* @param {boolean} [fromRight] Specify iterating from right to left.
* @returns {number} Returns the index of the matched value, else `-1`.
*/
function baseFindIndex(array, predicate, fromIndex, fromRight) {
	var length = array.length, index = fromIndex + (fromRight ? 1 : -1);
	while (fromRight ? index-- : ++index < length) if (predicate(array[index], index, array)) return index;
	return -1;
}
//#endregion
//#region node_modules/lodash-es/_isIndex.js
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;
/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;
/**
* Checks if `value` is a valid array-like index.
*
* @private
* @param {*} value The value to check.
* @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
* @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
*/
function isIndex(value, length) {
	var type = typeof value;
	length = length == null ? MAX_SAFE_INTEGER$1 : length;
	return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}
//#endregion
//#region node_modules/lodash-es/_baseAssignValue.js
/**
* The base implementation of `assignValue` and `assignMergeValue` without
* value checks.
*
* @private
* @param {Object} object The object to modify.
* @param {string} key The key of the property to assign.
* @param {*} value The value to assign.
*/
function baseAssignValue(object, key, value) {
	if (key == "__proto__" && defineProperty) defineProperty(object, key, {
		"configurable": true,
		"enumerable": true,
		"value": value,
		"writable": true
	});
	else object[key] = value;
}
//#endregion
//#region node_modules/lodash-es/eq.js
/**
* Performs a
* [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
* comparison between two values to determine if they are equivalent.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to compare.
* @param {*} other The other value to compare.
* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
* @example
*
* var object = { 'a': 1 };
* var other = { 'a': 1 };
*
* _.eq(object, object);
* // => true
*
* _.eq(object, other);
* // => false
*
* _.eq('a', 'a');
* // => true
*
* _.eq('a', Object('a'));
* // => false
*
* _.eq(NaN, NaN);
* // => true
*/
function eq(value, other) {
	return value === other || value !== value && other !== other;
}
//#endregion
//#region node_modules/lodash-es/_assignValue.js
/** Used to check objects for own properties. */
var hasOwnProperty$11 = Object.prototype.hasOwnProperty;
/**
* Assigns `value` to `key` of `object` if the existing value is not equivalent
* using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
* for equality comparisons.
*
* @private
* @param {Object} object The object to modify.
* @param {string} key The key of the property to assign.
* @param {*} value The value to assign.
*/
function assignValue(object, key, value) {
	var objValue = object[key];
	if (!(hasOwnProperty$11.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) baseAssignValue(object, key, value);
}
//#endregion
//#region node_modules/lodash-es/_copyObject.js
/**
* Copies properties of `source` to `object`.
*
* @private
* @param {Object} source The object to copy properties from.
* @param {Array} props The property identifiers to copy.
* @param {Object} [object={}] The object to copy properties to.
* @param {Function} [customizer] The function to customize copied values.
* @returns {Object} Returns `object`.
*/
function copyObject(source, props, object, customizer) {
	var isNew = !object;
	object || (object = {});
	var index = -1, length = props.length;
	while (++index < length) {
		var key = props[index];
		var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
		if (newValue === void 0) newValue = source[key];
		if (isNew) baseAssignValue(object, key, newValue);
		else assignValue(object, key, newValue);
	}
	return object;
}
//#endregion
//#region node_modules/lodash-es/_overRest.js
var nativeMax$2 = Math.max;
/**
* A specialized version of `baseRest` which transforms the rest array.
*
* @private
* @param {Function} func The function to apply a rest parameter to.
* @param {number} [start=func.length-1] The start position of the rest parameter.
* @param {Function} transform The rest array transform.
* @returns {Function} Returns the new function.
*/
function overRest(func, start, transform) {
	start = nativeMax$2(start === void 0 ? func.length - 1 : start, 0);
	return function() {
		var args = arguments, index = -1, length = nativeMax$2(args.length - start, 0), array = Array(length);
		while (++index < length) array[index] = args[start + index];
		index = -1;
		var otherArgs = Array(start + 1);
		while (++index < start) otherArgs[index] = args[index];
		otherArgs[start] = transform(array);
		return apply(func, this, otherArgs);
	};
}
//#endregion
//#region node_modules/lodash-es/_baseRest.js
/**
* The base implementation of `_.rest` which doesn't validate or coerce arguments.
*
* @private
* @param {Function} func The function to apply a rest parameter to.
* @param {number} [start=func.length-1] The start position of the rest parameter.
* @returns {Function} Returns the new function.
*/
function baseRest(func, start) {
	return setToString(overRest(func, start, identity), func + "");
}
//#endregion
//#region node_modules/lodash-es/isLength.js
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;
/**
* Checks if `value` is a valid array-like length.
*
* **Note:** This method is loosely based on
* [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
* @example
*
* _.isLength(3);
* // => true
*
* _.isLength(Number.MIN_VALUE);
* // => false
*
* _.isLength(Infinity);
* // => false
*
* _.isLength('3');
* // => false
*/
function isLength(value) {
	return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
//#endregion
//#region node_modules/lodash-es/isArrayLike.js
/**
* Checks if `value` is array-like. A value is considered array-like if it's
* not a function and has a `value.length` that's an integer greater than or
* equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is array-like, else `false`.
* @example
*
* _.isArrayLike([1, 2, 3]);
* // => true
*
* _.isArrayLike(document.body.children);
* // => true
*
* _.isArrayLike('abc');
* // => true
*
* _.isArrayLike(_.noop);
* // => false
*/
function isArrayLike(value) {
	return value != null && isLength(value.length) && !isFunction(value);
}
//#endregion
//#region node_modules/lodash-es/_isIterateeCall.js
/**
* Checks if the given arguments are from an iteratee call.
*
* @private
* @param {*} value The potential iteratee value argument.
* @param {*} index The potential iteratee index or key argument.
* @param {*} object The potential iteratee object argument.
* @returns {boolean} Returns `true` if the arguments are from an iteratee call,
*  else `false`.
*/
function isIterateeCall(value, index, object) {
	if (!isObject$1(object)) return false;
	var type = typeof index;
	if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) return eq(object[index], value);
	return false;
}
//#endregion
//#region node_modules/lodash-es/_createAssigner.js
/**
* Creates a function like `_.assign`.
*
* @private
* @param {Function} assigner The function to assign values.
* @returns {Function} Returns the new assigner function.
*/
function createAssigner(assigner) {
	return baseRest(function(object, sources) {
		var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
		customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
		if (guard && isIterateeCall(sources[0], sources[1], guard)) {
			customizer = length < 3 ? void 0 : customizer;
			length = 1;
		}
		object = Object(object);
		while (++index < length) {
			var source = sources[index];
			if (source) assigner(object, source, index, customizer);
		}
		return object;
	});
}
//#endregion
//#region node_modules/lodash-es/_isPrototype.js
/** Used for built-in method references. */
var objectProto$2 = Object.prototype;
/**
* Checks if `value` is likely a prototype object.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
*/
function isPrototype(value) {
	var Ctor = value && value.constructor;
	return value === (typeof Ctor == "function" && Ctor.prototype || objectProto$2);
}
//#endregion
//#region node_modules/lodash-es/_baseTimes.js
/**
* The base implementation of `_.times` without support for iteratee shorthands
* or max array length checks.
*
* @private
* @param {number} n The number of times to invoke `iteratee`.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Array} Returns the array of results.
*/
function baseTimes(n, iteratee) {
	var index = -1, result = Array(n);
	while (++index < n) result[index] = iteratee(index);
	return result;
}
//#endregion
//#region node_modules/lodash-es/_baseIsArguments.js
/** `Object#toString` result references. */
var argsTag$3 = "[object Arguments]";
/**
* The base implementation of `_.isArguments`.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an `arguments` object,
*/
function baseIsArguments(value) {
	return isObjectLike(value) && baseGetTag(value) == argsTag$3;
}
//#endregion
//#region node_modules/lodash-es/isArguments.js
/** Used for built-in method references. */
var objectProto$1 = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty$10 = objectProto$1.hasOwnProperty;
/** Built-in value references. */
var propertyIsEnumerable$1 = objectProto$1.propertyIsEnumerable;
/**
* Checks if `value` is likely an `arguments` object.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an `arguments` object,
*  else `false`.
* @example
*
* _.isArguments(function() { return arguments; }());
* // => true
*
* _.isArguments([1, 2, 3]);
* // => false
*/
var isArguments = baseIsArguments(function() {
	return arguments;
}()) ? baseIsArguments : function(value) {
	return isObjectLike(value) && hasOwnProperty$10.call(value, "callee") && !propertyIsEnumerable$1.call(value, "callee");
};
//#endregion
//#region node_modules/lodash-es/stubFalse.js
/**
* This method returns `false`.
*
* @static
* @memberOf _
* @since 4.13.0
* @category Util
* @returns {boolean} Returns `false`.
* @example
*
* _.times(2, _.stubFalse);
* // => [false, false]
*/
function stubFalse() {
	return false;
}
//#endregion
//#region node_modules/lodash-es/isBuffer.js
/** Detect free variable `exports`. */
var freeExports$2 = typeof exports == "object" && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */
var freeModule$2 = freeExports$2 && typeof module == "object" && module && !module.nodeType && module;
/** Built-in value references. */
var Buffer$1 = freeModule$2 && freeModule$2.exports === freeExports$2 ? root.Buffer : void 0;
/**
* Checks if `value` is a buffer.
*
* @static
* @memberOf _
* @since 4.3.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
* @example
*
* _.isBuffer(new Buffer(2));
* // => true
*
* _.isBuffer(new Uint8Array(2));
* // => false
*/
var isBuffer = (Buffer$1 ? Buffer$1.isBuffer : void 0) || stubFalse;
//#endregion
//#region node_modules/lodash-es/_baseIsTypedArray.js
/** `Object#toString` result references. */
var argsTag$2 = "[object Arguments]";
var arrayTag$2 = "[object Array]";
var boolTag$3 = "[object Boolean]";
var dateTag$3 = "[object Date]";
var errorTag$2 = "[object Error]";
var funcTag$1 = "[object Function]";
var mapTag$5 = "[object Map]";
var numberTag$3 = "[object Number]";
var objectTag$4 = "[object Object]";
var regexpTag$3 = "[object RegExp]";
var setTag$5 = "[object Set]";
var stringTag$3 = "[object String]";
var weakMapTag$2 = "[object WeakMap]";
var arrayBufferTag$3 = "[object ArrayBuffer]";
var dataViewTag$4 = "[object DataView]";
var float32Tag$2 = "[object Float32Array]";
var float64Tag$2 = "[object Float64Array]";
var int8Tag$2 = "[object Int8Array]";
var int16Tag$2 = "[object Int16Array]";
var int32Tag$2 = "[object Int32Array]";
var uint8Tag$2 = "[object Uint8Array]";
var uint8ClampedTag$2 = "[object Uint8ClampedArray]";
var uint16Tag$2 = "[object Uint16Array]";
var uint32Tag$2 = "[object Uint32Array]";
/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag$2] = typedArrayTags[float64Tag$2] = typedArrayTags[int8Tag$2] = typedArrayTags[int16Tag$2] = typedArrayTags[int32Tag$2] = typedArrayTags[uint8Tag$2] = typedArrayTags[uint8ClampedTag$2] = typedArrayTags[uint16Tag$2] = typedArrayTags[uint32Tag$2] = true;
typedArrayTags[argsTag$2] = typedArrayTags[arrayTag$2] = typedArrayTags[arrayBufferTag$3] = typedArrayTags[boolTag$3] = typedArrayTags[dataViewTag$4] = typedArrayTags[dateTag$3] = typedArrayTags[errorTag$2] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag$5] = typedArrayTags[numberTag$3] = typedArrayTags[objectTag$4] = typedArrayTags[regexpTag$3] = typedArrayTags[setTag$5] = typedArrayTags[stringTag$3] = typedArrayTags[weakMapTag$2] = false;
/**
* The base implementation of `_.isTypedArray` without Node.js optimizations.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
*/
function baseIsTypedArray(value) {
	return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}
//#endregion
//#region node_modules/lodash-es/_baseUnary.js
/**
* The base implementation of `_.unary` without support for storing metadata.
*
* @private
* @param {Function} func The function to cap arguments for.
* @returns {Function} Returns the new capped function.
*/
function baseUnary(func) {
	return function(value) {
		return func(value);
	};
}
//#endregion
//#region node_modules/lodash-es/_nodeUtil.js
/** Detect free variable `exports`. */
var freeExports$1 = typeof exports == "object" && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */
var freeModule$1 = freeExports$1 && typeof module == "object" && module && !module.nodeType && module;
/** Detect free variable `process` from Node.js. */
var freeProcess = freeModule$1 && freeModule$1.exports === freeExports$1 && freeGlobal.process;
/** Used to access faster Node.js helpers. */
var nodeUtil = function() {
	try {
		var types = freeModule$1 && freeModule$1.require && freeModule$1.require("util").types;
		if (types) return types;
		return freeProcess && freeProcess.binding && freeProcess.binding("util");
	} catch (e) {}
}();
//#endregion
//#region node_modules/lodash-es/isTypedArray.js
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
/**
* Checks if `value` is classified as a typed array.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
* @example
*
* _.isTypedArray(new Uint8Array);
* // => true
*
* _.isTypedArray([]);
* // => false
*/
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
//#endregion
//#region node_modules/lodash-es/_arrayLikeKeys.js
/** Used to check objects for own properties. */
var hasOwnProperty$9 = Object.prototype.hasOwnProperty;
/**
* Creates an array of the enumerable property names of the array-like `value`.
*
* @private
* @param {*} value The value to query.
* @param {boolean} inherited Specify returning inherited property names.
* @returns {Array} Returns the array of property names.
*/
function arrayLikeKeys(value, inherited) {
	var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
	for (var key in value) if ((inherited || hasOwnProperty$9.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) result.push(key);
	return result;
}
//#endregion
//#region node_modules/lodash-es/_overArg.js
/**
* Creates a unary function that invokes `func` with its argument transformed.
*
* @private
* @param {Function} func The function to wrap.
* @param {Function} transform The argument transform.
* @returns {Function} Returns the new function.
*/
function overArg(func, transform) {
	return function(arg) {
		return func(transform(arg));
	};
}
//#endregion
//#region node_modules/lodash-es/_nativeKeys.js
var nativeKeys = overArg(Object.keys, Object);
//#endregion
//#region node_modules/lodash-es/_baseKeys.js
/** Used to check objects for own properties. */
var hasOwnProperty$8 = Object.prototype.hasOwnProperty;
/**
* The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names.
*/
function baseKeys(object) {
	if (!isPrototype(object)) return nativeKeys(object);
	var result = [];
	for (var key in Object(object)) if (hasOwnProperty$8.call(object, key) && key != "constructor") result.push(key);
	return result;
}
//#endregion
//#region node_modules/lodash-es/keys.js
/**
* Creates an array of the own enumerable property names of `object`.
*
* **Note:** Non-object values are coerced to objects. See the
* [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
* for more details.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Object
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names.
* @example
*
* function Foo() {
*   this.a = 1;
*   this.b = 2;
* }
*
* Foo.prototype.c = 3;
*
* _.keys(new Foo);
* // => ['a', 'b'] (iteration order is not guaranteed)
*
* _.keys('hi');
* // => ['0', '1']
*/
function keys(object) {
	return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}
//#endregion
//#region node_modules/lodash-es/_nativeKeysIn.js
/**
* This function is like
* [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
* except that it includes inherited enumerable properties.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names.
*/
function nativeKeysIn(object) {
	var result = [];
	if (object != null) for (var key in Object(object)) result.push(key);
	return result;
}
//#endregion
//#region node_modules/lodash-es/_baseKeysIn.js
/** Used to check objects for own properties. */
var hasOwnProperty$7 = Object.prototype.hasOwnProperty;
/**
* The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names.
*/
function baseKeysIn(object) {
	if (!isObject$1(object)) return nativeKeysIn(object);
	var isProto = isPrototype(object), result = [];
	for (var key in object) if (!(key == "constructor" && (isProto || !hasOwnProperty$7.call(object, key)))) result.push(key);
	return result;
}
//#endregion
//#region node_modules/lodash-es/keysIn.js
/**
* Creates an array of the own and inherited enumerable property names of `object`.
*
* **Note:** Non-object values are coerced to objects.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Object
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names.
* @example
*
* function Foo() {
*   this.a = 1;
*   this.b = 2;
* }
*
* Foo.prototype.c = 3;
*
* _.keysIn(new Foo);
* // => ['a', 'b', 'c'] (iteration order is not guaranteed)
*/
function keysIn(object) {
	return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}
//#endregion
//#region node_modules/lodash-es/_isKey.js
/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var reIsPlainProp = /^\w*$/;
/**
* Checks if `value` is a property name and not a property path.
*
* @private
* @param {*} value The value to check.
* @param {Object} [object] The object to query keys on.
* @returns {boolean} Returns `true` if `value` is a property name, else `false`.
*/
function isKey(value, object) {
	if (isArray(value)) return false;
	var type = typeof value;
	if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol(value)) return true;
	return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}
//#endregion
//#region node_modules/lodash-es/_nativeCreate.js
var nativeCreate = getNative(Object, "create");
//#endregion
//#region node_modules/lodash-es/_hashClear.js
/**
* Removes all key-value entries from the hash.
*
* @private
* @name clear
* @memberOf Hash
*/
function hashClear() {
	this.__data__ = nativeCreate ? nativeCreate(null) : {};
	this.size = 0;
}
//#endregion
//#region node_modules/lodash-es/_hashDelete.js
/**
* Removes `key` and its value from the hash.
*
* @private
* @name delete
* @memberOf Hash
* @param {Object} hash The hash to modify.
* @param {string} key The key of the value to remove.
* @returns {boolean} Returns `true` if the entry was removed, else `false`.
*/
function hashDelete(key) {
	var result = this.has(key) && delete this.__data__[key];
	this.size -= result ? 1 : 0;
	return result;
}
//#endregion
//#region node_modules/lodash-es/_hashGet.js
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$2 = "__lodash_hash_undefined__";
/** Used to check objects for own properties. */
var hasOwnProperty$6 = Object.prototype.hasOwnProperty;
/**
* Gets the hash value for `key`.
*
* @private
* @name get
* @memberOf Hash
* @param {string} key The key of the value to get.
* @returns {*} Returns the entry value.
*/
function hashGet(key) {
	var data = this.__data__;
	if (nativeCreate) {
		var result = data[key];
		return result === HASH_UNDEFINED$2 ? void 0 : result;
	}
	return hasOwnProperty$6.call(data, key) ? data[key] : void 0;
}
//#endregion
//#region node_modules/lodash-es/_hashHas.js
/** Used to check objects for own properties. */
var hasOwnProperty$5 = Object.prototype.hasOwnProperty;
/**
* Checks if a hash value for `key` exists.
*
* @private
* @name has
* @memberOf Hash
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function hashHas(key) {
	var data = this.__data__;
	return nativeCreate ? data[key] !== void 0 : hasOwnProperty$5.call(data, key);
}
//#endregion
//#region node_modules/lodash-es/_hashSet.js
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = "__lodash_hash_undefined__";
/**
* Sets the hash `key` to `value`.
*
* @private
* @name set
* @memberOf Hash
* @param {string} key The key of the value to set.
* @param {*} value The value to set.
* @returns {Object} Returns the hash instance.
*/
function hashSet(key, value) {
	var data = this.__data__;
	this.size += this.has(key) ? 0 : 1;
	data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED$1 : value;
	return this;
}
//#endregion
//#region node_modules/lodash-es/_Hash.js
/**
* Creates a hash object.
*
* @private
* @constructor
* @param {Array} [entries] The key-value pairs to cache.
*/
function Hash(entries) {
	var index = -1, length = entries == null ? 0 : entries.length;
	this.clear();
	while (++index < length) {
		var entry = entries[index];
		this.set(entry[0], entry[1]);
	}
}
Hash.prototype.clear = hashClear;
Hash.prototype["delete"] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
//#endregion
//#region node_modules/lodash-es/_listCacheClear.js
/**
* Removes all key-value entries from the list cache.
*
* @private
* @name clear
* @memberOf ListCache
*/
function listCacheClear() {
	this.__data__ = [];
	this.size = 0;
}
//#endregion
//#region node_modules/lodash-es/_assocIndexOf.js
/**
* Gets the index at which the `key` is found in `array` of key-value pairs.
*
* @private
* @param {Array} array The array to inspect.
* @param {*} key The key to search for.
* @returns {number} Returns the index of the matched value, else `-1`.
*/
function assocIndexOf(array, key) {
	var length = array.length;
	while (length--) if (eq(array[length][0], key)) return length;
	return -1;
}
//#endregion
//#region node_modules/lodash-es/_listCacheDelete.js
/** Built-in value references. */
var splice = Array.prototype.splice;
/**
* Removes `key` and its value from the list cache.
*
* @private
* @name delete
* @memberOf ListCache
* @param {string} key The key of the value to remove.
* @returns {boolean} Returns `true` if the entry was removed, else `false`.
*/
function listCacheDelete(key) {
	var data = this.__data__, index = assocIndexOf(data, key);
	if (index < 0) return false;
	if (index == data.length - 1) data.pop();
	else splice.call(data, index, 1);
	--this.size;
	return true;
}
//#endregion
//#region node_modules/lodash-es/_listCacheGet.js
/**
* Gets the list cache value for `key`.
*
* @private
* @name get
* @memberOf ListCache
* @param {string} key The key of the value to get.
* @returns {*} Returns the entry value.
*/
function listCacheGet(key) {
	var data = this.__data__, index = assocIndexOf(data, key);
	return index < 0 ? void 0 : data[index][1];
}
//#endregion
//#region node_modules/lodash-es/_listCacheHas.js
/**
* Checks if a list cache value for `key` exists.
*
* @private
* @name has
* @memberOf ListCache
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function listCacheHas(key) {
	return assocIndexOf(this.__data__, key) > -1;
}
//#endregion
//#region node_modules/lodash-es/_listCacheSet.js
/**
* Sets the list cache `key` to `value`.
*
* @private
* @name set
* @memberOf ListCache
* @param {string} key The key of the value to set.
* @param {*} value The value to set.
* @returns {Object} Returns the list cache instance.
*/
function listCacheSet(key, value) {
	var data = this.__data__, index = assocIndexOf(data, key);
	if (index < 0) {
		++this.size;
		data.push([key, value]);
	} else data[index][1] = value;
	return this;
}
//#endregion
//#region node_modules/lodash-es/_ListCache.js
/**
* Creates an list cache object.
*
* @private
* @constructor
* @param {Array} [entries] The key-value pairs to cache.
*/
function ListCache(entries) {
	var index = -1, length = entries == null ? 0 : entries.length;
	this.clear();
	while (++index < length) {
		var entry = entries[index];
		this.set(entry[0], entry[1]);
	}
}
ListCache.prototype.clear = listCacheClear;
ListCache.prototype["delete"] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
//#endregion
//#region node_modules/lodash-es/_Map.js
var Map$1 = getNative(root, "Map");
//#endregion
//#region node_modules/lodash-es/_mapCacheClear.js
/**
* Removes all key-value entries from the map.
*
* @private
* @name clear
* @memberOf MapCache
*/
function mapCacheClear() {
	this.size = 0;
	this.__data__ = {
		"hash": new Hash(),
		"map": new (Map$1 || ListCache)(),
		"string": new Hash()
	};
}
//#endregion
//#region node_modules/lodash-es/_isKeyable.js
/**
* Checks if `value` is suitable for use as unique object key.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is suitable, else `false`.
*/
function isKeyable(value) {
	var type = typeof value;
	return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
}
//#endregion
//#region node_modules/lodash-es/_getMapData.js
/**
* Gets the data for `map`.
*
* @private
* @param {Object} map The map to query.
* @param {string} key The reference key.
* @returns {*} Returns the map data.
*/
function getMapData(map, key) {
	var data = map.__data__;
	return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
//#endregion
//#region node_modules/lodash-es/_mapCacheDelete.js
/**
* Removes `key` and its value from the map.
*
* @private
* @name delete
* @memberOf MapCache
* @param {string} key The key of the value to remove.
* @returns {boolean} Returns `true` if the entry was removed, else `false`.
*/
function mapCacheDelete(key) {
	var result = getMapData(this, key)["delete"](key);
	this.size -= result ? 1 : 0;
	return result;
}
//#endregion
//#region node_modules/lodash-es/_mapCacheGet.js
/**
* Gets the map value for `key`.
*
* @private
* @name get
* @memberOf MapCache
* @param {string} key The key of the value to get.
* @returns {*} Returns the entry value.
*/
function mapCacheGet(key) {
	return getMapData(this, key).get(key);
}
//#endregion
//#region node_modules/lodash-es/_mapCacheHas.js
/**
* Checks if a map value for `key` exists.
*
* @private
* @name has
* @memberOf MapCache
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function mapCacheHas(key) {
	return getMapData(this, key).has(key);
}
//#endregion
//#region node_modules/lodash-es/_mapCacheSet.js
/**
* Sets the map `key` to `value`.
*
* @private
* @name set
* @memberOf MapCache
* @param {string} key The key of the value to set.
* @param {*} value The value to set.
* @returns {Object} Returns the map cache instance.
*/
function mapCacheSet(key, value) {
	var data = getMapData(this, key), size = data.size;
	data.set(key, value);
	this.size += data.size == size ? 0 : 1;
	return this;
}
//#endregion
//#region node_modules/lodash-es/_MapCache.js
/**
* Creates a map cache object to store key-value pairs.
*
* @private
* @constructor
* @param {Array} [entries] The key-value pairs to cache.
*/
function MapCache(entries) {
	var index = -1, length = entries == null ? 0 : entries.length;
	this.clear();
	while (++index < length) {
		var entry = entries[index];
		this.set(entry[0], entry[1]);
	}
}
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype["delete"] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
//#endregion
//#region node_modules/lodash-es/memoize.js
/** Error message constants. */
var FUNC_ERROR_TEXT$1 = "Expected a function";
/**
* Creates a function that memoizes the result of `func`. If `resolver` is
* provided, it determines the cache key for storing the result based on the
* arguments provided to the memoized function. By default, the first argument
* provided to the memoized function is used as the map cache key. The `func`
* is invoked with the `this` binding of the memoized function.
*
* **Note:** The cache is exposed as the `cache` property on the memoized
* function. Its creation may be customized by replacing the `_.memoize.Cache`
* constructor with one whose instances implement the
* [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
* method interface of `clear`, `delete`, `get`, `has`, and `set`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Function
* @param {Function} func The function to have its output memoized.
* @param {Function} [resolver] The function to resolve the cache key.
* @returns {Function} Returns the new memoized function.
* @example
*
* var object = { 'a': 1, 'b': 2 };
* var other = { 'c': 3, 'd': 4 };
*
* var values = _.memoize(_.values);
* values(object);
* // => [1, 2]
*
* values(other);
* // => [3, 4]
*
* object.a = 2;
* values(object);
* // => [1, 2]
*
* // Modify the result cache.
* values.cache.set(object, ['a', 'b']);
* values(object);
* // => ['a', 'b']
*
* // Replace `_.memoize.Cache`.
* _.memoize.Cache = WeakMap;
*/
function memoize(func, resolver) {
	if (typeof func != "function" || resolver != null && typeof resolver != "function") throw new TypeError(FUNC_ERROR_TEXT$1);
	var memoized = function() {
		var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
		if (cache.has(key)) return cache.get(key);
		var result = func.apply(this, args);
		memoized.cache = cache.set(key, result) || cache;
		return result;
	};
	memoized.cache = new (memoize.Cache || MapCache)();
	return memoized;
}
memoize.Cache = MapCache;
//#endregion
//#region node_modules/lodash-es/_memoizeCapped.js
/** Used as the maximum memoize cache size. */
var MAX_MEMOIZE_SIZE = 500;
/**
* A specialized version of `_.memoize` which clears the memoized function's
* cache when it exceeds `MAX_MEMOIZE_SIZE`.
*
* @private
* @param {Function} func The function to have its output memoized.
* @returns {Function} Returns the new memoized function.
*/
function memoizeCapped(func) {
	var result = memoize(func, function(key) {
		if (cache.size === MAX_MEMOIZE_SIZE) cache.clear();
		return key;
	});
	var cache = result.cache;
	return result;
}
//#endregion
//#region node_modules/lodash-es/_stringToPath.js
/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;
/**
* Converts `string` to a property path array.
*
* @private
* @param {string} string The string to convert.
* @returns {Array} Returns the property path array.
*/
var stringToPath = memoizeCapped(function(string) {
	var result = [];
	if (string.charCodeAt(0) === 46) result.push("");
	string.replace(rePropName, function(match, number, quote, subString) {
		result.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
	});
	return result;
});
//#endregion
//#region node_modules/lodash-es/toString.js
/**
* Converts `value` to a string. An empty string is returned for `null`
* and `undefined` values. The sign of `-0` is preserved.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to convert.
* @returns {string} Returns the converted string.
* @example
*
* _.toString(null);
* // => ''
*
* _.toString(-0);
* // => '-0'
*
* _.toString([1, 2, 3]);
* // => '1,2,3'
*/
function toString$1(value) {
	return value == null ? "" : baseToString(value);
}
//#endregion
//#region node_modules/lodash-es/_castPath.js
/**
* Casts `value` to a path array if it's not one.
*
* @private
* @param {*} value The value to inspect.
* @param {Object} [object] The object to query keys on.
* @returns {Array} Returns the cast property path array.
*/
function castPath(value, object) {
	if (isArray(value)) return value;
	return isKey(value, object) ? [value] : stringToPath(toString$1(value));
}
//#endregion
//#region node_modules/lodash-es/_toKey.js
/** Used as references for various `Number` constants. */
var INFINITY = Infinity;
/**
* Converts `value` to a string key if it's not a string or symbol.
*
* @private
* @param {*} value The value to inspect.
* @returns {string|symbol} Returns the key.
*/
function toKey(value) {
	if (typeof value == "string" || isSymbol(value)) return value;
	var result = value + "";
	return result == "0" && 1 / value == -INFINITY ? "-0" : result;
}
//#endregion
//#region node_modules/lodash-es/_baseGet.js
/**
* The base implementation of `_.get` without support for default values.
*
* @private
* @param {Object} object The object to query.
* @param {Array|string} path The path of the property to get.
* @returns {*} Returns the resolved value.
*/
function baseGet(object, path) {
	path = castPath(path, object);
	var index = 0, length = path.length;
	while (object != null && index < length) object = object[toKey(path[index++])];
	return index && index == length ? object : void 0;
}
//#endregion
//#region node_modules/lodash-es/get.js
/**
* Gets the value at `path` of `object`. If the resolved value is
* `undefined`, the `defaultValue` is returned in its place.
*
* @static
* @memberOf _
* @since 3.7.0
* @category Object
* @param {Object} object The object to query.
* @param {Array|string} path The path of the property to get.
* @param {*} [defaultValue] The value returned for `undefined` resolved values.
* @returns {*} Returns the resolved value.
* @example
*
* var object = { 'a': [{ 'b': { 'c': 3 } }] };
*
* _.get(object, 'a[0].b.c');
* // => 3
*
* _.get(object, ['a', '0', 'b', 'c']);
* // => 3
*
* _.get(object, 'a.b.c', 'default');
* // => 'default'
*/
function get(object, path, defaultValue) {
	var result = object == null ? void 0 : baseGet(object, path);
	return result === void 0 ? defaultValue : result;
}
//#endregion
//#region node_modules/lodash-es/_arrayPush.js
/**
* Appends the elements of `values` to `array`.
*
* @private
* @param {Array} array The array to modify.
* @param {Array} values The values to append.
* @returns {Array} Returns `array`.
*/
function arrayPush(array, values) {
	var index = -1, length = values.length, offset = array.length;
	while (++index < length) array[offset + index] = values[index];
	return array;
}
//#endregion
//#region node_modules/lodash-es/_isFlattenable.js
/** Built-in value references. */
var spreadableSymbol = Symbol$1 ? Symbol$1.isConcatSpreadable : void 0;
/**
* Checks if `value` is a flattenable `arguments` object or array.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
*/
function isFlattenable(value) {
	return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
}
//#endregion
//#region node_modules/lodash-es/_baseFlatten.js
/**
* The base implementation of `_.flatten` with support for restricting flattening.
*
* @private
* @param {Array} array The array to flatten.
* @param {number} depth The maximum recursion depth.
* @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
* @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
* @param {Array} [result=[]] The initial result value.
* @returns {Array} Returns the new flattened array.
*/
function baseFlatten(array, depth, predicate, isStrict, result) {
	var index = -1, length = array.length;
	predicate || (predicate = isFlattenable);
	result || (result = []);
	while (++index < length) {
		var value = array[index];
		if (depth > 0 && predicate(value)) if (depth > 1) baseFlatten(value, depth - 1, predicate, isStrict, result);
		else arrayPush(result, value);
		else if (!isStrict) result[result.length] = value;
	}
	return result;
}
//#endregion
//#region node_modules/lodash-es/flatten.js
/**
* Flattens `array` a single level deep.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Array
* @param {Array} array The array to flatten.
* @returns {Array} Returns the new flattened array.
* @example
*
* _.flatten([1, [2, [3, [4]], 5]]);
* // => [1, 2, [3, [4]], 5]
*/
function flatten(array) {
	return (array == null ? 0 : array.length) ? baseFlatten(array, 1) : [];
}
//#endregion
//#region node_modules/lodash-es/_flatRest.js
/**
* A specialized version of `baseRest` which flattens the rest array.
*
* @private
* @param {Function} func The function to apply a rest parameter to.
* @returns {Function} Returns the new function.
*/
function flatRest(func) {
	return setToString(overRest(func, void 0, flatten), func + "");
}
//#endregion
//#region node_modules/lodash-es/_getPrototype.js
/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);
//#endregion
//#region node_modules/lodash-es/isPlainObject.js
/** `Object#toString` result references. */
var objectTag$3 = "[object Object]";
/** Used for built-in method references. */
var funcProto = Function.prototype;
var objectProto = Object.prototype;
/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;
/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto.hasOwnProperty;
/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);
/**
* Checks if `value` is a plain object, that is, an object created by the
* `Object` constructor or one with a `[[Prototype]]` of `null`.
*
* @static
* @memberOf _
* @since 0.8.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
* @example
*
* function Foo() {
*   this.a = 1;
* }
*
* _.isPlainObject(new Foo);
* // => false
*
* _.isPlainObject([1, 2, 3]);
* // => false
*
* _.isPlainObject({ 'x': 0, 'y': 0 });
* // => true
*
* _.isPlainObject(Object.create(null));
* // => true
*/
function isPlainObject(value) {
	if (!isObjectLike(value) || baseGetTag(value) != objectTag$3) return false;
	var proto = getPrototype(value);
	if (proto === null) return true;
	var Ctor = hasOwnProperty$4.call(proto, "constructor") && proto.constructor;
	return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
}
//#endregion
//#region node_modules/lodash-es/_baseSlice.js
/**
* The base implementation of `_.slice` without an iteratee call guard.
*
* @private
* @param {Array} array The array to slice.
* @param {number} [start=0] The start position.
* @param {number} [end=array.length] The end position.
* @returns {Array} Returns the slice of `array`.
*/
function baseSlice(array, start, end) {
	var index = -1, length = array.length;
	if (start < 0) start = -start > length ? 0 : length + start;
	end = end > length ? length : end;
	if (end < 0) end += length;
	length = start > end ? 0 : end - start >>> 0;
	start >>>= 0;
	var result = Array(length);
	while (++index < length) result[index] = array[index + start];
	return result;
}
//#endregion
//#region node_modules/lodash-es/castArray.js
/**
* Casts `value` as an array if it's not one.
*
* @static
* @memberOf _
* @since 4.4.0
* @category Lang
* @param {*} value The value to inspect.
* @returns {Array} Returns the cast array.
* @example
*
* _.castArray(1);
* // => [1]
*
* _.castArray({ 'a': 1 });
* // => [{ 'a': 1 }]
*
* _.castArray('abc');
* // => ['abc']
*
* _.castArray(null);
* // => [null]
*
* _.castArray(undefined);
* // => [undefined]
*
* _.castArray();
* // => []
*
* var array = [1, 2, 3];
* console.log(_.castArray(array) === array);
* // => true
*/
function castArray$1() {
	if (!arguments.length) return [];
	var value = arguments[0];
	return isArray(value) ? value : [value];
}
//#endregion
//#region node_modules/lodash-es/_baseClamp.js
/**
* The base implementation of `_.clamp` which doesn't coerce arguments.
*
* @private
* @param {number} number The number to clamp.
* @param {number} [lower] The lower bound.
* @param {number} upper The upper bound.
* @returns {number} Returns the clamped number.
*/
function baseClamp(number, lower, upper) {
	if (number === number) {
		if (upper !== void 0) number = number <= upper ? number : upper;
		if (lower !== void 0) number = number >= lower ? number : lower;
	}
	return number;
}
//#endregion
//#region node_modules/lodash-es/clamp.js
/**
* Clamps `number` within the inclusive `lower` and `upper` bounds.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Number
* @param {number} number The number to clamp.
* @param {number} [lower] The lower bound.
* @param {number} upper The upper bound.
* @returns {number} Returns the clamped number.
* @example
*
* _.clamp(-10, -5, 5);
* // => -5
*
* _.clamp(10, -5, 5);
* // => 5
*/
function clamp$1(number, lower, upper) {
	if (upper === void 0) {
		upper = lower;
		lower = void 0;
	}
	if (upper !== void 0) {
		upper = toNumber(upper);
		upper = upper === upper ? upper : 0;
	}
	if (lower !== void 0) {
		lower = toNumber(lower);
		lower = lower === lower ? lower : 0;
	}
	return baseClamp(toNumber(number), lower, upper);
}
//#endregion
//#region node_modules/lodash-es/_stackClear.js
/**
* Removes all key-value entries from the stack.
*
* @private
* @name clear
* @memberOf Stack
*/
function stackClear() {
	this.__data__ = new ListCache();
	this.size = 0;
}
//#endregion
//#region node_modules/lodash-es/_stackDelete.js
/**
* Removes `key` and its value from the stack.
*
* @private
* @name delete
* @memberOf Stack
* @param {string} key The key of the value to remove.
* @returns {boolean} Returns `true` if the entry was removed, else `false`.
*/
function stackDelete(key) {
	var data = this.__data__, result = data["delete"](key);
	this.size = data.size;
	return result;
}
//#endregion
//#region node_modules/lodash-es/_stackGet.js
/**
* Gets the stack value for `key`.
*
* @private
* @name get
* @memberOf Stack
* @param {string} key The key of the value to get.
* @returns {*} Returns the entry value.
*/
function stackGet(key) {
	return this.__data__.get(key);
}
//#endregion
//#region node_modules/lodash-es/_stackHas.js
/**
* Checks if a stack value for `key` exists.
*
* @private
* @name has
* @memberOf Stack
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function stackHas(key) {
	return this.__data__.has(key);
}
//#endregion
//#region node_modules/lodash-es/_stackSet.js
/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;
/**
* Sets the stack `key` to `value`.
*
* @private
* @name set
* @memberOf Stack
* @param {string} key The key of the value to set.
* @param {*} value The value to set.
* @returns {Object} Returns the stack cache instance.
*/
function stackSet(key, value) {
	var data = this.__data__;
	if (data instanceof ListCache) {
		var pairs = data.__data__;
		if (!Map$1 || pairs.length < LARGE_ARRAY_SIZE - 1) {
			pairs.push([key, value]);
			this.size = ++data.size;
			return this;
		}
		data = this.__data__ = new MapCache(pairs);
	}
	data.set(key, value);
	this.size = data.size;
	return this;
}
//#endregion
//#region node_modules/lodash-es/_Stack.js
/**
* Creates a stack cache object to store key-value pairs.
*
* @private
* @constructor
* @param {Array} [entries] The key-value pairs to cache.
*/
function Stack(entries) {
	var data = this.__data__ = new ListCache(entries);
	this.size = data.size;
}
Stack.prototype.clear = stackClear;
Stack.prototype["delete"] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;
//#endregion
//#region node_modules/lodash-es/_baseAssign.js
/**
* The base implementation of `_.assign` without support for multiple sources
* or `customizer` functions.
*
* @private
* @param {Object} object The destination object.
* @param {Object} source The source object.
* @returns {Object} Returns `object`.
*/
function baseAssign(object, source) {
	return object && copyObject(source, keys(source), object);
}
//#endregion
//#region node_modules/lodash-es/_baseAssignIn.js
/**
* The base implementation of `_.assignIn` without support for multiple sources
* or `customizer` functions.
*
* @private
* @param {Object} object The destination object.
* @param {Object} source The source object.
* @returns {Object} Returns `object`.
*/
function baseAssignIn(object, source) {
	return object && copyObject(source, keysIn(source), object);
}
//#endregion
//#region node_modules/lodash-es/_cloneBuffer.js
/** Detect free variable `exports`. */
var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
/** Built-in value references. */
var Buffer = freeModule && freeModule.exports === freeExports ? root.Buffer : void 0;
var allocUnsafe = Buffer ? Buffer.allocUnsafe : void 0;
/**
* Creates a clone of  `buffer`.
*
* @private
* @param {Buffer} buffer The buffer to clone.
* @param {boolean} [isDeep] Specify a deep clone.
* @returns {Buffer} Returns the cloned buffer.
*/
function cloneBuffer(buffer, isDeep) {
	if (isDeep) return buffer.slice();
	var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
	buffer.copy(result);
	return result;
}
//#endregion
//#region node_modules/lodash-es/_arrayFilter.js
/**
* A specialized version of `_.filter` for arrays without support for
* iteratee shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} predicate The function invoked per iteration.
* @returns {Array} Returns the new filtered array.
*/
function arrayFilter(array, predicate) {
	var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
	while (++index < length) {
		var value = array[index];
		if (predicate(value, index, array)) result[resIndex++] = value;
	}
	return result;
}
//#endregion
//#region node_modules/lodash-es/stubArray.js
/**
* This method returns a new empty array.
*
* @static
* @memberOf _
* @since 4.13.0
* @category Util
* @returns {Array} Returns the new empty array.
* @example
*
* var arrays = _.times(2, _.stubArray);
*
* console.log(arrays);
* // => [[], []]
*
* console.log(arrays[0] === arrays[1]);
* // => false
*/
function stubArray() {
	return [];
}
//#endregion
//#region node_modules/lodash-es/_getSymbols.js
/** Built-in value references. */
var propertyIsEnumerable = Object.prototype.propertyIsEnumerable;
var nativeGetSymbols = Object.getOwnPropertySymbols;
/**
* Creates an array of the own enumerable symbols of `object`.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of symbols.
*/
var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
	if (object == null) return [];
	object = Object(object);
	return arrayFilter(nativeGetSymbols(object), function(symbol) {
		return propertyIsEnumerable.call(object, symbol);
	});
};
//#endregion
//#region node_modules/lodash-es/_copySymbols.js
/**
* Copies own symbols of `source` to `object`.
*
* @private
* @param {Object} source The object to copy symbols from.
* @param {Object} [object={}] The object to copy symbols to.
* @returns {Object} Returns `object`.
*/
function copySymbols(source, object) {
	return copyObject(source, getSymbols(source), object);
}
//#endregion
//#region node_modules/lodash-es/_getSymbolsIn.js
/**
* Creates an array of the own and inherited enumerable symbols of `object`.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of symbols.
*/
var getSymbolsIn = !Object.getOwnPropertySymbols ? stubArray : function(object) {
	var result = [];
	while (object) {
		arrayPush(result, getSymbols(object));
		object = getPrototype(object);
	}
	return result;
};
//#endregion
//#region node_modules/lodash-es/_copySymbolsIn.js
/**
* Copies own and inherited symbols of `source` to `object`.
*
* @private
* @param {Object} source The object to copy symbols from.
* @param {Object} [object={}] The object to copy symbols to.
* @returns {Object} Returns `object`.
*/
function copySymbolsIn(source, object) {
	return copyObject(source, getSymbolsIn(source), object);
}
//#endregion
//#region node_modules/lodash-es/_baseGetAllKeys.js
/**
* The base implementation of `getAllKeys` and `getAllKeysIn` which uses
* `keysFunc` and `symbolsFunc` to get the enumerable property names and
* symbols of `object`.
*
* @private
* @param {Object} object The object to query.
* @param {Function} keysFunc The function to get the keys of `object`.
* @param {Function} symbolsFunc The function to get the symbols of `object`.
* @returns {Array} Returns the array of property names and symbols.
*/
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
	var result = keysFunc(object);
	return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}
//#endregion
//#region node_modules/lodash-es/_getAllKeys.js
/**
* Creates an array of own enumerable property names and symbols of `object`.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names and symbols.
*/
function getAllKeys(object) {
	return baseGetAllKeys(object, keys, getSymbols);
}
//#endregion
//#region node_modules/lodash-es/_getAllKeysIn.js
/**
* Creates an array of own and inherited enumerable property names and
* symbols of `object`.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the array of property names and symbols.
*/
function getAllKeysIn(object) {
	return baseGetAllKeys(object, keysIn, getSymbolsIn);
}
//#endregion
//#region node_modules/lodash-es/_DataView.js
var DataView = getNative(root, "DataView");
//#endregion
//#region node_modules/lodash-es/_Promise.js
var Promise$1 = getNative(root, "Promise");
//#endregion
//#region node_modules/lodash-es/_Set.js
var Set$1 = getNative(root, "Set");
//#endregion
//#region node_modules/lodash-es/_getTag.js
/** `Object#toString` result references. */
var mapTag$4 = "[object Map]";
var objectTag$2 = "[object Object]";
var promiseTag = "[object Promise]";
var setTag$4 = "[object Set]";
var weakMapTag$1 = "[object WeakMap]";
var dataViewTag$3 = "[object DataView]";
/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView);
var mapCtorString = toSource(Map$1);
var promiseCtorString = toSource(Promise$1);
var setCtorString = toSource(Set$1);
var weakMapCtorString = toSource(WeakMap$1);
/**
* Gets the `toStringTag` of `value`.
*
* @private
* @param {*} value The value to query.
* @returns {string} Returns the `toStringTag`.
*/
var getTag = baseGetTag;
if (DataView && getTag(new DataView(/* @__PURE__ */ new ArrayBuffer(1))) != dataViewTag$3 || Map$1 && getTag(new Map$1()) != mapTag$4 || Promise$1 && getTag(Promise$1.resolve()) != promiseTag || Set$1 && getTag(new Set$1()) != setTag$4 || WeakMap$1 && getTag(new WeakMap$1()) != weakMapTag$1) getTag = function(value) {
	var result = baseGetTag(value), Ctor = result == objectTag$2 ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
	if (ctorString) switch (ctorString) {
		case dataViewCtorString: return dataViewTag$3;
		case mapCtorString: return mapTag$4;
		case promiseCtorString: return promiseTag;
		case setCtorString: return setTag$4;
		case weakMapCtorString: return weakMapTag$1;
	}
	return result;
};
var _getTag_default = getTag;
//#endregion
//#region node_modules/lodash-es/_initCloneArray.js
/** Used to check objects for own properties. */
var hasOwnProperty$3 = Object.prototype.hasOwnProperty;
/**
* Initializes an array clone.
*
* @private
* @param {Array} array The array to clone.
* @returns {Array} Returns the initialized clone.
*/
function initCloneArray(array) {
	var length = array.length, result = new array.constructor(length);
	if (length && typeof array[0] == "string" && hasOwnProperty$3.call(array, "index")) {
		result.index = array.index;
		result.input = array.input;
	}
	return result;
}
//#endregion
//#region node_modules/lodash-es/_Uint8Array.js
/** Built-in value references. */
var Uint8Array$1 = root.Uint8Array;
//#endregion
//#region node_modules/lodash-es/_cloneArrayBuffer.js
/**
* Creates a clone of `arrayBuffer`.
*
* @private
* @param {ArrayBuffer} arrayBuffer The array buffer to clone.
* @returns {ArrayBuffer} Returns the cloned array buffer.
*/
function cloneArrayBuffer(arrayBuffer) {
	var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
	new Uint8Array$1(result).set(new Uint8Array$1(arrayBuffer));
	return result;
}
//#endregion
//#region node_modules/lodash-es/_cloneDataView.js
/**
* Creates a clone of `dataView`.
*
* @private
* @param {Object} dataView The data view to clone.
* @param {boolean} [isDeep] Specify a deep clone.
* @returns {Object} Returns the cloned data view.
*/
function cloneDataView(dataView, isDeep) {
	var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
	return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}
//#endregion
//#region node_modules/lodash-es/_cloneRegExp.js
/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;
/**
* Creates a clone of `regexp`.
*
* @private
* @param {Object} regexp The regexp to clone.
* @returns {Object} Returns the cloned regexp.
*/
function cloneRegExp(regexp) {
	var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
	result.lastIndex = regexp.lastIndex;
	return result;
}
//#endregion
//#region node_modules/lodash-es/_cloneSymbol.js
/** Used to convert symbols to primitives and strings. */
var symbolProto$1 = Symbol$1 ? Symbol$1.prototype : void 0;
var symbolValueOf$1 = symbolProto$1 ? symbolProto$1.valueOf : void 0;
/**
* Creates a clone of the `symbol` object.
*
* @private
* @param {Object} symbol The symbol object to clone.
* @returns {Object} Returns the cloned symbol object.
*/
function cloneSymbol(symbol) {
	return symbolValueOf$1 ? Object(symbolValueOf$1.call(symbol)) : {};
}
//#endregion
//#region node_modules/lodash-es/_cloneTypedArray.js
/**
* Creates a clone of `typedArray`.
*
* @private
* @param {Object} typedArray The typed array to clone.
* @param {boolean} [isDeep] Specify a deep clone.
* @returns {Object} Returns the cloned typed array.
*/
function cloneTypedArray(typedArray, isDeep) {
	var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
	return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
//#endregion
//#region node_modules/lodash-es/_initCloneByTag.js
/** `Object#toString` result references. */
var boolTag$2 = "[object Boolean]";
var dateTag$2 = "[object Date]";
var mapTag$3 = "[object Map]";
var numberTag$2 = "[object Number]";
var regexpTag$2 = "[object RegExp]";
var setTag$3 = "[object Set]";
var stringTag$2 = "[object String]";
var symbolTag$2 = "[object Symbol]";
var arrayBufferTag$2 = "[object ArrayBuffer]";
var dataViewTag$2 = "[object DataView]";
var float32Tag$1 = "[object Float32Array]";
var float64Tag$1 = "[object Float64Array]";
var int8Tag$1 = "[object Int8Array]";
var int16Tag$1 = "[object Int16Array]";
var int32Tag$1 = "[object Int32Array]";
var uint8Tag$1 = "[object Uint8Array]";
var uint8ClampedTag$1 = "[object Uint8ClampedArray]";
var uint16Tag$1 = "[object Uint16Array]";
var uint32Tag$1 = "[object Uint32Array]";
/**
* Initializes an object clone based on its `toStringTag`.
*
* **Note:** This function only supports cloning values with tags of
* `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
*
* @private
* @param {Object} object The object to clone.
* @param {string} tag The `toStringTag` of the object to clone.
* @param {boolean} [isDeep] Specify a deep clone.
* @returns {Object} Returns the initialized clone.
*/
function initCloneByTag(object, tag, isDeep) {
	var Ctor = object.constructor;
	switch (tag) {
		case arrayBufferTag$2: return cloneArrayBuffer(object);
		case boolTag$2:
		case dateTag$2: return new Ctor(+object);
		case dataViewTag$2: return cloneDataView(object, isDeep);
		case float32Tag$1:
		case float64Tag$1:
		case int8Tag$1:
		case int16Tag$1:
		case int32Tag$1:
		case uint8Tag$1:
		case uint8ClampedTag$1:
		case uint16Tag$1:
		case uint32Tag$1: return cloneTypedArray(object, isDeep);
		case mapTag$3: return new Ctor();
		case numberTag$2:
		case stringTag$2: return new Ctor(object);
		case regexpTag$2: return cloneRegExp(object);
		case setTag$3: return new Ctor();
		case symbolTag$2: return cloneSymbol(object);
	}
}
//#endregion
//#region node_modules/lodash-es/_initCloneObject.js
/**
* Initializes an object clone.
*
* @private
* @param {Object} object The object to clone.
* @returns {Object} Returns the initialized clone.
*/
function initCloneObject(object) {
	return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
}
//#endregion
//#region node_modules/lodash-es/_baseIsMap.js
/** `Object#toString` result references. */
var mapTag$2 = "[object Map]";
/**
* The base implementation of `_.isMap` without Node.js optimizations.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a map, else `false`.
*/
function baseIsMap(value) {
	return isObjectLike(value) && _getTag_default(value) == mapTag$2;
}
//#endregion
//#region node_modules/lodash-es/isMap.js
var nodeIsMap = nodeUtil && nodeUtil.isMap;
/**
* Checks if `value` is classified as a `Map` object.
*
* @static
* @memberOf _
* @since 4.3.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a map, else `false`.
* @example
*
* _.isMap(new Map);
* // => true
*
* _.isMap(new WeakMap);
* // => false
*/
var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
//#endregion
//#region node_modules/lodash-es/_baseIsSet.js
/** `Object#toString` result references. */
var setTag$2 = "[object Set]";
/**
* The base implementation of `_.isSet` without Node.js optimizations.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a set, else `false`.
*/
function baseIsSet(value) {
	return isObjectLike(value) && _getTag_default(value) == setTag$2;
}
//#endregion
//#region node_modules/lodash-es/isSet.js
var nodeIsSet = nodeUtil && nodeUtil.isSet;
/**
* Checks if `value` is classified as a `Set` object.
*
* @static
* @memberOf _
* @since 4.3.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is a set, else `false`.
* @example
*
* _.isSet(new Set);
* // => true
*
* _.isSet(new WeakSet);
* // => false
*/
var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
//#endregion
//#region node_modules/lodash-es/_baseClone.js
/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG$1 = 1;
var CLONE_FLAT_FLAG$1 = 2;
var CLONE_SYMBOLS_FLAG$1 = 4;
/** `Object#toString` result references. */
var argsTag$1 = "[object Arguments]";
var arrayTag$1 = "[object Array]";
var boolTag$1 = "[object Boolean]";
var dateTag$1 = "[object Date]";
var errorTag$1 = "[object Error]";
var funcTag = "[object Function]";
var genTag = "[object GeneratorFunction]";
var mapTag$1 = "[object Map]";
var numberTag$1 = "[object Number]";
var objectTag$1 = "[object Object]";
var regexpTag$1 = "[object RegExp]";
var setTag$1 = "[object Set]";
var stringTag$1 = "[object String]";
var symbolTag$1 = "[object Symbol]";
var weakMapTag = "[object WeakMap]";
var arrayBufferTag$1 = "[object ArrayBuffer]";
var dataViewTag$1 = "[object DataView]";
var float32Tag = "[object Float32Array]";
var float64Tag = "[object Float64Array]";
var int8Tag = "[object Int8Array]";
var int16Tag = "[object Int16Array]";
var int32Tag = "[object Int32Array]";
var uint8Tag = "[object Uint8Array]";
var uint8ClampedTag = "[object Uint8ClampedArray]";
var uint16Tag = "[object Uint16Array]";
var uint32Tag = "[object Uint32Array]";
/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag$1] = cloneableTags[arrayTag$1] = cloneableTags[arrayBufferTag$1] = cloneableTags[dataViewTag$1] = cloneableTags[boolTag$1] = cloneableTags[dateTag$1] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag$1] = cloneableTags[numberTag$1] = cloneableTags[objectTag$1] = cloneableTags[regexpTag$1] = cloneableTags[setTag$1] = cloneableTags[stringTag$1] = cloneableTags[symbolTag$1] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag$1] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
/**
* The base implementation of `_.clone` and `_.cloneDeep` which tracks
* traversed objects.
*
* @private
* @param {*} value The value to clone.
* @param {boolean} bitmask The bitmask flags.
*  1 - Deep clone
*  2 - Flatten inherited properties
*  4 - Clone symbols
* @param {Function} [customizer] The function to customize cloning.
* @param {string} [key] The key of `value`.
* @param {Object} [object] The parent object of `value`.
* @param {Object} [stack] Tracks traversed objects and their clone counterparts.
* @returns {*} Returns the cloned value.
*/
function baseClone(value, bitmask, customizer, key, object, stack) {
	var result, isDeep = bitmask & CLONE_DEEP_FLAG$1, isFlat = bitmask & CLONE_FLAT_FLAG$1, isFull = bitmask & CLONE_SYMBOLS_FLAG$1;
	if (customizer) result = object ? customizer(value, key, object, stack) : customizer(value);
	if (result !== void 0) return result;
	if (!isObject$1(value)) return value;
	var isArr = isArray(value);
	if (isArr) {
		result = initCloneArray(value);
		if (!isDeep) return copyArray(value, result);
	} else {
		var tag = _getTag_default(value), isFunc = tag == funcTag || tag == genTag;
		if (isBuffer(value)) return cloneBuffer(value, isDeep);
		if (tag == objectTag$1 || tag == argsTag$1 || isFunc && !object) {
			result = isFlat || isFunc ? {} : initCloneObject(value);
			if (!isDeep) return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
		} else {
			if (!cloneableTags[tag]) return object ? value : {};
			result = initCloneByTag(value, tag, isDeep);
		}
	}
	stack || (stack = new Stack());
	var stacked = stack.get(value);
	if (stacked) return stacked;
	stack.set(value, result);
	if (isSet(value)) value.forEach(function(subValue) {
		result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
	});
	else if (isMap(value)) value.forEach(function(subValue, key) {
		result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
	});
	var props = isArr ? void 0 : (isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys)(value);
	arrayEach(props || value, function(subValue, key) {
		if (props) {
			key = subValue;
			subValue = value[key];
		}
		assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
	});
	return result;
}
//#endregion
//#region node_modules/lodash-es/_setCacheAdd.js
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = "__lodash_hash_undefined__";
/**
* Adds `value` to the array cache.
*
* @private
* @name add
* @memberOf SetCache
* @alias push
* @param {*} value The value to cache.
* @returns {Object} Returns the cache instance.
*/
function setCacheAdd(value) {
	this.__data__.set(value, HASH_UNDEFINED);
	return this;
}
//#endregion
//#region node_modules/lodash-es/_setCacheHas.js
/**
* Checks if `value` is in the array cache.
*
* @private
* @name has
* @memberOf SetCache
* @param {*} value The value to search for.
* @returns {boolean} Returns `true` if `value` is found, else `false`.
*/
function setCacheHas(value) {
	return this.__data__.has(value);
}
//#endregion
//#region node_modules/lodash-es/_SetCache.js
/**
*
* Creates an array cache object to store unique values.
*
* @private
* @constructor
* @param {Array} [values] The values to cache.
*/
function SetCache(values) {
	var index = -1, length = values == null ? 0 : values.length;
	this.__data__ = new MapCache();
	while (++index < length) this.add(values[index]);
}
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;
//#endregion
//#region node_modules/lodash-es/_arraySome.js
/**
* A specialized version of `_.some` for arrays without support for iteratee
* shorthands.
*
* @private
* @param {Array} [array] The array to iterate over.
* @param {Function} predicate The function invoked per iteration.
* @returns {boolean} Returns `true` if any element passes the predicate check,
*  else `false`.
*/
function arraySome(array, predicate) {
	var index = -1, length = array == null ? 0 : array.length;
	while (++index < length) if (predicate(array[index], index, array)) return true;
	return false;
}
//#endregion
//#region node_modules/lodash-es/_cacheHas.js
/**
* Checks if a `cache` value for `key` exists.
*
* @private
* @param {Object} cache The cache to query.
* @param {string} key The key of the entry to check.
* @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
*/
function cacheHas(cache, key) {
	return cache.has(key);
}
//#endregion
//#region node_modules/lodash-es/_equalArrays.js
/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$5 = 1;
var COMPARE_UNORDERED_FLAG$3 = 2;
/**
* A specialized version of `baseIsEqualDeep` for arrays with support for
* partial deep comparisons.
*
* @private
* @param {Array} array The array to compare.
* @param {Array} other The other array to compare.
* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
* @param {Function} customizer The function to customize comparisons.
* @param {Function} equalFunc The function to determine equivalents of values.
* @param {Object} stack Tracks traversed `array` and `other` objects.
* @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
*/
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
	var isPartial = bitmask & COMPARE_PARTIAL_FLAG$5, arrLength = array.length, othLength = other.length;
	if (arrLength != othLength && !(isPartial && othLength > arrLength)) return false;
	var arrStacked = stack.get(array);
	var othStacked = stack.get(other);
	if (arrStacked && othStacked) return arrStacked == other && othStacked == array;
	var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG$3 ? new SetCache() : void 0;
	stack.set(array, other);
	stack.set(other, array);
	while (++index < arrLength) {
		var arrValue = array[index], othValue = other[index];
		if (customizer) var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
		if (compared !== void 0) {
			if (compared) continue;
			result = false;
			break;
		}
		if (seen) {
			if (!arraySome(other, function(othValue, othIndex) {
				if (!cacheHas(seen, othIndex) && (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) return seen.push(othIndex);
			})) {
				result = false;
				break;
			}
		} else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
			result = false;
			break;
		}
	}
	stack["delete"](array);
	stack["delete"](other);
	return result;
}
//#endregion
//#region node_modules/lodash-es/_mapToArray.js
/**
* Converts `map` to its key-value pairs.
*
* @private
* @param {Object} map The map to convert.
* @returns {Array} Returns the key-value pairs.
*/
function mapToArray(map) {
	var index = -1, result = Array(map.size);
	map.forEach(function(value, key) {
		result[++index] = [key, value];
	});
	return result;
}
//#endregion
//#region node_modules/lodash-es/_setToArray.js
/**
* Converts `set` to an array of its values.
*
* @private
* @param {Object} set The set to convert.
* @returns {Array} Returns the values.
*/
function setToArray(set) {
	var index = -1, result = Array(set.size);
	set.forEach(function(value) {
		result[++index] = value;
	});
	return result;
}
//#endregion
//#region node_modules/lodash-es/_equalByTag.js
/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$4 = 1;
var COMPARE_UNORDERED_FLAG$2 = 2;
/** `Object#toString` result references. */
var boolTag = "[object Boolean]";
var dateTag = "[object Date]";
var errorTag = "[object Error]";
var mapTag = "[object Map]";
var numberTag = "[object Number]";
var regexpTag = "[object RegExp]";
var setTag = "[object Set]";
var stringTag = "[object String]";
var symbolTag = "[object Symbol]";
var arrayBufferTag = "[object ArrayBuffer]";
var dataViewTag = "[object DataView]";
/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0;
var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
/**
* A specialized version of `baseIsEqualDeep` for comparing objects of
* the same `toStringTag`.
*
* **Note:** This function only supports comparing values with tags of
* `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
*
* @private
* @param {Object} object The object to compare.
* @param {Object} other The other object to compare.
* @param {string} tag The `toStringTag` of the objects to compare.
* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
* @param {Function} customizer The function to customize comparisons.
* @param {Function} equalFunc The function to determine equivalents of values.
* @param {Object} stack Tracks traversed `object` and `other` objects.
* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
*/
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
	switch (tag) {
		case dataViewTag:
			if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) return false;
			object = object.buffer;
			other = other.buffer;
		case arrayBufferTag:
			if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array$1(object), new Uint8Array$1(other))) return false;
			return true;
		case boolTag:
		case dateTag:
		case numberTag: return eq(+object, +other);
		case errorTag: return object.name == other.name && object.message == other.message;
		case regexpTag:
		case stringTag: return object == other + "";
		case mapTag: var convert = mapToArray;
		case setTag:
			var isPartial = bitmask & COMPARE_PARTIAL_FLAG$4;
			convert || (convert = setToArray);
			if (object.size != other.size && !isPartial) return false;
			var stacked = stack.get(object);
			if (stacked) return stacked == other;
			bitmask |= COMPARE_UNORDERED_FLAG$2;
			stack.set(object, other);
			var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
			stack["delete"](object);
			return result;
		case symbolTag: if (symbolValueOf) return symbolValueOf.call(object) == symbolValueOf.call(other);
	}
	return false;
}
//#endregion
//#region node_modules/lodash-es/_equalObjects.js
/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$3 = 1;
/** Used to check objects for own properties. */
var hasOwnProperty$2 = Object.prototype.hasOwnProperty;
/**
* A specialized version of `baseIsEqualDeep` for objects with support for
* partial deep comparisons.
*
* @private
* @param {Object} object The object to compare.
* @param {Object} other The other object to compare.
* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
* @param {Function} customizer The function to customize comparisons.
* @param {Function} equalFunc The function to determine equivalents of values.
* @param {Object} stack Tracks traversed `object` and `other` objects.
* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
*/
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
	var isPartial = bitmask & COMPARE_PARTIAL_FLAG$3, objProps = getAllKeys(object), objLength = objProps.length;
	if (objLength != getAllKeys(other).length && !isPartial) return false;
	var index = objLength;
	while (index--) {
		var key = objProps[index];
		if (!(isPartial ? key in other : hasOwnProperty$2.call(other, key))) return false;
	}
	var objStacked = stack.get(object);
	var othStacked = stack.get(other);
	if (objStacked && othStacked) return objStacked == other && othStacked == object;
	var result = true;
	stack.set(object, other);
	stack.set(other, object);
	var skipCtor = isPartial;
	while (++index < objLength) {
		key = objProps[index];
		var objValue = object[key], othValue = other[key];
		if (customizer) var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
		if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
			result = false;
			break;
		}
		skipCtor || (skipCtor = key == "constructor");
	}
	if (result && !skipCtor) {
		var objCtor = object.constructor, othCtor = other.constructor;
		if (objCtor != othCtor && "constructor" in object && "constructor" in other && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) result = false;
	}
	stack["delete"](object);
	stack["delete"](other);
	return result;
}
//#endregion
//#region node_modules/lodash-es/_baseIsEqualDeep.js
/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$2 = 1;
/** `Object#toString` result references. */
var argsTag = "[object Arguments]";
var arrayTag = "[object Array]";
var objectTag = "[object Object]";
/** Used to check objects for own properties. */
var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
/**
* A specialized version of `baseIsEqual` for arrays and objects which performs
* deep comparisons and tracks traversed objects enabling objects with circular
* references to be compared.
*
* @private
* @param {Object} object The object to compare.
* @param {Object} other The other object to compare.
* @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
* @param {Function} customizer The function to customize comparisons.
* @param {Function} equalFunc The function to determine equivalents of values.
* @param {Object} [stack] Tracks traversed `object` and `other` objects.
* @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
*/
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
	var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : _getTag_default(object), othTag = othIsArr ? arrayTag : _getTag_default(other);
	objTag = objTag == argsTag ? objectTag : objTag;
	othTag = othTag == argsTag ? objectTag : othTag;
	var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
	if (isSameTag && isBuffer(object)) {
		if (!isBuffer(other)) return false;
		objIsArr = true;
		objIsObj = false;
	}
	if (isSameTag && !objIsObj) {
		stack || (stack = new Stack());
		return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
	}
	if (!(bitmask & COMPARE_PARTIAL_FLAG$2)) {
		var objIsWrapped = objIsObj && hasOwnProperty$1.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty$1.call(other, "__wrapped__");
		if (objIsWrapped || othIsWrapped) {
			var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
			stack || (stack = new Stack());
			return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
		}
	}
	if (!isSameTag) return false;
	stack || (stack = new Stack());
	return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
}
//#endregion
//#region node_modules/lodash-es/_baseIsEqual.js
/**
* The base implementation of `_.isEqual` which supports partial comparisons
* and tracks traversed objects.
*
* @private
* @param {*} value The value to compare.
* @param {*} other The other value to compare.
* @param {boolean} bitmask The bitmask flags.
*  1 - Unordered comparison
*  2 - Partial comparison
* @param {Function} [customizer] The function to customize comparisons.
* @param {Object} [stack] Tracks traversed `value` and `other` objects.
* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
*/
function baseIsEqual(value, other, bitmask, customizer, stack) {
	if (value === other) return true;
	if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) return value !== value && other !== other;
	return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
}
//#endregion
//#region node_modules/lodash-es/_baseIsMatch.js
/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG$1 = 1;
var COMPARE_UNORDERED_FLAG$1 = 2;
/**
* The base implementation of `_.isMatch` without support for iteratee shorthands.
*
* @private
* @param {Object} object The object to inspect.
* @param {Object} source The object of property values to match.
* @param {Array} matchData The property names, values, and compare flags to match.
* @param {Function} [customizer] The function to customize comparisons.
* @returns {boolean} Returns `true` if `object` is a match, else `false`.
*/
function baseIsMatch(object, source, matchData, customizer) {
	var index = matchData.length, length = index, noCustomizer = !customizer;
	if (object == null) return !length;
	object = Object(object);
	while (index--) {
		var data = matchData[index];
		if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) return false;
	}
	while (++index < length) {
		data = matchData[index];
		var key = data[0], objValue = object[key], srcValue = data[1];
		if (noCustomizer && data[2]) {
			if (objValue === void 0 && !(key in object)) return false;
		} else {
			var stack = new Stack();
			if (customizer) var result = customizer(objValue, srcValue, key, object, source, stack);
			if (!(result === void 0 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$1 | COMPARE_UNORDERED_FLAG$1, customizer, stack) : result)) return false;
		}
	}
	return true;
}
//#endregion
//#region node_modules/lodash-es/_isStrictComparable.js
/**
* Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
*
* @private
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` if suitable for strict
*  equality comparisons, else `false`.
*/
function isStrictComparable(value) {
	return value === value && !isObject$1(value);
}
//#endregion
//#region node_modules/lodash-es/_getMatchData.js
/**
* Gets the property names, values, and compare flags of `object`.
*
* @private
* @param {Object} object The object to query.
* @returns {Array} Returns the match data of `object`.
*/
function getMatchData(object) {
	var result = keys(object), length = result.length;
	while (length--) {
		var key = result[length], value = object[key];
		result[length] = [
			key,
			value,
			isStrictComparable(value)
		];
	}
	return result;
}
//#endregion
//#region node_modules/lodash-es/_matchesStrictComparable.js
/**
* A specialized version of `matchesProperty` for source values suitable
* for strict equality comparisons, i.e. `===`.
*
* @private
* @param {string} key The key of the property to get.
* @param {*} srcValue The value to match.
* @returns {Function} Returns the new spec function.
*/
function matchesStrictComparable(key, srcValue) {
	return function(object) {
		if (object == null) return false;
		return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
	};
}
//#endregion
//#region node_modules/lodash-es/_baseMatches.js
/**
* The base implementation of `_.matches` which doesn't clone `source`.
*
* @private
* @param {Object} source The object of property values to match.
* @returns {Function} Returns the new spec function.
*/
function baseMatches(source) {
	var matchData = getMatchData(source);
	if (matchData.length == 1 && matchData[0][2]) return matchesStrictComparable(matchData[0][0], matchData[0][1]);
	return function(object) {
		return object === source || baseIsMatch(object, source, matchData);
	};
}
//#endregion
//#region node_modules/lodash-es/_baseHasIn.js
/**
* The base implementation of `_.hasIn` without support for deep paths.
*
* @private
* @param {Object} [object] The object to query.
* @param {Array|string} key The key to check.
* @returns {boolean} Returns `true` if `key` exists, else `false`.
*/
function baseHasIn(object, key) {
	return object != null && key in Object(object);
}
//#endregion
//#region node_modules/lodash-es/_hasPath.js
/**
* Checks if `path` exists on `object`.
*
* @private
* @param {Object} object The object to query.
* @param {Array|string} path The path to check.
* @param {Function} hasFunc The function to check properties.
* @returns {boolean} Returns `true` if `path` exists, else `false`.
*/
function hasPath(object, path, hasFunc) {
	path = castPath(path, object);
	var index = -1, length = path.length, result = false;
	while (++index < length) {
		var key = toKey(path[index]);
		if (!(result = object != null && hasFunc(object, key))) break;
		object = object[key];
	}
	if (result || ++index != length) return result;
	length = object == null ? 0 : object.length;
	return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
}
//#endregion
//#region node_modules/lodash-es/hasIn.js
/**
* Checks if `path` is a direct or inherited property of `object`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Object
* @param {Object} object The object to query.
* @param {Array|string} path The path to check.
* @returns {boolean} Returns `true` if `path` exists, else `false`.
* @example
*
* var object = _.create({ 'a': _.create({ 'b': 2 }) });
*
* _.hasIn(object, 'a');
* // => true
*
* _.hasIn(object, 'a.b');
* // => true
*
* _.hasIn(object, ['a', 'b']);
* // => true
*
* _.hasIn(object, 'b');
* // => false
*/
function hasIn(object, path) {
	return object != null && hasPath(object, path, baseHasIn);
}
//#endregion
//#region node_modules/lodash-es/_baseMatchesProperty.js
/** Used to compose bitmasks for value comparisons. */
var COMPARE_PARTIAL_FLAG = 1;
var COMPARE_UNORDERED_FLAG = 2;
/**
* The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
*
* @private
* @param {string} path The path of the property to get.
* @param {*} srcValue The value to match.
* @returns {Function} Returns the new spec function.
*/
function baseMatchesProperty(path, srcValue) {
	if (isKey(path) && isStrictComparable(srcValue)) return matchesStrictComparable(toKey(path), srcValue);
	return function(object) {
		var objValue = get(object, path);
		return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
	};
}
//#endregion
//#region node_modules/lodash-es/_baseProperty.js
/**
* The base implementation of `_.property` without support for deep paths.
*
* @private
* @param {string} key The key of the property to get.
* @returns {Function} Returns the new accessor function.
*/
function baseProperty(key) {
	return function(object) {
		return object == null ? void 0 : object[key];
	};
}
//#endregion
//#region node_modules/lodash-es/_basePropertyDeep.js
/**
* A specialized version of `baseProperty` which supports deep paths.
*
* @private
* @param {Array|string} path The path of the property to get.
* @returns {Function} Returns the new accessor function.
*/
function basePropertyDeep(path) {
	return function(object) {
		return baseGet(object, path);
	};
}
//#endregion
//#region node_modules/lodash-es/property.js
/**
* Creates a function that returns the value at `path` of a given object.
*
* @static
* @memberOf _
* @since 2.4.0
* @category Util
* @param {Array|string} path The path of the property to get.
* @returns {Function} Returns the new accessor function.
* @example
*
* var objects = [
*   { 'a': { 'b': 2 } },
*   { 'a': { 'b': 1 } }
* ];
*
* _.map(objects, _.property('a.b'));
* // => [2, 1]
*
* _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
* // => [1, 2]
*/
function property(path) {
	return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}
//#endregion
//#region node_modules/lodash-es/_baseIteratee.js
/**
* The base implementation of `_.iteratee`.
*
* @private
* @param {*} [value=_.identity] The value to convert to an iteratee.
* @returns {Function} Returns the iteratee.
*/
function baseIteratee(value) {
	if (typeof value == "function") return value;
	if (value == null) return identity;
	if (typeof value == "object") return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
	return property(value);
}
//#endregion
//#region node_modules/lodash-es/_createBaseFor.js
/**
* Creates a base function for methods like `_.forIn` and `_.forOwn`.
*
* @private
* @param {boolean} [fromRight] Specify iterating from right to left.
* @returns {Function} Returns the new base function.
*/
function createBaseFor(fromRight) {
	return function(object, iteratee, keysFunc) {
		var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
		while (length--) {
			var key = props[fromRight ? length : ++index];
			if (iteratee(iterable[key], key, iterable) === false) break;
		}
		return object;
	};
}
//#endregion
//#region node_modules/lodash-es/_baseFor.js
/**
* The base implementation of `baseForOwn` which iterates over `object`
* properties returned by `keysFunc` and invokes `iteratee` for each property.
* Iteratee functions may exit iteration early by explicitly returning `false`.
*
* @private
* @param {Object} object The object to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @param {Function} keysFunc The function to get the keys of `object`.
* @returns {Object} Returns `object`.
*/
var baseFor = createBaseFor();
//#endregion
//#region node_modules/lodash-es/_baseForOwn.js
/**
* The base implementation of `_.forOwn` without support for iteratee shorthands.
*
* @private
* @param {Object} object The object to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Object} Returns `object`.
*/
function baseForOwn(object, iteratee) {
	return object && baseFor(object, iteratee, keys);
}
//#endregion
//#region node_modules/lodash-es/_createBaseEach.js
/**
* Creates a `baseEach` or `baseEachRight` function.
*
* @private
* @param {Function} eachFunc The function to iterate over a collection.
* @param {boolean} [fromRight] Specify iterating from right to left.
* @returns {Function} Returns the new base function.
*/
function createBaseEach(eachFunc, fromRight) {
	return function(collection, iteratee) {
		if (collection == null) return collection;
		if (!isArrayLike(collection)) return eachFunc(collection, iteratee);
		var length = collection.length, index = fromRight ? length : -1, iterable = Object(collection);
		while (fromRight ? index-- : ++index < length) if (iteratee(iterable[index], index, iterable) === false) break;
		return collection;
	};
}
//#endregion
//#region node_modules/lodash-es/_baseEach.js
/**
* The base implementation of `_.forEach` without support for iteratee shorthands.
*
* @private
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Array|Object} Returns `collection`.
*/
var baseEach = createBaseEach(baseForOwn);
//#endregion
//#region node_modules/lodash-es/now.js
/**
* Gets the timestamp of the number of milliseconds that have elapsed since
* the Unix epoch (1 January 1970 00:00:00 UTC).
*
* @static
* @memberOf _
* @since 2.4.0
* @category Date
* @returns {number} Returns the timestamp.
* @example
*
* _.defer(function(stamp) {
*   console.log(_.now() - stamp);
* }, _.now());
* // => Logs the number of milliseconds it took for the deferred invocation.
*/
var now = function() {
	return root.Date.now();
};
//#endregion
//#region node_modules/lodash-es/debounce.js
/** Error message constants. */
var FUNC_ERROR_TEXT = "Expected a function";
var nativeMax$1 = Math.max;
var nativeMin$1 = Math.min;
/**
* Creates a debounced function that delays invoking `func` until after `wait`
* milliseconds have elapsed since the last time the debounced function was
* invoked. The debounced function comes with a `cancel` method to cancel
* delayed `func` invocations and a `flush` method to immediately invoke them.
* Provide `options` to indicate whether `func` should be invoked on the
* leading and/or trailing edge of the `wait` timeout. The `func` is invoked
* with the last arguments provided to the debounced function. Subsequent
* calls to the debounced function return the result of the last `func`
* invocation.
*
* **Note:** If `leading` and `trailing` options are `true`, `func` is
* invoked on the trailing edge of the timeout only if the debounced function
* is invoked more than once during the `wait` timeout.
*
* If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
* until to the next tick, similar to `setTimeout` with a timeout of `0`.
*
* See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
* for details over the differences between `_.debounce` and `_.throttle`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Function
* @param {Function} func The function to debounce.
* @param {number} [wait=0] The number of milliseconds to delay.
* @param {Object} [options={}] The options object.
* @param {boolean} [options.leading=false]
*  Specify invoking on the leading edge of the timeout.
* @param {number} [options.maxWait]
*  The maximum time `func` is allowed to be delayed before it's invoked.
* @param {boolean} [options.trailing=true]
*  Specify invoking on the trailing edge of the timeout.
* @returns {Function} Returns the new debounced function.
* @example
*
* // Avoid costly calculations while the window size is in flux.
* jQuery(window).on('resize', _.debounce(calculateLayout, 150));
*
* // Invoke `sendMail` when clicked, debouncing subsequent calls.
* jQuery(element).on('click', _.debounce(sendMail, 300, {
*   'leading': true,
*   'trailing': false
* }));
*
* // Ensure `batchLog` is invoked once after 1 second of debounced calls.
* var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
* var source = new EventSource('/stream');
* jQuery(source).on('message', debounced);
*
* // Cancel the trailing debounced invocation.
* jQuery(window).on('popstate', debounced.cancel);
*/
function debounce(func, wait, options) {
	var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
	if (typeof func != "function") throw new TypeError(FUNC_ERROR_TEXT);
	wait = toNumber(wait) || 0;
	if (isObject$1(options)) {
		leading = !!options.leading;
		maxing = "maxWait" in options;
		maxWait = maxing ? nativeMax$1(toNumber(options.maxWait) || 0, wait) : maxWait;
		trailing = "trailing" in options ? !!options.trailing : trailing;
	}
	function invokeFunc(time) {
		var args = lastArgs, thisArg = lastThis;
		lastArgs = lastThis = void 0;
		lastInvokeTime = time;
		result = func.apply(thisArg, args);
		return result;
	}
	function leadingEdge(time) {
		lastInvokeTime = time;
		timerId = setTimeout(timerExpired, wait);
		return leading ? invokeFunc(time) : result;
	}
	function remainingWait(time) {
		var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
		return maxing ? nativeMin$1(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
	}
	function shouldInvoke(time) {
		var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
		return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
	}
	function timerExpired() {
		var time = now();
		if (shouldInvoke(time)) return trailingEdge(time);
		timerId = setTimeout(timerExpired, remainingWait(time));
	}
	function trailingEdge(time) {
		timerId = void 0;
		if (trailing && lastArgs) return invokeFunc(time);
		lastArgs = lastThis = void 0;
		return result;
	}
	function cancel() {
		if (timerId !== void 0) clearTimeout(timerId);
		lastInvokeTime = 0;
		lastArgs = lastCallTime = lastThis = timerId = void 0;
	}
	function flush() {
		return timerId === void 0 ? result : trailingEdge(now());
	}
	function debounced() {
		var time = now(), isInvoking = shouldInvoke(time);
		lastArgs = arguments;
		lastThis = this;
		lastCallTime = time;
		if (isInvoking) {
			if (timerId === void 0) return leadingEdge(lastCallTime);
			if (maxing) {
				clearTimeout(timerId);
				timerId = setTimeout(timerExpired, wait);
				return invokeFunc(lastCallTime);
			}
		}
		if (timerId === void 0) timerId = setTimeout(timerExpired, wait);
		return result;
	}
	debounced.cancel = cancel;
	debounced.flush = flush;
	return debounced;
}
//#endregion
//#region node_modules/lodash-es/_assignMergeValue.js
/**
* This function is like `assignValue` except that it doesn't assign
* `undefined` values.
*
* @private
* @param {Object} object The object to modify.
* @param {string} key The key of the property to assign.
* @param {*} value The value to assign.
*/
function assignMergeValue(object, key, value) {
	if (value !== void 0 && !eq(object[key], value) || value === void 0 && !(key in object)) baseAssignValue(object, key, value);
}
//#endregion
//#region node_modules/lodash-es/isArrayLikeObject.js
/**
* This method is like `_.isArrayLike` except that it also checks if `value`
* is an object.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is an array-like object,
*  else `false`.
* @example
*
* _.isArrayLikeObject([1, 2, 3]);
* // => true
*
* _.isArrayLikeObject(document.body.children);
* // => true
*
* _.isArrayLikeObject('abc');
* // => false
*
* _.isArrayLikeObject(_.noop);
* // => false
*/
function isArrayLikeObject(value) {
	return isObjectLike(value) && isArrayLike(value);
}
//#endregion
//#region node_modules/lodash-es/_safeGet.js
/**
* Gets the value at `key`, unless `key` is "__proto__" or "constructor".
*
* @private
* @param {Object} object The object to query.
* @param {string} key The key of the property to get.
* @returns {*} Returns the property value.
*/
function safeGet(object, key) {
	if (key === "constructor" && typeof object[key] === "function") return;
	if (key == "__proto__") return;
	return object[key];
}
//#endregion
//#region node_modules/lodash-es/toPlainObject.js
/**
* Converts `value` to a plain object flattening inherited enumerable string
* keyed properties of `value` to own properties of the plain object.
*
* @static
* @memberOf _
* @since 3.0.0
* @category Lang
* @param {*} value The value to convert.
* @returns {Object} Returns the converted plain object.
* @example
*
* function Foo() {
*   this.b = 2;
* }
*
* Foo.prototype.c = 3;
*
* _.assign({ 'a': 1 }, new Foo);
* // => { 'a': 1, 'b': 2 }
*
* _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
* // => { 'a': 1, 'b': 2, 'c': 3 }
*/
function toPlainObject(value) {
	return copyObject(value, keysIn(value));
}
//#endregion
//#region node_modules/lodash-es/_baseMergeDeep.js
/**
* A specialized version of `baseMerge` for arrays and objects which performs
* deep merges and tracks traversed objects enabling objects with circular
* references to be merged.
*
* @private
* @param {Object} object The destination object.
* @param {Object} source The source object.
* @param {string} key The key of the value to merge.
* @param {number} srcIndex The index of `source`.
* @param {Function} mergeFunc The function to merge values.
* @param {Function} [customizer] The function to customize assigned values.
* @param {Object} [stack] Tracks traversed source values and their merged
*  counterparts.
*/
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
	var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
	if (stacked) {
		assignMergeValue(object, key, stacked);
		return;
	}
	var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
	var isCommon = newValue === void 0;
	if (isCommon) {
		var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
		newValue = srcValue;
		if (isArr || isBuff || isTyped) if (isArray(objValue)) newValue = objValue;
		else if (isArrayLikeObject(objValue)) newValue = copyArray(objValue);
		else if (isBuff) {
			isCommon = false;
			newValue = cloneBuffer(srcValue, true);
		} else if (isTyped) {
			isCommon = false;
			newValue = cloneTypedArray(srcValue, true);
		} else newValue = [];
		else if (isPlainObject(srcValue) || isArguments(srcValue)) {
			newValue = objValue;
			if (isArguments(objValue)) newValue = toPlainObject(objValue);
			else if (!isObject$1(objValue) || isFunction(objValue)) newValue = initCloneObject(srcValue);
		} else isCommon = false;
	}
	if (isCommon) {
		stack.set(srcValue, newValue);
		mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
		stack["delete"](srcValue);
	}
	assignMergeValue(object, key, newValue);
}
//#endregion
//#region node_modules/lodash-es/_baseMerge.js
/**
* The base implementation of `_.merge` without support for multiple sources.
*
* @private
* @param {Object} object The destination object.
* @param {Object} source The source object.
* @param {number} srcIndex The index of `source`.
* @param {Function} [customizer] The function to customize merged values.
* @param {Object} [stack] Tracks traversed source values and their merged
*  counterparts.
*/
function baseMerge(object, source, srcIndex, customizer, stack) {
	if (object === source) return;
	baseFor(source, function(srcValue, key) {
		stack || (stack = new Stack());
		if (isObject$1(srcValue)) baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
		else {
			var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : void 0;
			if (newValue === void 0) newValue = srcValue;
			assignMergeValue(object, key, newValue);
		}
	}, keysIn);
}
//#endregion
//#region node_modules/lodash-es/last.js
/**
* Gets the last element of `array`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Array
* @param {Array} array The array to query.
* @returns {*} Returns the last element of `array`.
* @example
*
* _.last([1, 2, 3]);
* // => 3
*/
function last(array) {
	var length = array == null ? 0 : array.length;
	return length ? array[length - 1] : void 0;
}
//#endregion
//#region node_modules/lodash-es/findLastIndex.js
var nativeMax = Math.max;
var nativeMin = Math.min;
/**
* This method is like `_.findIndex` except that it iterates over elements
* of `collection` from right to left.
*
* @static
* @memberOf _
* @since 2.0.0
* @category Array
* @param {Array} array The array to inspect.
* @param {Function} [predicate=_.identity] The function invoked per iteration.
* @param {number} [fromIndex=array.length-1] The index to search from.
* @returns {number} Returns the index of the found element, else `-1`.
* @example
*
* var users = [
*   { 'user': 'barney',  'active': true },
*   { 'user': 'fred',    'active': false },
*   { 'user': 'pebbles', 'active': false }
* ];
*
* _.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
* // => 2
*
* // The `_.matches` iteratee shorthand.
* _.findLastIndex(users, { 'user': 'barney', 'active': true });
* // => 0
*
* // The `_.matchesProperty` iteratee shorthand.
* _.findLastIndex(users, ['active', false]);
* // => 2
*
* // The `_.property` iteratee shorthand.
* _.findLastIndex(users, 'active');
* // => 0
*/
function findLastIndex(array, predicate, fromIndex) {
	var length = array == null ? 0 : array.length;
	if (!length) return -1;
	var index = length - 1;
	if (fromIndex !== void 0) {
		index = toInteger(fromIndex);
		index = fromIndex < 0 ? nativeMax(length + index, 0) : nativeMin(index, length - 1);
	}
	return baseFindIndex(array, baseIteratee(predicate, 3), index, true);
}
//#endregion
//#region node_modules/lodash-es/_baseMap.js
/**
* The base implementation of `_.map` without support for iteratee shorthands.
*
* @private
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} iteratee The function invoked per iteration.
* @returns {Array} Returns the new mapped array.
*/
function baseMap(collection, iteratee) {
	var index = -1, result = isArrayLike(collection) ? Array(collection.length) : [];
	baseEach(collection, function(value, key, collection) {
		result[++index] = iteratee(value, key, collection);
	});
	return result;
}
//#endregion
//#region node_modules/lodash-es/map.js
/**
* Creates an array of values by running each element in `collection` thru
* `iteratee`. The iteratee is invoked with three arguments:
* (value, index|key, collection).
*
* Many lodash methods are guarded to work as iteratees for methods like
* `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
*
* The guarded methods are:
* `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
* `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
* `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
* `template`, `trim`, `trimEnd`, `trimStart`, and `words`
*
* @static
* @memberOf _
* @since 0.1.0
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @returns {Array} Returns the new mapped array.
* @example
*
* function square(n) {
*   return n * n;
* }
*
* _.map([4, 8], square);
* // => [16, 64]
*
* _.map({ 'a': 4, 'b': 8 }, square);
* // => [16, 64] (iteration order is not guaranteed)
*
* var users = [
*   { 'user': 'barney' },
*   { 'user': 'fred' }
* ];
*
* // The `_.property` iteratee shorthand.
* _.map(users, 'user');
* // => ['barney', 'fred']
*/
function map(collection, iteratee) {
	return (isArray(collection) ? arrayMap : baseMap)(collection, baseIteratee(iteratee, 3));
}
//#endregion
//#region node_modules/lodash-es/flatMap.js
/**
* Creates a flattened array of values by running each element in `collection`
* thru `iteratee` and flattening the mapped results. The iteratee is invoked
* with three arguments: (value, index|key, collection).
*
* @static
* @memberOf _
* @since 4.0.0
* @category Collection
* @param {Array|Object} collection The collection to iterate over.
* @param {Function} [iteratee=_.identity] The function invoked per iteration.
* @returns {Array} Returns the new flattened array.
* @example
*
* function duplicate(n) {
*   return [n, n];
* }
*
* _.flatMap([1, 2], duplicate);
* // => [1, 1, 2, 2]
*/
function flatMap(collection, iteratee) {
	return baseFlatten(map(collection, iteratee), 1);
}
//#endregion
//#region node_modules/lodash-es/fromPairs.js
/**
* The inverse of `_.toPairs`; this method returns an object composed
* from key-value `pairs`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Array
* @param {Array} pairs The key-value pairs.
* @returns {Object} Returns the new object.
* @example
*
* _.fromPairs([['a', 1], ['b', 2]]);
* // => { 'a': 1, 'b': 2 }
*/
function fromPairs(pairs) {
	var index = -1, length = pairs == null ? 0 : pairs.length, result = {};
	while (++index < length) {
		var pair = pairs[index];
		baseAssignValue(result, pair[0], pair[1]);
	}
	return result;
}
//#endregion
//#region node_modules/lodash-es/_parent.js
/**
* Gets the parent value at `path` of `object`.
*
* @private
* @param {Object} object The object to query.
* @param {Array} path The path to get the parent value of.
* @returns {*} Returns the parent value.
*/
function parent(object, path) {
	return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
}
//#endregion
//#region node_modules/lodash-es/isEqual.js
/**
* Performs a deep comparison between two values to determine if they are
* equivalent.
*
* **Note:** This method supports comparing arrays, array buffers, booleans,
* date objects, error objects, maps, numbers, `Object` objects, regexes,
* sets, strings, symbols, and typed arrays. `Object` objects are compared
* by their own, not inherited, enumerable properties. Functions and DOM
* nodes are compared by strict equality, i.e. `===`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to compare.
* @param {*} other The other value to compare.
* @returns {boolean} Returns `true` if the values are equivalent, else `false`.
* @example
*
* var object = { 'a': 1 };
* var other = { 'a': 1 };
*
* _.isEqual(object, other);
* // => true
*
* object === other;
* // => false
*/
function isEqual(value, other) {
	return baseIsEqual(value, other);
}
//#endregion
//#region node_modules/lodash-es/isNil.js
/**
* Checks if `value` is `null` or `undefined`.
*
* @static
* @memberOf _
* @since 4.0.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is nullish, else `false`.
* @example
*
* _.isNil(null);
* // => true
*
* _.isNil(void 0);
* // => true
*
* _.isNil(NaN);
* // => false
*/
function isNil(value) {
	return value == null;
}
//#endregion
//#region node_modules/lodash-es/isNull.js
/**
* Checks if `value` is `null`.
*
* @static
* @memberOf _
* @since 0.1.0
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is `null`, else `false`.
* @example
*
* _.isNull(null);
* // => true
*
* _.isNull(void 0);
* // => false
*/
function isNull(value) {
	return value === null;
}
//#endregion
//#region node_modules/lodash-es/isUndefined.js
/**
* Checks if `value` is `undefined`.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Lang
* @param {*} value The value to check.
* @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
* @example
*
* _.isUndefined(void 0);
* // => true
*
* _.isUndefined(null);
* // => false
*/
function isUndefined$1(value) {
	return value === void 0;
}
//#endregion
//#region node_modules/lodash-es/merge.js
/**
* This method is like `_.assign` except that it recursively merges own and
* inherited enumerable string keyed properties of source objects into the
* destination object. Source properties that resolve to `undefined` are
* skipped if a destination value exists. Array and plain object properties
* are merged recursively. Other objects and value types are overridden by
* assignment. Source objects are applied from left to right. Subsequent
* sources overwrite property assignments of previous sources.
*
* **Note:** This method mutates `object`.
*
* @static
* @memberOf _
* @since 0.5.0
* @category Object
* @param {Object} object The destination object.
* @param {...Object} [sources] The source objects.
* @returns {Object} Returns `object`.
* @example
*
* var object = {
*   'a': [{ 'b': 2 }, { 'd': 4 }]
* };
*
* var other = {
*   'a': [{ 'c': 3 }, { 'e': 5 }]
* };
*
* _.merge(object, other);
* // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
*/
var merge = createAssigner(function(object, source, srcIndex) {
	baseMerge(object, source, srcIndex);
});
//#endregion
//#region node_modules/lodash-es/_baseUnset.js
/** Used to check objects for own properties. */
var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
* The base implementation of `_.unset`.
*
* @private
* @param {Object} object The object to modify.
* @param {Array|string} path The property path to unset.
* @returns {boolean} Returns `true` if the property is deleted, else `false`.
*/
function baseUnset(object, path) {
	path = castPath(path, object);
	var index = -1, length = path.length;
	if (!length) return true;
	while (++index < length) {
		var key = toKey(path[index]);
		if (key === "__proto__" && !hasOwnProperty.call(object, "__proto__")) return false;
		if ((key === "constructor" || key === "prototype") && index < length - 1) return false;
	}
	var obj = parent(object, path);
	return obj == null || delete obj[toKey(last(path))];
}
//#endregion
//#region node_modules/lodash-es/_customOmitClone.js
/**
* Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
* objects.
*
* @private
* @param {*} value The value to inspect.
* @param {string} key The key of the property to inspect.
* @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
*/
function customOmitClone(value) {
	return isPlainObject(value) ? void 0 : value;
}
//#endregion
//#region node_modules/lodash-es/omit.js
/** Used to compose bitmasks for cloning. */
var CLONE_DEEP_FLAG = 1;
var CLONE_FLAT_FLAG = 2;
var CLONE_SYMBOLS_FLAG = 4;
/**
* The opposite of `_.pick`; this method creates an object composed of the
* own and inherited enumerable property paths of `object` that are not omitted.
*
* **Note:** This method is considerably slower than `_.pick`.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Object
* @param {Object} object The source object.
* @param {...(string|string[])} [paths] The property paths to omit.
* @returns {Object} Returns the new object.
* @example
*
* var object = { 'a': 1, 'b': '2', 'c': 3 };
*
* _.omit(object, ['a', 'c']);
* // => { 'b': '2' }
*/
var omit = flatRest(function(object, paths) {
	var result = {};
	if (object == null) return result;
	var isDeep = false;
	paths = arrayMap(paths, function(path) {
		path = castPath(path, object);
		isDeep || (isDeep = path.length > 1);
		return path;
	});
	copyObject(object, getAllKeysIn(object), result);
	if (isDeep) result = baseClone(result, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
	var length = paths.length;
	while (length--) baseUnset(result, paths[length]);
	return result;
});
//#endregion
//#region node_modules/lodash-es/_baseSet.js
/**
* The base implementation of `_.set`.
*
* @private
* @param {Object} object The object to modify.
* @param {Array|string} path The path of the property to set.
* @param {*} value The value to set.
* @param {Function} [customizer] The function to customize path creation.
* @returns {Object} Returns `object`.
*/
function baseSet(object, path, value, customizer) {
	if (!isObject$1(object)) return object;
	path = castPath(path, object);
	var index = -1, length = path.length, lastIndex = length - 1, nested = object;
	while (nested != null && ++index < length) {
		var key = toKey(path[index]), newValue = value;
		if (key === "__proto__" || key === "constructor" || key === "prototype") return object;
		if (index != lastIndex) {
			var objValue = nested[key];
			newValue = customizer ? customizer(objValue, key, nested) : void 0;
			if (newValue === void 0) newValue = isObject$1(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
		}
		assignValue(nested, key, newValue);
		nested = nested[key];
	}
	return object;
}
//#endregion
//#region node_modules/lodash-es/_basePickBy.js
/**
* The base implementation of  `_.pickBy` without support for iteratee shorthands.
*
* @private
* @param {Object} object The source object.
* @param {string[]} paths The property paths to pick.
* @param {Function} predicate The function invoked per property.
* @returns {Object} Returns the new object.
*/
function basePickBy(object, paths, predicate) {
	var index = -1, length = paths.length, result = {};
	while (++index < length) {
		var path = paths[index], value = baseGet(object, path);
		if (predicate(value, path)) baseSet(result, castPath(path, object), value);
	}
	return result;
}
//#endregion
//#region node_modules/lodash-es/_basePick.js
/**
* The base implementation of `_.pick` without support for individual
* property identifiers.
*
* @private
* @param {Object} object The source object.
* @param {string[]} paths The property paths to pick.
* @returns {Object} Returns the new object.
*/
function basePick(object, paths) {
	return basePickBy(object, paths, function(value, path) {
		return hasIn(object, path);
	});
}
//#endregion
//#region node_modules/lodash-es/pick.js
/**
* Creates an object composed of the picked `object` properties.
*
* @static
* @since 0.1.0
* @memberOf _
* @category Object
* @param {Object} object The source object.
* @param {...(string|string[])} [paths] The property paths to pick.
* @returns {Object} Returns the new object.
* @example
*
* var object = { 'a': 1, 'b': '2', 'c': 3 };
*
* _.pick(object, ['a', 'c']);
* // => { 'a': 1, 'c': 3 }
*/
var pick = flatRest(function(object, paths) {
	return object == null ? {} : basePick(object, paths);
});
//#endregion
//#region node_modules/lodash-es/set.js
/**
* Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
* it's created. Arrays are created for missing index properties while objects
* are created for all other missing properties. Use `_.setWith` to customize
* `path` creation.
*
* **Note:** This method mutates `object`.
*
* @static
* @memberOf _
* @since 3.7.0
* @category Object
* @param {Object} object The object to modify.
* @param {Array|string} path The path of the property to set.
* @param {*} value The value to set.
* @returns {Object} Returns `object`.
* @example
*
* var object = { 'a': [{ 'b': { 'c': 3 } }] };
*
* _.set(object, 'a[0].b.c', 4);
* console.log(object.a[0].b.c);
* // => 4
*
* _.set(object, ['x', '0', 'y', 'z'], 5);
* console.log(object.x[0].y.z);
* // => 5
*/
function set(object, path, value) {
	return object == null ? object : baseSet(object, path, value);
}
//#endregion
//#region node_modules/element-plus/es/utils/types.mjs
var isUndefined = (val) => val === void 0;
var isBoolean = (val) => typeof val === "boolean";
var isNumber = (val) => typeof val === "number";
var isEmpty = (val) => !val && val !== 0 || isArray$1(val) && val.length === 0 || isObject$2(val) && !Object.keys(val).length;
var isElement = (e) => {
	if (typeof Element === "undefined") return false;
	return e instanceof Element;
};
var isPropAbsent = (prop) => isNil(prop);
var isStringNumber = (val) => {
	if (!isString(val)) return false;
	return !Number.isNaN(Number(val));
};
var isWindow = (val) => val === window;
//#endregion
//#region node_modules/element-plus/es/utils/objects.mjs
var keysOf = (arr) => Object.keys(arr);
var entriesOf = (arr) => Object.entries(arr);
var getProp = (obj, path, defaultValue) => {
	return {
		get value() {
			return get(obj, path, defaultValue);
		},
		set value(val) {
			set(obj, path, val);
		}
	};
};
//#endregion
//#region node_modules/element-plus/es/utils/vue/props/runtime.mjs
var epPropKey = "__epPropKey";
var definePropType = (val) => val;
var isEpProp = (val) => isObject$2(val) && !!val["__epPropKey"];
/**
* @description Build prop. It can better optimize prop types
* @description 生成 prop，能更好地优化类型
* @example
// limited options
// the type will be PropType<'light' | 'dark'>
buildProp({
type: String,
values: ['light', 'dark'],
} as const)
* @example
// limited options and other types
// the type will be PropType<'small' | 'large' | number>
buildProp({
type: [String, Number],
values: ['small', 'large'],
validator: (val: unknown): val is number => typeof val === 'number',
} as const)
@link see more: https://github.com/element-plus/element-plus/pull/3341
*/
var buildProp = (prop, key) => {
	if (!isObject$2(prop) || isEpProp(prop)) return prop;
	const { values, required, default: defaultValue, type, validator } = prop;
	const epProp = {
		type,
		required: !!required,
		validator: values || validator ? (val) => {
			let valid = false;
			let allowedValues = [];
			if (values) {
				allowedValues = Array.from(values);
				if (hasOwn(prop, "default")) allowedValues.push(defaultValue);
				valid ||= allowedValues.includes(val);
			}
			if (validator) valid ||= validator(val);
			if (!valid && allowedValues.length > 0) {
				const allowValuesText = [...new Set(allowedValues)].map((value) => JSON.stringify(value)).join(", ");
				warn(`Invalid prop: validation failed${key ? ` for prop "${key}"` : ""}. Expected one of [${allowValuesText}], got value ${JSON.stringify(val)}.`);
			}
			return valid;
		} : void 0,
		[epPropKey]: true
	};
	if (hasOwn(prop, "default")) epProp.default = defaultValue;
	return epProp;
};
var buildProps = (props) => fromPairs(Object.entries(props).map(([key, option]) => [key, buildProp(option, key)]));
//#endregion
//#region node_modules/element-plus/es/utils/error.mjs
var ElementPlusError = class extends Error {
	constructor(m) {
		super(m);
		this.name = "ElementPlusError";
	}
};
function throwError(scope, m) {
	throw new ElementPlusError(`[${scope}] ${m}`);
}
function debugWarn(scope, message) {
	{
		const error = isString(scope) ? new ElementPlusError(`[${scope}] ${message}`) : scope;
		console.warn(error);
	}
}
//#endregion
//#region node_modules/element-plus/es/hooks/use-attrs/index.mjs
var DEFAULT_EXCLUDE_KEYS = ["class", "style"];
var LISTENER_PREFIX = /^on[A-Z]/;
var useAttrs = (params = {}) => {
	const { excludeListeners = false, excludeKeys } = params;
	const allExcludeKeys = computed(() => {
		return (excludeKeys?.value || []).concat(DEFAULT_EXCLUDE_KEYS);
	});
	const instance = getCurrentInstance();
	if (!instance) {
		debugWarn("use-attrs", "getCurrentInstance() returned null. useAttrs() must be called at the top of a setup function");
		return computed(() => ({}));
	}
	return computed(() => fromPairs(Object.entries(instance.proxy?.$attrs).filter(([key]) => !allExcludeKeys.value.includes(key) && !(excludeListeners && LISTENER_PREFIX.test(key)))));
};
//#endregion
//#region node_modules/@vueuse/shared/dist/index.js
/**
*
* @deprecated This function will be removed in future version.
*
* Note: If you are using Vue 3.4+, you can straight use computed instead.
* Because in Vue 3.4+, if computed new value does not change,
* computed, effect, watch, watchEffect, render dependencies will not be triggered.
* refer: https://github.com/vuejs/core/pull/5912
*
* @param fn effect function
* @param options WatchOptionsBase
* @returns readonly shallowRef
*/
function computedEager(fn, options) {
	var _options$flush;
	const result = /* @__PURE__ */ shallowRef();
	watchEffect(() => {
		result.value = fn();
	}, {
		...options,
		flush: (_options$flush = options === null || options === void 0 ? void 0 : options.flush) !== null && _options$flush !== void 0 ? _options$flush : "sync"
	});
	return /* @__PURE__ */ readonly(result);
}
/**
* Call onScopeDispose() if it's inside an effect scope lifecycle, if not, do nothing
*
* @param fn
*/
function tryOnScopeDispose(fn, failSilently) {
	if (getCurrentScope()) {
		onScopeDispose(fn, failSilently);
		return true;
	}
	return false;
}
var localProvidedStateMap = /* @__PURE__ */ new WeakMap();
/**
* On the basis of `inject`, it is allowed to directly call inject to obtain the value after call provide in the same component.
*
* @example
* ```ts
* injectLocal('MyInjectionKey', 1)
* const injectedValue = injectLocal('MyInjectionKey') // injectedValue === 1
* ```
*
* @__NO_SIDE_EFFECTS__
*/
var injectLocal = (...args) => {
	var _getCurrentInstance;
	const key = args[0];
	const instance = (_getCurrentInstance = getCurrentInstance()) === null || _getCurrentInstance === void 0 ? void 0 : _getCurrentInstance.proxy;
	const owner = instance !== null && instance !== void 0 ? instance : getCurrentScope();
	if (owner == null && !hasInjectionContext()) throw new Error("injectLocal must be called in setup");
	if (owner && localProvidedStateMap.has(owner) && key in localProvidedStateMap.get(owner)) return localProvidedStateMap.get(owner)[key];
	return inject(...args);
};
var isClient = typeof window !== "undefined" && typeof document !== "undefined";
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
var isDef = (val) => typeof val !== "undefined";
var notNullish = (val) => val != null;
var toString = Object.prototype.toString;
var isObject = (val) => toString.call(val) === "[object Object]";
var clamp = (n, min, max) => Math.min(max, Math.max(min, n));
var noop = () => {};
var isIOS = /* @__PURE__ */ getIsIOS();
function getIsIOS() {
	var _window, _window2, _window3;
	return isClient && !!((_window = window) === null || _window === void 0 || (_window = _window.navigator) === null || _window === void 0 ? void 0 : _window.userAgent) && (/iP(?:ad|hone|od)/.test(window.navigator.userAgent) || ((_window2 = window) === null || _window2 === void 0 || (_window2 = _window2.navigator) === null || _window2 === void 0 ? void 0 : _window2.maxTouchPoints) > 2 && /iPad|Macintosh/.test((_window3 = window) === null || _window3 === void 0 ? void 0 : _window3.navigator.userAgent));
}
/**
* @internal
*/
function createFilterWrapper(filter, fn) {
	function wrapper(...args) {
		return new Promise((resolve, reject) => {
			Promise.resolve(filter(() => fn.apply(this, args), {
				fn,
				thisArg: this,
				args
			})).then(resolve).catch(reject);
		});
	}
	return wrapper;
}
/**
* Create an EventFilter that debounce the events
*/
function debounceFilter(ms, options = {}) {
	let timer;
	let maxTimer;
	let lastRejector = noop;
	const _clearTimeout = (timer) => {
		clearTimeout(timer);
		lastRejector();
		lastRejector = noop;
	};
	let lastInvoker;
	const filter = (invoke) => {
		const duration = toValue(ms);
		const maxDuration = toValue(options.maxWait);
		if (timer) _clearTimeout(timer);
		if (duration <= 0 || maxDuration !== void 0 && maxDuration <= 0) {
			if (maxTimer) {
				_clearTimeout(maxTimer);
				maxTimer = void 0;
			}
			return Promise.resolve(invoke());
		}
		return new Promise((resolve, reject) => {
			lastRejector = options.rejectOnCancel ? reject : resolve;
			lastInvoker = invoke;
			if (maxDuration && !maxTimer) maxTimer = setTimeout(() => {
				if (timer) _clearTimeout(timer);
				maxTimer = void 0;
				resolve(lastInvoker());
			}, maxDuration);
			timer = setTimeout(() => {
				if (maxTimer) _clearTimeout(maxTimer);
				maxTimer = void 0;
				resolve(invoke());
			}, duration);
		});
	};
	return filter;
}
function throttleFilter(...args) {
	let lastExec = 0;
	let timer;
	let isLeading = true;
	let lastRejector = noop;
	let lastValue;
	let ms;
	let trailing;
	let leading;
	let rejectOnCancel;
	if (!/* @__PURE__ */ isRef(args[0]) && typeof args[0] === "object") ({delay: ms, trailing = true, leading = true, rejectOnCancel = false} = args[0]);
	else [ms, trailing = true, leading = true, rejectOnCancel = false] = args;
	const clear = () => {
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
			lastRejector();
			lastRejector = noop;
		}
	};
	const filter = (_invoke) => {
		const duration = toValue(ms);
		const elapsed = Date.now() - lastExec;
		const invoke = () => {
			return lastValue = _invoke();
		};
		clear();
		if (duration <= 0) {
			lastExec = Date.now();
			return invoke();
		}
		if (elapsed > duration) {
			lastExec = Date.now();
			if (leading || !isLeading) invoke();
		} else if (trailing) lastValue = new Promise((resolve, reject) => {
			lastRejector = rejectOnCancel ? reject : resolve;
			timer = setTimeout(() => {
				lastExec = Date.now();
				isLeading = true;
				resolve(invoke());
				clear();
			}, Math.max(0, duration - elapsed));
		});
		if (!leading && !timer) timer = setTimeout(() => isLeading = true, duration);
		isLeading = false;
		return lastValue;
	};
	return filter;
}
/**
* Get a px value for SSR use, do not rely on this method outside of SSR as REM unit is assumed at 16px, which might not be the case on the client
*/
function pxValue(px) {
	return px.endsWith("rem") ? Number.parseFloat(px) * 16 : Number.parseFloat(px);
}
function toArray(value) {
	return Array.isArray(value) ? value : [value];
}
function getLifeCycleTarget(target) {
	return target || getCurrentInstance();
}
/**
* Converts ref to reactive.
*
* @see https://vueuse.org/toReactive
* @param objectRef A ref of object
*/
function toReactive(objectRef) {
	if (!/* @__PURE__ */ isRef(objectRef)) return /* @__PURE__ */ reactive(objectRef);
	return /* @__PURE__ */ reactive(new Proxy({}, {
		get(_, p, receiver) {
			return unref(Reflect.get(objectRef.value, p, receiver));
		},
		set(_, p, value) {
			if (/* @__PURE__ */ isRef(objectRef.value[p]) && !/* @__PURE__ */ isRef(value)) objectRef.value[p].value = value;
			else objectRef.value[p] = value;
			return true;
		},
		deleteProperty(_, p) {
			return Reflect.deleteProperty(objectRef.value, p);
		},
		has(_, p) {
			return Reflect.has(objectRef.value, p);
		},
		ownKeys() {
			return Object.keys(objectRef.value);
		},
		getOwnPropertyDescriptor() {
			return {
				enumerable: true,
				configurable: true
			};
		}
	}));
}
/**
* Computed reactive object.
*/
function reactiveComputed(fn) {
	return toReactive(computed(fn));
}
/**
* Debounce execution of a function.
*
* @see https://vueuse.org/useDebounceFn
* @param  fn          A function to be executed after delay milliseconds debounced.
* @param  ms          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
* @param  options     Options
*
* @return A new, debounce, function.
*
* @__NO_SIDE_EFFECTS__
*/
function useDebounceFn(fn, ms = 200, options = {}) {
	return createFilterWrapper(debounceFilter(ms, options), fn);
}
/**
* Debounce updates of a ref.
*
* @return A new debounced ref.
*/
function refDebounced(value, ms = 200, options = {}) {
	const debounced = /* @__PURE__ */ ref(toValue(value));
	const updater = useDebounceFn(() => {
		debounced.value = value.value;
	}, ms, options);
	watch(value, () => updater());
	return /* @__PURE__ */ shallowReadonly(debounced);
}
/**
* Throttle execution of a function. Especially useful for rate limiting
* execution of handlers on events like resize and scroll.
*
* @param   fn             A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
*                                    to `callback` when the throttled-function is executed.
* @param   ms             A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
*                                    (default value: 200)
*
* @param [trailing] if true, call fn again after the time is up (default value: false)
*
* @param [leading] if true, call fn on the leading edge of the ms timeout (default value: true)
*
* @param [rejectOnCancel] if true, reject the last call if it's been cancel (default value: false)
*
* @return  A new, throttled, function.
*
* @__NO_SIDE_EFFECTS__
*/
function useThrottleFn(fn, ms = 200, trailing = false, leading = true, rejectOnCancel = false) {
	return createFilterWrapper(throttleFilter(ms, trailing, leading, rejectOnCancel), fn);
}
/**
* Call onMounted() if it's inside a component lifecycle, if not, just call the function
*
* @param fn
* @param sync if set to false, it will run in the nextTick() of Vue
* @param target
*/
function tryOnMounted(fn, sync = true, target) {
	if (getLifeCycleTarget(target)) onMounted(fn, target);
	else if (sync) fn();
	else nextTick(fn);
}
/**
* Wrapper for `setTimeout` with controls.
*
* @param cb
* @param interval
* @param options
*/
function useTimeoutFn(cb, interval, options = {}) {
	const { immediate = true, immediateCallback = false } = options;
	const isPending = /* @__PURE__ */ shallowRef(false);
	let timer;
	function clear() {
		if (timer) {
			clearTimeout(timer);
			timer = void 0;
		}
	}
	function stop() {
		isPending.value = false;
		clear();
	}
	function start(...args) {
		if (immediateCallback) cb();
		clear();
		isPending.value = true;
		timer = setTimeout(() => {
			isPending.value = false;
			timer = void 0;
			cb(...args);
		}, toValue(interval));
	}
	if (immediate) {
		isPending.value = true;
		if (isClient) start();
	}
	tryOnScopeDispose(stop);
	return {
		isPending: /* @__PURE__ */ shallowReadonly(isPending),
		start,
		stop
	};
}
/**
* Shorthand for watching value with {immediate: true}
*
* @see https://vueuse.org/watchImmediate
*/
function watchImmediate(source, cb, options) {
	return watch(source, cb, {
		...options,
		immediate: true
	});
}
//#endregion
//#region node_modules/@vueuse/core/dist/index.js
var defaultWindow = isClient ? window : void 0;
var defaultDocument = isClient ? window.document : void 0;
isClient && window.navigator;
isClient && window.location;
/**
* Get the dom element of a ref of element or Vue component instance
*
* @param elRef
*/
function unrefElement(elRef) {
	var _$el;
	const plain = toValue(elRef);
	return (_$el = plain === null || plain === void 0 ? void 0 : plain.$el) !== null && _$el !== void 0 ? _$el : plain;
}
function useEventListener(...args) {
	const register = (el, event, listener, options) => {
		el.addEventListener(event, listener, options);
		return () => el.removeEventListener(event, listener, options);
	};
	const firstParamTargets = computed(() => {
		const test = toArray(toValue(args[0])).filter((e) => e != null);
		return test.every((e) => typeof e !== "string") ? test : void 0;
	});
	return watchImmediate(() => {
		var _firstParamTargets$va, _firstParamTargets$va2;
		return [
			(_firstParamTargets$va = (_firstParamTargets$va2 = firstParamTargets.value) === null || _firstParamTargets$va2 === void 0 ? void 0 : _firstParamTargets$va2.map((e) => unrefElement(e))) !== null && _firstParamTargets$va !== void 0 ? _firstParamTargets$va : [defaultWindow].filter((e) => e != null),
			toArray(toValue(firstParamTargets.value ? args[1] : args[0])),
			toArray(unref(firstParamTargets.value ? args[2] : args[1])),
			toValue(firstParamTargets.value ? args[3] : args[2])
		];
	}, ([raw_targets, raw_events, raw_listeners, raw_options], _, onCleanup) => {
		if (!(raw_targets === null || raw_targets === void 0 ? void 0 : raw_targets.length) || !(raw_events === null || raw_events === void 0 ? void 0 : raw_events.length) || !(raw_listeners === null || raw_listeners === void 0 ? void 0 : raw_listeners.length)) return;
		const optionsClone = isObject(raw_options) ? { ...raw_options } : raw_options;
		const cleanups = raw_targets.flatMap((el) => raw_events.flatMap((event) => raw_listeners.map((listener) => register(el, event, listener, optionsClone))));
		onCleanup(() => {
			cleanups.forEach((fn) => fn());
		});
	}, { flush: "post" });
}
var _iOSWorkaround = false;
function onClickOutside(target, handler, options = {}) {
	const { window = defaultWindow, ignore = [], capture = true, detectIframe = false, controls = false } = options;
	if (!window) return controls ? {
		stop: noop,
		cancel: noop,
		trigger: noop
	} : noop;
	if (isIOS && !_iOSWorkaround) {
		_iOSWorkaround = true;
		const listenerOptions = { passive: true };
		Array.from(window.document.body.children).forEach((el) => el.addEventListener("click", noop, listenerOptions));
		window.document.documentElement.addEventListener("click", noop, listenerOptions);
	}
	let shouldListen = true;
	const shouldIgnore = (event) => {
		return toValue(ignore).some((target) => {
			if (typeof target === "string") return Array.from(window.document.querySelectorAll(target)).some((el) => el === event.target || event.composedPath().includes(el));
			else {
				const el = unrefElement(target);
				return el && (event.target === el || event.composedPath().includes(el));
			}
		});
	};
	/**
	* Determines if the given target has multiple root elements.
	* Referenced from: https://github.com/vuejs/test-utils/blob/ccb460be55f9f6be05ab708500a41ec8adf6f4bc/src/vue-wrapper.ts#L21
	*/
	function hasMultipleRoots(target) {
		const vm = toValue(target);
		return vm && vm.$.subTree.shapeFlag === 16;
	}
	function checkMultipleRoots(target, event) {
		const vm = toValue(target);
		const children = vm.$.subTree && vm.$.subTree.children;
		if (children == null || !Array.isArray(children)) return false;
		return children.some((child) => child.el === event.target || event.composedPath().includes(child.el));
	}
	const listener = (event) => {
		const el = unrefElement(target);
		if (event.target == null) return;
		if (!(el instanceof Element) && hasMultipleRoots(target) && checkMultipleRoots(target, event)) return;
		if (!el || el === event.target || event.composedPath().includes(el)) return;
		if ("detail" in event && event.detail === 0) shouldListen = !shouldIgnore(event);
		if (!shouldListen) {
			shouldListen = true;
			return;
		}
		handler(event);
	};
	let isProcessingClick = false;
	const cleanup = [
		useEventListener(window, "click", (event) => {
			if (!isProcessingClick) {
				isProcessingClick = true;
				setTimeout(() => {
					isProcessingClick = false;
				}, 0);
				listener(event);
			}
		}, {
			passive: true,
			capture
		}),
		useEventListener(window, "pointerdown", (e) => {
			const el = unrefElement(target);
			shouldListen = !shouldIgnore(e) && !!(el && !e.composedPath().includes(el));
		}, { passive: true }),
		detectIframe && useEventListener(window, "blur", (event) => {
			setTimeout(() => {
				const el = unrefElement(target);
				let activeEl = window.document.activeElement;
				while (activeEl === null || activeEl === void 0 ? void 0 : activeEl.shadowRoot) activeEl = activeEl.shadowRoot.activeElement;
				if ((activeEl === null || activeEl === void 0 ? void 0 : activeEl.tagName) === "IFRAME" && !(el === null || el === void 0 ? void 0 : el.contains(window.document.activeElement))) handler(event);
			}, 0);
		}, { passive: true })
	].filter(Boolean);
	const stop = () => cleanup.forEach((fn) => fn());
	if (controls) return {
		stop,
		cancel: () => {
			shouldListen = false;
		},
		trigger: (event) => {
			shouldListen = true;
			listener(event);
			shouldListen = false;
		}
	};
	return stop;
}
/**
* Mounted state in ref.
*
* @see https://vueuse.org/useMounted
*
* @__NO_SIDE_EFFECTS__
*/
function useMounted() {
	const isMounted = /* @__PURE__ */ shallowRef(false);
	const instance = getCurrentInstance();
	if (instance) onMounted(() => {
		isMounted.value = true;
	}, instance);
	return isMounted;
}
/* @__NO_SIDE_EFFECTS__ */
function useSupported(callback) {
	const isMounted = useMounted();
	return computed(() => {
		isMounted.value;
		return Boolean(callback());
	});
}
/**
* Watch for changes being made to the DOM tree.
*
* @see https://vueuse.org/useMutationObserver
* @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver MutationObserver MDN
* @param target
* @param callback
* @param options
*/
function useMutationObserver(target, callback, options = {}) {
	const { window = defaultWindow, ...mutationOptions } = options;
	let observer;
	const isSupported = /* @__PURE__ */ useSupported(() => window && "MutationObserver" in window);
	const cleanup = () => {
		if (observer) {
			observer.disconnect();
			observer = void 0;
		}
	};
	const stopWatch = watch(computed(() => {
		const items = toArray(toValue(target)).map(unrefElement).filter(notNullish);
		return new Set(items);
	}), (newTargets) => {
		cleanup();
		if (isSupported.value && newTargets.size) {
			observer = new MutationObserver(callback);
			newTargets.forEach((el) => observer.observe(el, mutationOptions));
		}
	}, {
		immediate: true,
		flush: "post"
	});
	const takeRecords = () => {
		return observer === null || observer === void 0 ? void 0 : observer.takeRecords();
	};
	const stop = () => {
		stopWatch();
		cleanup();
	};
	tryOnScopeDispose(stop);
	return {
		isSupported,
		stop,
		takeRecords
	};
}
/**
* Fires when the element or any element containing it is removed.
*
* @param target
* @param callback
* @param options
*/
function onElementRemoval(target, callback, options = {}) {
	const { window = defaultWindow, document = window === null || window === void 0 ? void 0 : window.document, flush = "sync" } = options;
	if (!window || !document) return noop;
	let stopFn;
	const cleanupAndUpdate = (fn) => {
		stopFn === null || stopFn === void 0 || stopFn();
		stopFn = fn;
	};
	const stopWatch = watchEffect(() => {
		const el = unrefElement(target);
		if (el) {
			const { stop } = useMutationObserver(document, (mutationsList) => {
				if (mutationsList.map((mutation) => [...mutation.removedNodes]).flat().some((node) => node === el || node.contains(el))) callback(mutationsList);
			}, {
				window,
				childList: true,
				subtree: true
			});
			cleanupAndUpdate(stop);
		}
	}, { flush });
	const stopHandle = () => {
		stopWatch();
		cleanupAndUpdate();
	};
	tryOnScopeDispose(stopHandle);
	return stopHandle;
}
/**
* Reactive `document.activeElement`
*
* @see https://vueuse.org/useActiveElement
* @param options
*
* @__NO_SIDE_EFFECTS__
*/
function useActiveElement(options = {}) {
	var _options$document;
	const { window = defaultWindow, deep = true, triggerOnRemoval = false } = options;
	const document = (_options$document = options.document) !== null && _options$document !== void 0 ? _options$document : window === null || window === void 0 ? void 0 : window.document;
	const getDeepActiveElement = () => {
		let element = document === null || document === void 0 ? void 0 : document.activeElement;
		if (deep) {
			var _element$shadowRoot;
			while (element === null || element === void 0 ? void 0 : element.shadowRoot) element = element === null || element === void 0 || (_element$shadowRoot = element.shadowRoot) === null || _element$shadowRoot === void 0 ? void 0 : _element$shadowRoot.activeElement;
		}
		return element;
	};
	const activeElement = /* @__PURE__ */ shallowRef();
	const trigger = () => {
		activeElement.value = getDeepActiveElement();
	};
	if (window) {
		const listenerOptions = {
			capture: true,
			passive: true
		};
		useEventListener(window, "blur", (event) => {
			if (event.relatedTarget !== null) return;
			trigger();
		}, listenerOptions);
		useEventListener(window, "focus", trigger, listenerOptions);
	}
	if (triggerOnRemoval) onElementRemoval(activeElement, trigger, { document });
	trigger();
	return activeElement;
}
var ssrWidthSymbol = Symbol("vueuse-ssr-width");
/* @__NO_SIDE_EFFECTS__ */
function useSSRWidth() {
	const ssrWidth = hasInjectionContext() ? injectLocal(ssrWidthSymbol, null) : null;
	return typeof ssrWidth === "number" ? ssrWidth : void 0;
}
/**
* Reactive Media Query.
*
* @see https://vueuse.org/useMediaQuery
* @param query
* @param options
*/
function useMediaQuery(query, options = {}) {
	const { window = defaultWindow, ssrWidth = /* @__PURE__ */ useSSRWidth() } = options;
	const isSupported = /* @__PURE__ */ useSupported(() => window && "matchMedia" in window && typeof window.matchMedia === "function");
	const ssrSupport = /* @__PURE__ */ shallowRef(typeof ssrWidth === "number");
	const mediaQuery = /* @__PURE__ */ shallowRef();
	const matches = /* @__PURE__ */ shallowRef(false);
	const handler = (event) => {
		matches.value = event.matches;
	};
	watchEffect(() => {
		if (ssrSupport.value) {
			ssrSupport.value = !isSupported.value;
			matches.value = toValue(query).split(",").some((queryString) => {
				const not = queryString.includes("not all");
				const minWidth = queryString.match(/\(\s*min-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
				const maxWidth = queryString.match(/\(\s*max-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
				let res = Boolean(minWidth || maxWidth);
				if (minWidth && res) res = ssrWidth >= pxValue(minWidth[1]);
				if (maxWidth && res) res = ssrWidth <= pxValue(maxWidth[1]);
				return not ? !res : res;
			});
			return;
		}
		if (!isSupported.value) return;
		mediaQuery.value = window.matchMedia(toValue(query));
		matches.value = mediaQuery.value.matches;
	});
	useEventListener(mediaQuery, "change", handler, { passive: true });
	return computed(() => matches.value);
}
function cloneFnJSON(source) {
	return JSON.parse(JSON.stringify(source));
}
/**
* Manipulate CSS variables.
*
* @see https://vueuse.org/useCssVar
* @param prop
* @param target
* @param options
*/
function useCssVar(prop, target, options = {}) {
	const { window = defaultWindow, initialValue, observe = false } = options;
	const variable = /* @__PURE__ */ shallowRef(initialValue);
	const elRef = computed(() => {
		var _window$document;
		return unrefElement(target) || (window === null || window === void 0 || (_window$document = window.document) === null || _window$document === void 0 ? void 0 : _window$document.documentElement);
	});
	function updateCssVar() {
		const key = toValue(prop);
		const el = toValue(elRef);
		if (el && window && key) {
			var _window$getComputedSt;
			variable.value = ((_window$getComputedSt = window.getComputedStyle(el).getPropertyValue(key)) === null || _window$getComputedSt === void 0 ? void 0 : _window$getComputedSt.trim()) || variable.value || initialValue;
		}
	}
	if (observe) useMutationObserver(elRef, updateCssVar, {
		attributeFilter: ["style", "class"],
		window
	});
	watch([elRef, () => toValue(prop)], (_, old) => {
		if (old[0] && old[1]) old[0].style.removeProperty(old[1]);
		updateCssVar();
	}, { immediate: true });
	watch([variable, elRef], ([val, el]) => {
		const raw_prop = toValue(prop);
		if ((el === null || el === void 0 ? void 0 : el.style) && raw_prop) if (val == null) el.style.removeProperty(raw_prop);
		else el.style.setProperty(raw_prop, val);
	}, { immediate: true });
	return variable;
}
/**
* Reactively track `document.visibilityState`.
*
* @see https://vueuse.org/useDocumentVisibility
*
* @__NO_SIDE_EFFECTS__
*/
function useDocumentVisibility(options = {}) {
	const { document = defaultDocument } = options;
	if (!document) return /* @__PURE__ */ shallowRef("visible");
	const visibility = /* @__PURE__ */ shallowRef(document.visibilityState);
	useEventListener(document, "visibilitychange", () => {
		visibility.value = document.visibilityState;
	}, { passive: true });
	return visibility;
}
/**
* Reports changes to the dimensions of an Element's content or the border-box
*
* @see https://vueuse.org/useResizeObserver
* @param target
* @param callback
* @param options
*/
function useResizeObserver(target, callback, options = {}) {
	const { window = defaultWindow, ...observerOptions } = options;
	let observer;
	const isSupported = /* @__PURE__ */ useSupported(() => window && "ResizeObserver" in window);
	const cleanup = () => {
		if (observer) {
			observer.disconnect();
			observer = void 0;
		}
	};
	const stopWatch = watch(computed(() => {
		const _targets = toValue(target);
		return Array.isArray(_targets) ? _targets.map((el) => unrefElement(el)) : [unrefElement(_targets)];
	}), (els) => {
		cleanup();
		if (isSupported.value && window) {
			observer = new ResizeObserver(callback);
			for (const _el of els) if (_el) observer.observe(_el, observerOptions);
		}
	}, {
		immediate: true,
		flush: "post"
	});
	const stop = () => {
		cleanup();
		stopWatch();
	};
	tryOnScopeDispose(stop);
	return {
		isSupported,
		stop
	};
}
/**
* Reactive bounding box of an HTML element.
*
* @see https://vueuse.org/useElementBounding
* @param target
*/
function useElementBounding(target, options = {}) {
	const { reset = true, windowResize = true, windowScroll = true, immediate = true, updateTiming = "sync" } = options;
	const height = /* @__PURE__ */ shallowRef(0);
	const bottom = /* @__PURE__ */ shallowRef(0);
	const left = /* @__PURE__ */ shallowRef(0);
	const right = /* @__PURE__ */ shallowRef(0);
	const top = /* @__PURE__ */ shallowRef(0);
	const width = /* @__PURE__ */ shallowRef(0);
	const x = /* @__PURE__ */ shallowRef(0);
	const y = /* @__PURE__ */ shallowRef(0);
	function recalculate() {
		const el = unrefElement(target);
		if (!el) {
			if (reset) {
				height.value = 0;
				bottom.value = 0;
				left.value = 0;
				right.value = 0;
				top.value = 0;
				width.value = 0;
				x.value = 0;
				y.value = 0;
			}
			return;
		}
		const rect = el.getBoundingClientRect();
		height.value = rect.height;
		bottom.value = rect.bottom;
		left.value = rect.left;
		right.value = rect.right;
		top.value = rect.top;
		width.value = rect.width;
		x.value = rect.x;
		y.value = rect.y;
	}
	function update() {
		if (updateTiming === "sync") recalculate();
		else if (updateTiming === "next-frame") requestAnimationFrame(() => recalculate());
	}
	useResizeObserver(target, update);
	watch(() => unrefElement(target), (ele) => !ele && update());
	useMutationObserver(target, update, { attributeFilter: ["style", "class"] });
	if (windowScroll) useEventListener("scroll", update, {
		capture: true,
		passive: true
	});
	if (windowResize) useEventListener("resize", update, { passive: true });
	tryOnMounted(() => {
		if (immediate) update();
	});
	return {
		height,
		bottom,
		left,
		right,
		top,
		width,
		x,
		y,
		update
	};
}
/**
* Reactive size of an HTML element.
*
* @see https://vueuse.org/useElementSize
*/
function useElementSize(target, initialSize = {
	width: 0,
	height: 0
}, options = {}) {
	const { window = defaultWindow, box = "content-box" } = options;
	const isSVG = computed(() => {
		var _unrefElement;
		return (_unrefElement = unrefElement(target)) === null || _unrefElement === void 0 || (_unrefElement = _unrefElement.namespaceURI) === null || _unrefElement === void 0 ? void 0 : _unrefElement.includes("svg");
	});
	const width = /* @__PURE__ */ shallowRef(initialSize.width);
	const height = /* @__PURE__ */ shallowRef(initialSize.height);
	const { stop: stop1 } = useResizeObserver(target, ([entry]) => {
		const boxSize = box === "border-box" ? entry.borderBoxSize : box === "content-box" ? entry.contentBoxSize : entry.devicePixelContentBoxSize;
		if (window && isSVG.value) {
			const $elem = unrefElement(target);
			if ($elem) {
				const rect = $elem.getBoundingClientRect();
				width.value = rect.width;
				height.value = rect.height;
			}
		} else if (boxSize) {
			const formatBoxSize = toArray(boxSize);
			width.value = formatBoxSize.reduce((acc, { inlineSize }) => acc + inlineSize, 0);
			height.value = formatBoxSize.reduce((acc, { blockSize }) => acc + blockSize, 0);
		} else {
			width.value = entry.contentRect.width;
			height.value = entry.contentRect.height;
		}
	}, options);
	tryOnMounted(() => {
		const ele = unrefElement(target);
		if (ele) {
			width.value = "offsetWidth" in ele ? ele.offsetWidth : initialSize.width;
			height.value = "offsetHeight" in ele ? ele.offsetHeight : initialSize.height;
		}
	});
	const stop2 = watch(() => unrefElement(target), (ele) => {
		width.value = ele ? initialSize.width : 0;
		height.value = ele ? initialSize.height : 0;
	});
	function stop() {
		stop1();
		stop2();
	}
	return {
		width,
		height,
		stop
	};
}
/**
* Detects changes to a target element's visibility.
*
* @see https://vueuse.org/useIntersectionObserver
* @param target
* @param callback
* @param options
*/
function useIntersectionObserver(target, callback, options = {}) {
	const { root, rootMargin, threshold = 0, window = defaultWindow, immediate = true } = options;
	const isSupported = /* @__PURE__ */ useSupported(() => window && "IntersectionObserver" in window);
	const targets = computed(() => {
		return toArray(toValue(target)).map(unrefElement).filter(notNullish);
	});
	let cleanup = noop;
	const isActive = /* @__PURE__ */ shallowRef(immediate);
	const stopWatch = isSupported.value ? watch(() => [
		targets.value,
		unrefElement(root),
		toValue(rootMargin),
		isActive.value
	], ([targets, root, rootMargin]) => {
		cleanup();
		if (!isActive.value) return;
		if (!targets.length) return;
		const observer = new IntersectionObserver(callback, {
			root: unrefElement(root),
			rootMargin,
			threshold
		});
		targets.forEach((el) => el && observer.observe(el));
		cleanup = () => {
			observer.disconnect();
			cleanup = noop;
		};
	}, {
		immediate,
		flush: "post"
	}) : noop;
	const stop = () => {
		cleanup();
		stopWatch();
		isActive.value = false;
	};
	tryOnScopeDispose(stop);
	return {
		isSupported,
		isActive,
		pause() {
			cleanup();
			isActive.value = false;
		},
		resume() {
			isActive.value = true;
		},
		stop
	};
}
Number.POSITIVE_INFINITY;
/**
* Shorthand for v-model binding, props + emit -> ref
*
* @see https://vueuse.org/useVModel
* @param props
* @param key (default 'modelValue')
* @param emit
* @param options
*
* @__NO_SIDE_EFFECTS__
*/
function useVModel(props, key, emit, options = {}) {
	var _vm$$emit, _vm$proxy;
	const { clone = false, passive = false, eventName, deep = false, defaultValue, shouldEmit } = options;
	const vm = getCurrentInstance();
	const _emit = emit || (vm === null || vm === void 0 ? void 0 : vm.emit) || (vm === null || vm === void 0 || (_vm$$emit = vm.$emit) === null || _vm$$emit === void 0 ? void 0 : _vm$$emit.bind(vm)) || (vm === null || vm === void 0 || (_vm$proxy = vm.proxy) === null || _vm$proxy === void 0 || (_vm$proxy = _vm$proxy.$emit) === null || _vm$proxy === void 0 ? void 0 : _vm$proxy.bind(vm === null || vm === void 0 ? void 0 : vm.proxy));
	let event = eventName;
	if (!key) key = "modelValue";
	event = event || `update:${key.toString()}`;
	const cloneFn = (val) => !clone ? val : typeof clone === "function" ? clone(val) : cloneFnJSON(val);
	const getValue = () => isDef(props[key]) ? cloneFn(props[key]) : defaultValue;
	const triggerEmit = (value) => {
		if (shouldEmit) {
			if (shouldEmit(value)) _emit(event, value);
		} else _emit(event, value);
	};
	if (passive) {
		const proxy = /* @__PURE__ */ ref(getValue());
		let isUpdating = false;
		watch(() => props[key], (v) => {
			if (!isUpdating) {
				isUpdating = true;
				proxy.value = cloneFn(v);
				nextTick(() => isUpdating = false);
			}
		});
		watch(proxy, (v) => {
			if (!isUpdating && (v !== props[key] || deep)) triggerEmit(v);
		}, { deep });
		return proxy;
	} else return computed({
		get() {
			return getValue();
		},
		set(value) {
			triggerEmit(value);
		}
	});
}
/**
* Reactively track window focus with `window.onfocus` and `window.onblur`.
*
* @see https://vueuse.org/useWindowFocus
*
* @__NO_SIDE_EFFECTS__
*/
function useWindowFocus(options = {}) {
	const { window = defaultWindow } = options;
	if (!window) return /* @__PURE__ */ shallowRef(false);
	const focused = /* @__PURE__ */ shallowRef(window.document.hasFocus());
	const listenerOptions = { passive: true };
	useEventListener(window, "blur", () => {
		focused.value = false;
	}, listenerOptions);
	useEventListener(window, "focus", () => {
		focused.value = true;
	}, listenerOptions);
	return focused;
}
/**
* Reactive window size.
*
* @see https://vueuse.org/useWindowSize
* @param options
*
* @__NO_SIDE_EFFECTS__
*/
function useWindowSize(options = {}) {
	const { window = defaultWindow, initialWidth = Number.POSITIVE_INFINITY, initialHeight = Number.POSITIVE_INFINITY, listenOrientation = true, includeScrollbar = true, type = "inner" } = options;
	const width = /* @__PURE__ */ shallowRef(initialWidth);
	const height = /* @__PURE__ */ shallowRef(initialHeight);
	const update = () => {
		if (window) if (type === "outer") {
			width.value = window.outerWidth;
			height.value = window.outerHeight;
		} else if (type === "visual" && window.visualViewport) {
			const { width: visualViewportWidth, height: visualViewportHeight, scale } = window.visualViewport;
			width.value = Math.round(visualViewportWidth * scale);
			height.value = Math.round(visualViewportHeight * scale);
		} else if (includeScrollbar) {
			width.value = window.innerWidth;
			height.value = window.innerHeight;
		} else {
			width.value = window.document.documentElement.clientWidth;
			height.value = window.document.documentElement.clientHeight;
		}
	};
	update();
	tryOnMounted(update);
	const listenerOptions = { passive: true };
	useEventListener("resize", update, listenerOptions);
	if (window && type === "visual" && window.visualViewport) useEventListener(window.visualViewport, "resize", update, listenerOptions);
	if (listenOrientation) watch(useMediaQuery("(orientation: portrait)"), () => update());
	return {
		width,
		height
	};
}
//#endregion
//#region node_modules/element-plus/es/hooks/use-calc-input-width/index.mjs
function useCalcInputWidth() {
	const calculatorRef = /* @__PURE__ */ shallowRef();
	const calculatorWidth = /* @__PURE__ */ ref(0);
	const inputStyle = computed(() => ({ minWidth: `${Math.max(calculatorWidth.value, 11)}px` }));
	const resetCalculatorWidth = () => {
		calculatorWidth.value = calculatorRef.value?.getBoundingClientRect().width ?? 0;
	};
	useResizeObserver(calculatorRef, resetCalculatorWidth);
	return {
		calculatorRef,
		calculatorWidth,
		inputStyle
	};
}
//#endregion
//#region node_modules/element-plus/es/hooks/use-deprecated/index.mjs
var useDeprecated = ({ from, replacement, scope, version, ref, type = "API" }, condition) => {
	watch(() => unref(condition), (val) => {
		if (val) debugWarn(scope, `[${type}] ${from} is about to be deprecated in version ${version}, please use ${replacement} instead.
For more detail, please visit: ${ref}
`);
	}, { immediate: true });
};
//#endregion
//#region node_modules/element-plus/es/utils/dom/aria.mjs
var FOCUSABLE_ELEMENT_SELECTORS = `a[href],button:not([disabled]),button:not([hidden]),:not([tabindex="-1"]),input:not([disabled]),input:not([type="hidden"]),select:not([disabled]),textarea:not([disabled])`;
var isShadowRoot = (e) => {
	if (typeof ShadowRoot === "undefined") return false;
	return e instanceof ShadowRoot;
};
var isHTMLElement = (e) => {
	if (typeof Element === "undefined") return false;
	return e instanceof Element;
};
/**
* Determine if the testing element is visible on screen no matter if its on the viewport or not
*/
var isVisible = (element) => {
	return getComputedStyle(element).position === "fixed" ? false : element.offsetParent !== null;
};
var obtainAllFocusableElements$1 = (element) => {
	return Array.from(element.querySelectorAll(FOCUSABLE_ELEMENT_SELECTORS)).filter((item) => isFocusable(item) && isVisible(item));
};
/**
* @desc Determine if target element is focusable
* @param element {HTMLElement}
* @returns {Boolean} true if it is focusable
*/
var isFocusable = (element) => {
	if (element.tabIndex > 0 || element.tabIndex === 0 && element.getAttribute("tabIndex") !== null) return true;
	if (element.tabIndex < 0 || element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true") return false;
	switch (element.nodeName) {
		case "A": return !!element.href && element.rel !== "ignore";
		case "INPUT": return !(element.type === "hidden" || element.type === "file");
		case "BUTTON":
		case "SELECT":
		case "TEXTAREA": return true;
		default: return false;
	}
};
/**
* Trigger an event
* mouseenter, mouseleave, mouseover, keyup, change, click, etc.
* @param  {HTMLElement} elm
* @param  {String} name
* @param  {*} opts
*/
var triggerEvent = function(elm, name, ...opts) {
	let eventName;
	if (name.includes("mouse") || name.includes("click")) eventName = "MouseEvents";
	else if (name.includes("key")) eventName = "KeyboardEvent";
	else eventName = "HTMLEvents";
	const evt = document.createEvent(eventName);
	evt.initEvent(name, ...opts);
	elm.dispatchEvent(evt);
	return elm;
};
var isLeaf = (el) => !el.getAttribute("aria-owns");
var getSibling = (el, distance, elClass) => {
	const { parentNode } = el;
	if (!parentNode) return null;
	const siblings = parentNode.querySelectorAll(elClass);
	return siblings[Array.prototype.indexOf.call(siblings, el) + distance] || null;
};
var focusElement = (el, options) => {
	if (!el || !el.focus) return;
	let cleanup = false;
	if (isHTMLElement(el) && !isFocusable(el) && !el.getAttribute("tabindex")) {
		el.setAttribute("tabindex", "-1");
		cleanup = true;
	}
	el.focus(options);
	if (isHTMLElement(el) && cleanup) el.removeAttribute("tabindex");
};
var focusNode = (el) => {
	if (!el) return;
	focusElement(el);
	!isLeaf(el) && el.click();
};
//#endregion
//#region node_modules/element-plus/es/utils/browser.mjs
var isFirefox = () => isClient && /firefox/i.test(window.navigator.userAgent);
var isAndroid = () => isClient && /android/i.test(window.navigator.userAgent);
//#endregion
//#region node_modules/element-plus/es/utils/strings.mjs
/**
* fork from {@link https://github.com/sindresorhus/escape-string-regexp}
*/
var escapeStringRegexp = (string = "") => string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
var capitalize = (str) => capitalize$1(str);
//#endregion
//#region node_modules/element-plus/es/utils/dom/style.mjs
var SCOPE$3 = "utils/dom/style";
var classNameToArray = (cls = "") => cls.split(" ").filter((item) => !!item.trim());
var hasClass = (el, cls) => {
	if (!el || !cls) return false;
	if (cls.includes(" ")) throw new Error("className should not contain space.");
	return el.classList.contains(cls);
};
var addClass = (el, cls) => {
	if (!el || !cls.trim()) return;
	el.classList.add(...classNameToArray(cls));
};
var removeClass = (el, cls) => {
	if (!el || !cls.trim()) return;
	el.classList.remove(...classNameToArray(cls));
};
var getStyle = (element, styleName) => {
	if (!isClient || !element || !styleName || isShadowRoot(element)) return "";
	let key = camelize$1(styleName);
	if (key === "float") key = "cssFloat";
	try {
		const style = element.style[key];
		if (style) return style;
		const computed = document.defaultView?.getComputedStyle(element, "");
		return computed ? computed[key] : "";
	} catch {
		return element.style[key];
	}
};
var setStyle = (element, styleName, value) => {
	if (!element || !styleName) return;
	if (isObject$2(styleName)) entriesOf(styleName).forEach(([prop, value]) => setStyle(element, prop, value));
	else {
		const key = camelize$1(styleName);
		element.style[key] = value;
	}
};
function addUnit(value, defaultUnit = "px") {
	if (!value && value !== 0) return "";
	if (isNumber(value) || isStringNumber(value)) return `${value}${defaultUnit}`;
	else if (isString(value)) return value;
	debugWarn(SCOPE$3, "binding value must be a string or number");
}
//#endregion
//#region node_modules/element-plus/es/hooks/use-draggable/index.mjs
var useDraggable = (targetRef, dragRef, draggable, overflow) => {
	const transform = {
		offsetX: 0,
		offsetY: 0
	};
	const isDragging = /* @__PURE__ */ ref(false);
	const adjustPosition = (moveX, moveY) => {
		if (targetRef.value) {
			const { offsetX, offsetY } = transform;
			const targetRect = targetRef.value.getBoundingClientRect();
			const targetLeft = Math.max(targetRect.left, 0);
			const targetTop = Math.max(targetRect.top, 0);
			const targetWidth = targetRect.width;
			const targetHeight = targetRect.height;
			const clientWidth = document.documentElement.clientWidth;
			const clientHeight = document.documentElement.clientHeight;
			const minLeft = -targetLeft + offsetX;
			const minTop = -targetTop + offsetY;
			const maxLeft = clientWidth - targetLeft - targetWidth + offsetX;
			const maxTop = clientHeight - targetTop - (targetHeight < clientHeight ? targetHeight : 0) + offsetY;
			if (!overflow?.value) {
				moveX = clamp$1(moveX, minLeft, maxLeft);
				moveY = clamp$1(moveY, minTop, maxTop);
			}
			transform.offsetX = moveX;
			transform.offsetY = moveY;
			targetRef.value.style.transform = `translate(${addUnit(moveX)}, ${addUnit(moveY)})`;
		}
	};
	const onMousedown = (e) => {
		const downX = e.clientX;
		const downY = e.clientY;
		const { offsetX, offsetY } = transform;
		const onMousemove = (e) => {
			if (!isDragging.value) isDragging.value = true;
			adjustPosition(offsetX + e.clientX - downX, offsetY + e.clientY - downY);
		};
		const onMouseup = () => {
			isDragging.value = false;
			document.removeEventListener("mousemove", onMousemove);
			document.removeEventListener("mouseup", onMouseup);
		};
		document.addEventListener("mousemove", onMousemove);
		document.addEventListener("mouseup", onMouseup);
	};
	const onDraggable = () => {
		if (dragRef.value && targetRef.value) {
			dragRef.value.addEventListener("mousedown", onMousedown);
			window.addEventListener("resize", updatePosition);
		}
	};
	const offDraggable = () => {
		if (dragRef.value && targetRef.value) {
			dragRef.value.removeEventListener("mousedown", onMousedown);
			window.removeEventListener("resize", updatePosition);
		}
	};
	const resetPosition = () => {
		transform.offsetX = 0;
		transform.offsetY = 0;
		if (targetRef.value) targetRef.value.style.transform = "";
	};
	const updatePosition = () => {
		const { offsetX, offsetY } = transform;
		adjustPosition(offsetX, offsetY);
	};
	onMounted(() => {
		watchEffect(() => {
			if (draggable.value) onDraggable();
			else offDraggable();
		});
	});
	onBeforeUnmount(() => {
		offDraggable();
	});
	return {
		isDragging,
		resetPosition,
		updatePosition
	};
};
//#endregion
//#region node_modules/element-plus/es/locale/lang/en.mjs
var en_default = {
	name: "en",
	el: {
		breadcrumb: { label: "Breadcrumb" },
		colorpicker: {
			confirm: "OK",
			clear: "Clear",
			defaultLabel: "color picker",
			description: "current color is {color}. press enter to select a new color.",
			alphaLabel: "pick alpha value",
			alphaDescription: "alpha {alpha}, current color is {color}",
			hueLabel: "pick hue value",
			hueDescription: "hue {hue}, current color is {color}",
			svLabel: "pick saturation and brightness value",
			svDescription: "saturation {saturation}, brightness {brightness}, current color is {color}",
			predefineDescription: "select {value} as the color"
		},
		datepicker: {
			now: "Now",
			today: "Today",
			cancel: "Cancel",
			clear: "Clear",
			confirm: "OK",
			dateTablePrompt: "Use the arrow keys and enter to select the day of the month",
			monthTablePrompt: "Use the arrow keys and enter to select the month",
			yearTablePrompt: "Use the arrow keys and enter to select the year",
			selectedDate: "Selected date",
			selectDate: "Select date",
			selectTime: "Select time",
			startDate: "Start Date",
			startTime: "Start Time",
			endDate: "End Date",
			endTime: "End Time",
			prevYear: "Previous Year",
			nextYear: "Next Year",
			prevMonth: "Previous Month",
			nextMonth: "Next Month",
			year: "",
			month1: "January",
			month2: "February",
			month3: "March",
			month4: "April",
			month5: "May",
			month6: "June",
			month7: "July",
			month8: "August",
			month9: "September",
			month10: "October",
			month11: "November",
			month12: "December",
			weeks: {
				sun: "Sun",
				mon: "Mon",
				tue: "Tue",
				wed: "Wed",
				thu: "Thu",
				fri: "Fri",
				sat: "Sat"
			},
			weeksFull: {
				sun: "Sunday",
				mon: "Monday",
				tue: "Tuesday",
				wed: "Wednesday",
				thu: "Thursday",
				fri: "Friday",
				sat: "Saturday"
			},
			months: {
				jan: "Jan",
				feb: "Feb",
				mar: "Mar",
				apr: "Apr",
				may: "May",
				jun: "Jun",
				jul: "Jul",
				aug: "Aug",
				sep: "Sep",
				oct: "Oct",
				nov: "Nov",
				dec: "Dec"
			}
		},
		inputNumber: {
			decrease: "decrease number",
			increase: "increase number"
		},
		select: {
			loading: "Loading",
			noMatch: "No matching data",
			noData: "No data",
			placeholder: "Select"
		},
		mention: { loading: "Loading" },
		dropdown: { toggleDropdown: "Toggle Dropdown" },
		cascader: {
			noMatch: "No matching data",
			loading: "Loading",
			placeholder: "Select",
			noData: "No data"
		},
		pagination: {
			goto: "Go to",
			pagesize: "/page",
			total: "Total {total}",
			pageClassifier: "",
			page: "Page",
			prev: "Go to previous page",
			next: "Go to next page",
			currentPage: "page {pager}",
			prevPages: "Previous {pager} pages",
			nextPages: "Next {pager} pages",
			deprecationWarning: "Deprecated usages detected, please refer to the el-pagination documentation for more details"
		},
		dialog: { close: "Close this dialog" },
		drawer: { close: "Close this dialog" },
		messagebox: {
			title: "Message",
			confirm: "OK",
			cancel: "Cancel",
			error: "Illegal input",
			close: "Close this dialog"
		},
		upload: {
			deleteTip: "press delete to remove",
			delete: "Delete",
			preview: "Preview",
			continue: "Continue"
		},
		slider: {
			defaultLabel: "slider between {min} and {max}",
			defaultRangeStartLabel: "pick start value",
			defaultRangeEndLabel: "pick end value"
		},
		table: {
			emptyText: "No Data",
			confirmFilter: "Confirm",
			resetFilter: "Reset",
			clearFilter: "All",
			sumText: "Sum",
			selectAllLabel: "Select all rows",
			selectRowLabel: "Select this row",
			expandRowLabel: "Expand this row",
			collapseRowLabel: "Collapse this row",
			sortLabel: "Sort by {column}",
			filterLabel: "Filter by {column}"
		},
		tag: { close: "Close this tag" },
		tour: {
			next: "Next",
			previous: "Previous",
			finish: "Finish",
			close: "Close this dialog"
		},
		tree: { emptyText: "No Data" },
		transfer: {
			noMatch: "No matching data",
			noData: "No data",
			titles: ["List 1", "List 2"],
			filterPlaceholder: "Enter keyword",
			noCheckedFormat: "{total} items",
			hasCheckedFormat: "{checked}/{total} checked"
		},
		image: { error: "FAILED" },
		pageHeader: { title: "Back" },
		popconfirm: {
			confirmButtonText: "Yes",
			cancelButtonText: "No"
		},
		carousel: {
			leftArrow: "Carousel arrow left",
			rightArrow: "Carousel arrow right",
			indicator: "Carousel switch to index {index}"
		},
		inputOTP: {
			groupLabel: "OTP Input",
			defaultLabel: "Please enter OTP character {index}"
		}
	}
};
//#endregion
//#region node_modules/element-plus/es/hooks/use-locale/index.mjs
var buildTranslator = (locale) => (path, option) => translate(path, option, unref(locale));
var translate = (path, option, locale) => get(locale, path, path).replace(/\{(\w+)\}/g, (_, key) => `${option?.[key] ?? `{${key}}`}`);
var buildLocaleContext = (locale) => {
	return {
		lang: computed(() => unref(locale).name),
		locale: /* @__PURE__ */ isRef(locale) ? locale : /* @__PURE__ */ ref(locale),
		t: buildTranslator(locale)
	};
};
var localeContextKey = Symbol("localeContextKey");
var useLocale = (localeOverrides) => {
	const locale = localeOverrides || inject(localeContextKey, /* @__PURE__ */ ref());
	return buildLocaleContext(computed(() => locale.value || en_default));
};
//#endregion
//#region node_modules/element-plus/es/hooks/use-namespace/index.mjs
var statePrefix = "is-";
var _bem = (namespace, block, blockSuffix, element, modifier) => {
	let cls = `${namespace}-${block}`;
	if (blockSuffix) cls += `-${blockSuffix}`;
	if (element) cls += `__${element}`;
	if (modifier) cls += `--${modifier}`;
	return cls;
};
var namespaceContextKey = Symbol("namespaceContextKey");
var useGetDerivedNamespace = (namespaceOverrides) => {
	const derivedNamespace = namespaceOverrides || (getCurrentInstance() ? inject(namespaceContextKey, /* @__PURE__ */ ref("el")) : /* @__PURE__ */ ref("el"));
	return computed(() => {
		return unref(derivedNamespace) || "el";
	});
};
var useNamespace = (block, namespaceOverrides) => {
	const namespace = useGetDerivedNamespace(namespaceOverrides);
	const b = (blockSuffix = "") => _bem(namespace.value, block, blockSuffix, "", "");
	const e = (element) => element ? _bem(namespace.value, block, "", element, "") : "";
	const m = (modifier) => modifier ? _bem(namespace.value, block, "", "", modifier) : "";
	const be = (blockSuffix, element) => blockSuffix && element ? _bem(namespace.value, block, blockSuffix, element, "") : "";
	const em = (element, modifier) => element && modifier ? _bem(namespace.value, block, "", element, modifier) : "";
	const bm = (blockSuffix, modifier) => blockSuffix && modifier ? _bem(namespace.value, block, blockSuffix, "", modifier) : "";
	const bem = (blockSuffix, element, modifier) => blockSuffix && element && modifier ? _bem(namespace.value, block, blockSuffix, element, modifier) : "";
	const is = (name, ...args) => {
		const state = args.length >= 1 ? args[0] : true;
		return name && state ? `${statePrefix}${name}` : "";
	};
	const cssVar = (object) => {
		const styles = {};
		for (const key in object) if (object[key]) styles[`--${namespace.value}-${key}`] = object[key];
		return styles;
	};
	const cssVarBlock = (object) => {
		const styles = {};
		for (const key in object) if (object[key]) styles[`--${namespace.value}-${block}-${key}`] = object[key];
		return styles;
	};
	const cssVarName = (name) => `--${namespace.value}-${name}`;
	const cssVarBlockName = (name) => `--${namespace.value}-${block}-${name}`;
	return {
		namespace,
		b,
		e,
		m,
		be,
		em,
		bm,
		bem,
		is,
		cssVar,
		cssVarName,
		cssVarBlock,
		cssVarBlockName
	};
};
//#endregion
//#region node_modules/element-plus/es/utils/easings.mjs
function easeInOutCubic(t, b, c, d) {
	const cc = c - b;
	t /= d / 2;
	if (t < 1) return cc / 2 * t * t * t + b;
	return cc / 2 * ((t -= 2) * t * t + 2) + b;
}
//#endregion
//#region node_modules/element-plus/es/utils/raf.mjs
var rAF = (fn) => isClient ? window.requestAnimationFrame(fn) : setTimeout(fn, 16);
var cAF = (handle) => isClient ? window.cancelAnimationFrame(handle) : clearTimeout(handle);
//#endregion
//#region node_modules/element-plus/es/utils/dom/scroll.mjs
var isScroll = (el, isVertical) => {
	if (!isClient) return false;
	const key = {
		undefined: "overflow",
		true: "overflow-y",
		false: "overflow-x"
	}[String(isVertical)];
	const overflow = getStyle(el, key);
	return [
		"scroll",
		"auto",
		"overlay"
	].some((s) => overflow.includes(s));
};
var getScrollContainer = (el, isVertical) => {
	if (!isClient) return;
	let parent = el;
	while (parent) {
		if ([
			window,
			document,
			document.documentElement
		].includes(parent)) return window;
		if (isScroll(parent, isVertical)) return parent;
		if (isShadowRoot(parent)) parent = parent.host;
		else parent = parent.parentNode;
	}
	return parent;
};
var scrollBarWidth;
var getScrollBarWidth = (namespace) => {
	if (!isClient) return 0;
	if (scrollBarWidth !== void 0) return scrollBarWidth;
	const outer = document.createElement("div");
	outer.className = `${namespace}-scrollbar__wrap`;
	outer.style.visibility = "hidden";
	outer.style.width = "100px";
	outer.style.position = "absolute";
	outer.style.top = "-9999px";
	document.body.appendChild(outer);
	const widthNoScroll = outer.offsetWidth;
	outer.style.overflow = "scroll";
	const inner = document.createElement("div");
	inner.style.width = "100%";
	outer.appendChild(inner);
	const widthWithScroll = inner.offsetWidth;
	outer.parentNode?.removeChild(outer);
	scrollBarWidth = widthNoScroll - widthWithScroll;
	return scrollBarWidth;
};
/**
* Scroll with in the container element, positioning the **selected** element at the top
* of the container
*/
function scrollIntoView(container, selected) {
	if (!isClient) return;
	if (!selected) {
		container.scrollTop = 0;
		return;
	}
	const offsetParents = [];
	let pointer = selected.offsetParent;
	while (pointer !== null && container !== pointer && container.contains(pointer)) {
		offsetParents.push(pointer);
		pointer = pointer.offsetParent;
	}
	const top = selected.offsetTop + offsetParents.reduce((prev, curr) => prev + curr.offsetTop, 0);
	const bottom = top + selected.offsetHeight;
	const viewRectTop = container.scrollTop;
	const viewRectBottom = viewRectTop + container.clientHeight;
	if (top < viewRectTop) container.scrollTop = top;
	else if (bottom > viewRectBottom) container.scrollTop = bottom - container.clientHeight;
}
function animateScrollTo(container, from, to, duration, callback) {
	const startTime = Date.now();
	let handle;
	const scroll = () => {
		const time = Date.now() - startTime;
		const nextScrollTop = easeInOutCubic(time > duration ? duration : time, from, to, duration);
		if (isWindow(container)) container.scrollTo(window.pageXOffset, nextScrollTop);
		else container.scrollTop = nextScrollTop;
		if (time < duration) handle = rAF(scroll);
		else if (isFunction$1(callback)) callback();
	};
	scroll();
	return () => {
		handle && cAF(handle);
	};
}
var getScrollElement = (target, container) => {
	if (isWindow(container)) return target.ownerDocument.documentElement;
	return container;
};
var getScrollTop = (container) => {
	if (isWindow(container)) return window.scrollY;
	return container.scrollTop;
};
//#endregion
//#region node_modules/element-plus/es/hooks/use-lockscreen/index.mjs
/**
* Hook that monitoring the ref value to lock or unlock the screen.
* When the trigger became true, it assumes modal is now opened and vice versa.
* @param trigger {Ref<boolean>}
*/
var useLockscreen = (trigger, options = {}) => {
	if (!/* @__PURE__ */ isRef(trigger)) throwError("[useLockscreen]", "You need to pass a ref param to this function");
	const ns = options.ns || useNamespace("popup");
	const hiddenCls = computed(() => ns.bm("parent", "hidden"));
	let scrollBarWidth = 0;
	let withoutHiddenClass = false;
	let bodyWidth = "0";
	let cleaned = false;
	const cleanup = () => {
		if (cleaned) return;
		cleaned = true;
		setTimeout(() => {
			if (typeof document === "undefined") return;
			if (withoutHiddenClass && document) {
				document.body.style.width = bodyWidth;
				removeClass(document.body, hiddenCls.value);
			}
		}, 200);
	};
	watch(trigger, (val) => {
		if (!val) {
			cleanup();
			return;
		}
		cleaned = false;
		withoutHiddenClass = !hasClass(document.body, hiddenCls.value);
		if (withoutHiddenClass) {
			bodyWidth = document.body.style.width;
			addClass(document.body, hiddenCls.value);
		}
		scrollBarWidth = getScrollBarWidth(ns.namespace.value);
		const bodyHasOverflow = document.documentElement.clientHeight < document.body.scrollHeight;
		const bodyOverflowY = getStyle(document.body, "overflowY");
		if (scrollBarWidth > 0 && (bodyHasOverflow || bodyOverflowY === "scroll") && withoutHiddenClass) document.body.style.width = `calc(100% - ${scrollBarWidth}px)`;
	});
	onScopeDispose(() => cleanup());
};
//#endregion
//#region node_modules/element-plus/es/utils/dom/event.mjs
var composeEventHandlers = (theirsHandler, oursHandler, { checkForDefaultPrevented = true } = {}) => {
	const handleEvent = (event) => {
		const shouldPrevent = theirsHandler?.(event);
		if (checkForDefaultPrevented === false || !shouldPrevent) return oursHandler?.(event);
	};
	return handleEvent;
};
var whenMouse = (handler) => {
	return (e) => e.pointerType === "mouse" ? handler(e) : void 0;
};
var getEventCode = (event) => {
	if (event.code && event.code !== "Unidentified") return event.code;
	const key = getEventKey(event);
	if (key) {
		if (Object.values(EVENT_CODE).includes(key)) return key;
		switch (key) {
			case " ": return EVENT_CODE.space;
			default: return "";
		}
	}
	return "";
};
var getEventKey = (event) => {
	let key = event.key && event.key !== "Unidentified" ? event.key : "";
	if (!key && event.type === "keyup" && isAndroid()) {
		const target = event.target;
		key = target.value.charAt(target.selectionStart - 1);
	}
	return key;
};
//#endregion
//#region node_modules/element-plus/es/hooks/use-model-toggle/index.mjs
var _prop = buildProp({
	type: definePropType(Boolean),
	default: null
});
var _event = buildProp({ type: definePropType(Function) });
var createModelToggleComposable = (name) => {
	const updateEventKey = `update:${name}`;
	const updateEventKeyRaw = `onUpdate:${name}`;
	const useModelToggleEmits = [updateEventKey];
	const useModelToggleProps = {
		[name]: _prop,
		[updateEventKeyRaw]: _event
	};
	const useModelToggle = ({ indicator, toggleReason, shouldHideWhenRouteChanges, shouldProceed, onShow, onHide }) => {
		const instance = getCurrentInstance();
		const { emit } = instance;
		const props = instance.props;
		const hasUpdateHandler = computed(() => isFunction$1(props[updateEventKeyRaw]));
		const isModelBindingAbsent = computed(() => props[name] === null);
		const doShow = (event) => {
			if (indicator.value === true) return;
			indicator.value = true;
			if (toggleReason) toggleReason.value = event;
			if (isFunction$1(onShow)) onShow(event);
		};
		const doHide = (event) => {
			if (indicator.value === false) return;
			indicator.value = false;
			if (toggleReason) toggleReason.value = event;
			if (isFunction$1(onHide)) onHide(event);
		};
		const show = (event) => {
			if (props.disabled === true || isFunction$1(shouldProceed) && !shouldProceed()) return;
			const shouldEmit = hasUpdateHandler.value && isClient;
			if (shouldEmit) emit(updateEventKey, true);
			if (isModelBindingAbsent.value || !shouldEmit) doShow(event);
		};
		const hide = (event) => {
			if (props.disabled === true || !isClient) return;
			const shouldEmit = hasUpdateHandler.value && isClient;
			if (shouldEmit) emit(updateEventKey, false);
			if (isModelBindingAbsent.value || !shouldEmit) doHide(event);
		};
		const onChange = (val) => {
			if (!isBoolean(val)) return;
			if (props.disabled && val) {
				if (hasUpdateHandler.value) emit(updateEventKey, false);
			} else if (indicator.value !== val) if (val) doShow();
			else doHide();
		};
		const toggle = () => {
			if (indicator.value) hide();
			else show();
		};
		watch(() => props[name], onChange);
		if (shouldHideWhenRouteChanges && instance.appContext.config.globalProperties.$route !== void 0) watch(() => ({ ...instance.proxy.$route }), () => {
			if (shouldHideWhenRouteChanges.value && indicator.value) hide();
		});
		onMounted(() => {
			onChange(props[name]);
		});
		return {
			hide,
			show,
			toggle,
			hasUpdateHandler
		};
	};
	return {
		useModelToggle,
		useModelToggleProps,
		useModelToggleEmits
	};
};
var { useModelToggle, useModelToggleProps, useModelToggleEmits } = createModelToggleComposable("modelValue");
//#endregion
//#region node_modules/element-plus/es/hooks/use-prop/index.mjs
var useProp = (name) => {
	const vm = getCurrentInstance();
	return computed(() => (vm?.proxy?.$props)?.[name]);
};
var W = "bottom";
var T$1 = "right";
var P$1 = "left";
var me = "auto";
var Q = [
	"top",
	W,
	T$1,
	P$1
];
var Y$1 = "start";
var Ye = "clippingParents";
var je = "viewport";
var ee = "popper";
var Ge = "reference";
var De = Q.reduce(function(e, t) {
	return e.concat([t + "-" + Y$1, t + "-end"]);
}, []);
var Ee = [].concat(Q, [me]).reduce(function(e, t) {
	return e.concat([
		t,
		t + "-" + Y$1,
		t + "-end"
	]);
}, []);
var it = [
	"beforeRead",
	"read",
	"afterRead",
	"beforeMain",
	"main",
	"afterMain",
	"beforeWrite",
	"write",
	"afterWrite"
];
function V(e) {
	return e ? (e.nodeName || "").toLowerCase() : null;
}
function B(e) {
	if (e == null) return window;
	if (e.toString() !== "[object Window]") {
		var t = e.ownerDocument;
		return t && t.defaultView || window;
	}
	return e;
}
function G(e) {
	return e instanceof B(e).Element || e instanceof Element;
}
function R(e) {
	return e instanceof B(e).HTMLElement || e instanceof HTMLElement;
}
function Ae(e) {
	if (typeof ShadowRoot == "undefined") return !1;
	return e instanceof B(e).ShadowRoot || e instanceof ShadowRoot;
}
function Tt(e) {
	var t = e.state;
	Object.keys(t.elements).forEach(function(n) {
		var r = t.styles[n] || {}, o = t.attributes[n] || {}, a = t.elements[n];
		!R(a) || !V(a) || (Object.assign(a.style, r), Object.keys(o).forEach(function(c) {
			var s = o[c];
			s === !1 ? a.removeAttribute(c) : a.setAttribute(c, s === !0 ? "" : s);
		}));
	});
}
function Bt(e) {
	var t = e.state, n = {
		popper: {
			position: t.options.strategy,
			left: "0",
			top: "0",
			margin: "0"
		},
		arrow: { position: "absolute" },
		reference: {}
	};
	return Object.assign(t.elements.popper.style, n.popper), t.styles = n, t.elements.arrow && Object.assign(t.elements.arrow.style, n.arrow), function() {
		Object.keys(t.elements).forEach(function(r) {
			var o = t.elements[r], a = t.attributes[r] || {}, s = Object.keys(t.styles.hasOwnProperty(r) ? t.styles[r] : n[r]).reduce(function(i, f) {
				return i[f] = "", i;
			}, {});
			!R(o) || !V(o) || (Object.assign(o.style, s), Object.keys(a).forEach(function(i) {
				o.removeAttribute(i);
			}));
		});
	};
}
var ke = {
	name: "applyStyles",
	enabled: !0,
	phase: "write",
	fn: Tt,
	effect: Bt,
	requires: ["computeStyles"]
};
function C(e) {
	return e.split("-")[0];
}
var J = Math.max;
var ve = Math.min;
var te = Math.round;
function Le() {
	var e = navigator.userAgentData;
	return e != null && e.brands && Array.isArray(e.brands) ? e.brands.map(function(t) {
		return t.brand + "/" + t.version;
	}).join(" ") : navigator.userAgent;
}
function at() {
	return !/^((?!chrome|android).)*safari/i.test(Le());
}
function ne(e, t, n) {
	t === void 0 && (t = !1), n === void 0 && (n = !1);
	var r = e.getBoundingClientRect(), o = 1, a = 1;
	t && R(e) && (o = e.offsetWidth > 0 && te(r.width) / e.offsetWidth || 1, a = e.offsetHeight > 0 && te(r.height) / e.offsetHeight || 1);
	var s = (G(e) ? B(e) : window).visualViewport, i = !at() && n, f = (r.left + (i && s ? s.offsetLeft : 0)) / o, u = (r.top + (i && s ? s.offsetTop : 0)) / a, m = r.width / o, h = r.height / a;
	return {
		width: m,
		height: h,
		top: u,
		right: f + m,
		bottom: u + h,
		left: f,
		x: f,
		y: u
	};
}
function Pe(e) {
	var t = ne(e), n = e.offsetWidth, r = e.offsetHeight;
	return Math.abs(t.width - n) <= 1 && (n = t.width), Math.abs(t.height - r) <= 1 && (r = t.height), {
		x: e.offsetLeft,
		y: e.offsetTop,
		width: n,
		height: r
	};
}
function st(e, t) {
	var n = t.getRootNode && t.getRootNode();
	if (e.contains(t)) return !0;
	if (n && Ae(n)) {
		var r = t;
		do {
			if (r && e.isSameNode(r)) return !0;
			r = r.parentNode || r.host;
		} while (r);
	}
	return !1;
}
function I$1(e) {
	return B(e).getComputedStyle(e);
}
function Rt(e) {
	return [
		"table",
		"td",
		"th"
	].indexOf(V(e)) >= 0;
}
function N$1(e) {
	return ((G(e) ? e.ownerDocument : e.document) || window.document).documentElement;
}
function ye(e) {
	return V(e) === "html" ? e : e.assignedSlot || e.parentNode || (Ae(e) ? e.host : null) || N$1(e);
}
function ft(e) {
	return !R(e) || I$1(e).position === "fixed" ? null : e.offsetParent;
}
function Ht(e) {
	var t = /firefox/i.test(Le());
	if (/Trident/i.test(Le()) && R(e)) {
		if (I$1(e).position === "fixed") return null;
	}
	var o = ye(e);
	for (Ae(o) && (o = o.host); R(o) && ["html", "body"].indexOf(V(o)) < 0;) {
		var a = I$1(o);
		if (a.transform !== "none" || a.perspective !== "none" || a.contain === "paint" || ["transform", "perspective"].indexOf(a.willChange) !== -1 || t && a.willChange === "filter" || t && a.filter && a.filter !== "none") return o;
		o = o.parentNode;
	}
	return null;
}
function se(e) {
	for (var t = B(e), n = ft(e); n && Rt(n) && I$1(n).position === "static";) n = ft(n);
	return n && (V(n) === "html" || V(n) === "body" && I$1(n).position === "static") ? t : n || Ht(e) || t;
}
function Me(e) {
	return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y";
}
function fe(e, t, n) {
	return J(e, ve(t, n));
}
function St(e, t, n) {
	var r = fe(e, t, n);
	return r > n ? n : r;
}
function ct() {
	return {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	};
}
function ut(e) {
	return Object.assign({}, ct(), e);
}
function pt(e, t) {
	return t.reduce(function(n, r) {
		return n[r] = e, n;
	}, {});
}
var Vt = function(e, t) {
	return e = typeof e == "function" ? e(Object.assign({}, t.rects, { placement: t.placement })) : e, ut(typeof e != "number" ? e : pt(e, Q));
};
function Ct(e) {
	var t, n = e.state, r = e.name, o = e.options, a = n.elements.arrow, c = n.modifiersData.popperOffsets, s = C(n.placement), i = Me(s), u = ["left", "right"].indexOf(s) >= 0 ? "height" : "width";
	if (!(!a || !c)) {
		var m = Vt(o.padding, n), h = Pe(a), l = i === "y" ? "top" : P$1, g = i === "y" ? W : T$1, p = n.rects.reference[u] + n.rects.reference[i] - c[i] - n.rects.popper[u], y = c[i] - n.rects.reference[i], b = se(a), x = b ? i === "y" ? b.clientHeight || 0 : b.clientWidth || 0 : 0, O = p / 2 - y / 2, d = m[l], v = x - h[u] - m[g], w = x / 2 - h[u] / 2 + O, $ = fe(d, w, v), j = i;
		n.modifiersData[r] = (t = {}, t[j] = $, t.centerOffset = $ - w, t);
	}
}
function qt(e) {
	var t = e.state, r = e.options.element, o = r === void 0 ? "[data-popper-arrow]" : r;
	o != null && (typeof o == "string" && (o = t.elements.popper.querySelector(o), !o) || st(t.elements.popper, o) && (t.elements.arrow = o));
}
var lt = {
	name: "arrow",
	enabled: !0,
	phase: "main",
	fn: Ct,
	effect: qt,
	requires: ["popperOffsets"],
	requiresIfExists: ["preventOverflow"]
};
function re(e) {
	return e.split("-")[1];
}
var It = {
	top: "auto",
	right: "auto",
	bottom: "auto",
	left: "auto"
};
function Nt(e, t) {
	var n = e.x, r = e.y, o = t.devicePixelRatio || 1;
	return {
		x: te(n * o) / o || 0,
		y: te(r * o) / o || 0
	};
}
function dt(e) {
	var t, n = e.popper, r = e.popperRect, o = e.placement, a = e.variation, c = e.offsets, s = e.position, i = e.gpuAcceleration, f = e.adaptive, u = e.roundOffsets, m = e.isFixed, h = c.x, l = h === void 0 ? 0 : h, g = c.y, p = g === void 0 ? 0 : g, y = typeof u == "function" ? u({
		x: l,
		y: p
	}) : {
		x: l,
		y: p
	};
	l = y.x, p = y.y;
	var b = c.hasOwnProperty("x"), x = c.hasOwnProperty("y"), O = P$1, d = "top", v = window;
	if (f) {
		var w = se(n), $ = "clientHeight", j = "clientWidth";
		if (w === B(n) && (w = N$1(n), I$1(w).position !== "static" && s === "absolute" && ($ = "scrollHeight", j = "scrollWidth")), w = w, o === "top" || (o === "left" || o === "right") && a === "end") {
			d = W;
			var D = m && w === v && v.visualViewport ? v.visualViewport.height : w[$];
			p -= D - r.height, p *= i ? 1 : -1;
		}
		if (o === "left" || (o === "top" || o === "bottom") && a === "end") {
			O = T$1;
			var E = m && w === v && v.visualViewport ? v.visualViewport.width : w[j];
			l -= E - r.width, l *= i ? 1 : -1;
		}
	}
	var A = Object.assign({ position: s }, f && It), H = u === !0 ? Nt({
		x: l,
		y: p
	}, B(n)) : {
		x: l,
		y: p
	};
	if (l = H.x, p = H.y, i) {
		var k;
		return Object.assign({}, A, (k = {}, k[d] = x ? "0" : "", k[O] = b ? "0" : "", k.transform = (v.devicePixelRatio || 1) <= 1 ? "translate(" + l + "px, " + p + "px)" : "translate3d(" + l + "px, " + p + "px, 0)", k));
	}
	return Object.assign({}, A, (t = {}, t[d] = x ? p + "px" : "", t[O] = b ? l + "px" : "", t.transform = "", t));
}
function Ft(e) {
	var t = e.state, n = e.options, r = n.gpuAcceleration, o = r === void 0 ? !0 : r, a = n.adaptive, c = a === void 0 ? !0 : a, s = n.roundOffsets, i = s === void 0 ? !0 : s, f = {
		placement: C(t.placement),
		variation: re(t.placement),
		popper: t.elements.popper,
		popperRect: t.rects.popper,
		gpuAcceleration: o,
		isFixed: t.options.strategy === "fixed"
	};
	t.modifiersData.popperOffsets != null && (t.styles.popper = Object.assign({}, t.styles.popper, dt(Object.assign({}, f, {
		offsets: t.modifiersData.popperOffsets,
		position: t.options.strategy,
		adaptive: c,
		roundOffsets: i
	})))), t.modifiersData.arrow != null && (t.styles.arrow = Object.assign({}, t.styles.arrow, dt(Object.assign({}, f, {
		offsets: t.modifiersData.arrow,
		position: "absolute",
		adaptive: !1,
		roundOffsets: i
	})))), t.attributes.popper = Object.assign({}, t.attributes.popper, { "data-popper-placement": t.placement });
}
var We = {
	name: "computeStyles",
	enabled: !0,
	phase: "beforeWrite",
	fn: Ft,
	data: {}
};
var ge = { passive: !0 };
function Ut(e) {
	var t = e.state, n = e.instance, r = e.options, o = r.scroll, a = o === void 0 ? !0 : o, c = r.resize, s = c === void 0 ? !0 : c, i = B(t.elements.popper), f = [].concat(t.scrollParents.reference, t.scrollParents.popper);
	return a && f.forEach(function(u) {
		u.addEventListener("scroll", n.update, ge);
	}), s && i.addEventListener("resize", n.update, ge), function() {
		a && f.forEach(function(u) {
			u.removeEventListener("scroll", n.update, ge);
		}), s && i.removeEventListener("resize", n.update, ge);
	};
}
var Te = {
	name: "eventListeners",
	enabled: !0,
	phase: "write",
	fn: function() {},
	effect: Ut,
	data: {}
};
var _t = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function be(e) {
	return e.replace(/left|right|bottom|top/g, function(t) {
		return _t[t];
	});
}
var zt = {
	start: "end",
	end: "start"
};
function ht(e) {
	return e.replace(/start|end/g, function(t) {
		return zt[t];
	});
}
function Be(e) {
	var t = B(e);
	return {
		scrollLeft: t.pageXOffset,
		scrollTop: t.pageYOffset
	};
}
function Re(e) {
	return ne(N$1(e)).left + Be(e).scrollLeft;
}
function Xt(e, t) {
	var n = B(e), r = N$1(e), o = n.visualViewport, a = r.clientWidth, c = r.clientHeight, s = 0, i = 0;
	if (o) {
		a = o.width, c = o.height;
		var f = at();
		(f || !f && t === "fixed") && (s = o.offsetLeft, i = o.offsetTop);
	}
	return {
		width: a,
		height: c,
		x: s + Re(e),
		y: i
	};
}
function Yt(e) {
	var t, n = N$1(e), r = Be(e), o = (t = e.ownerDocument) == null ? void 0 : t.body, a = J(n.scrollWidth, n.clientWidth, o ? o.scrollWidth : 0, o ? o.clientWidth : 0), c = J(n.scrollHeight, n.clientHeight, o ? o.scrollHeight : 0, o ? o.clientHeight : 0), s = -r.scrollLeft + Re(e), i = -r.scrollTop;
	return I$1(o || n).direction === "rtl" && (s += J(n.clientWidth, o ? o.clientWidth : 0) - a), {
		width: a,
		height: c,
		x: s,
		y: i
	};
}
function He(e) {
	var t = I$1(e), n = t.overflow, r = t.overflowX, o = t.overflowY;
	return /auto|scroll|overlay|hidden/.test(n + o + r);
}
function mt(e) {
	return [
		"html",
		"body",
		"#document"
	].indexOf(V(e)) >= 0 ? e.ownerDocument.body : R(e) && He(e) ? e : mt(ye(e));
}
function ce(e, t) {
	var n;
	t === void 0 && (t = []);
	var r = mt(e), o = r === ((n = e.ownerDocument) == null ? void 0 : n.body), a = B(r), c = o ? [a].concat(a.visualViewport || [], He(r) ? r : []) : r, s = t.concat(c);
	return o ? s : s.concat(ce(ye(c)));
}
function Se(e) {
	return Object.assign({}, e, {
		left: e.x,
		top: e.y,
		right: e.x + e.width,
		bottom: e.y + e.height
	});
}
function Gt(e, t) {
	var n = ne(e, !1, t === "fixed");
	return n.top = n.top + e.clientTop, n.left = n.left + e.clientLeft, n.bottom = n.top + e.clientHeight, n.right = n.left + e.clientWidth, n.width = e.clientWidth, n.height = e.clientHeight, n.x = n.left, n.y = n.top, n;
}
function vt(e, t, n) {
	return t === "viewport" ? Se(Xt(e, n)) : G(t) ? Gt(t, n) : Se(Yt(N$1(e)));
}
function Jt(e) {
	var t = ce(ye(e)), r = ["absolute", "fixed"].indexOf(I$1(e).position) >= 0 && R(e) ? se(e) : e;
	return G(r) ? t.filter(function(o) {
		return G(o) && st(o, r) && V(o) !== "body";
	}) : [];
}
function Kt(e, t, n, r) {
	var o = t === "clippingParents" ? Jt(e) : [].concat(t), a = [].concat(o, [n]), c = a[0], s = a.reduce(function(i, f) {
		var u = vt(e, f, r);
		return i.top = J(u.top, i.top), i.right = ve(u.right, i.right), i.bottom = ve(u.bottom, i.bottom), i.left = J(u.left, i.left), i;
	}, vt(e, c, r));
	return s.width = s.right - s.left, s.height = s.bottom - s.top, s.x = s.left, s.y = s.top, s;
}
function yt(e) {
	var t = e.reference, n = e.element, r = e.placement, o = r ? C(r) : null, a = r ? re(r) : null, c = t.x + t.width / 2 - n.width / 2, s = t.y + t.height / 2 - n.height / 2, i;
	switch (o) {
		case "top":
			i = {
				x: c,
				y: t.y - n.height
			};
			break;
		case W:
			i = {
				x: c,
				y: t.y + t.height
			};
			break;
		case T$1:
			i = {
				x: t.x + t.width,
				y: s
			};
			break;
		case P$1:
			i = {
				x: t.x - n.width,
				y: s
			};
			break;
		default: i = {
			x: t.x,
			y: t.y
		};
	}
	var f = o ? Me(o) : null;
	if (f != null) {
		var u = f === "y" ? "height" : "width";
		switch (a) {
			case Y$1:
				i[f] = i[f] - (t[u] / 2 - n[u] / 2);
				break;
			case "end":
				i[f] = i[f] + (t[u] / 2 - n[u] / 2);
				break;
		}
	}
	return i;
}
function oe(e, t) {
	t === void 0 && (t = {});
	var n = t, r = n.placement, o = r === void 0 ? e.placement : r, a = n.strategy, c = a === void 0 ? e.strategy : a, s = n.boundary, i = s === void 0 ? Ye : s, f = n.rootBoundary, u = f === void 0 ? je : f, m = n.elementContext, h = m === void 0 ? ee : m, l = n.altBoundary, g = l === void 0 ? !1 : l, p = n.padding, y = p === void 0 ? 0 : p, b = ut(typeof y != "number" ? y : pt(y, Q)), x = h === "popper" ? Ge : ee, O = e.rects.popper, d = e.elements[g ? x : h], v = Kt(G(d) ? d : d.contextElement || N$1(e.elements.popper), i, u, c), w = ne(e.elements.reference), $ = yt({
		reference: w,
		element: O,
		placement: o
	}), j = Se(Object.assign({}, O, $)), D = h === "popper" ? j : w, E = {
		top: v.top - D.top + b.top,
		bottom: D.bottom - v.bottom + b.bottom,
		left: v.left - D.left + b.left,
		right: D.right - v.right + b.right
	}, A = e.modifiersData.offset;
	if (h === "popper" && A) {
		var H = A[o];
		Object.keys(E).forEach(function(k) {
			var F = ["right", "bottom"].indexOf(k) >= 0 ? 1 : -1, U = ["top", "bottom"].indexOf(k) >= 0 ? "y" : "x";
			E[k] += H[U] * F;
		});
	}
	return E;
}
function Qt(e, t) {
	t === void 0 && (t = {});
	var n = t, r = n.placement, o = n.boundary, a = n.rootBoundary, c = n.padding, s = n.flipVariations, i = n.allowedAutoPlacements, f = i === void 0 ? Ee : i, u = re(r), m = u ? s ? De : De.filter(function(g) {
		return re(g) === u;
	}) : Q, h = m.filter(function(g) {
		return f.indexOf(g) >= 0;
	});
	h.length === 0 && (h = m);
	var l = h.reduce(function(g, p) {
		return g[p] = oe(e, {
			placement: p,
			boundary: o,
			rootBoundary: a,
			padding: c
		})[C(p)], g;
	}, {});
	return Object.keys(l).sort(function(g, p) {
		return l[g] - l[p];
	});
}
function Zt(e) {
	if (C(e) === "auto") return [];
	var t = be(e);
	return [
		ht(e),
		t,
		ht(t)
	];
}
function en(e) {
	var t = e.state, n = e.options, r = e.name;
	if (!t.modifiersData[r]._skip) {
		for (var o = n.mainAxis, a = o === void 0 ? !0 : o, c = n.altAxis, s = c === void 0 ? !0 : c, i = n.fallbackPlacements, f = n.padding, u = n.boundary, m = n.rootBoundary, h = n.altBoundary, l = n.flipVariations, g = l === void 0 ? !0 : l, p = n.allowedAutoPlacements, y = t.options.placement, x = C(y) === y, O = i || (x || !g ? [be(y)] : Zt(y)), d = [y].concat(O).reduce(function(z, q) {
			return z.concat(C(q) === "auto" ? Qt(t, {
				placement: q,
				boundary: u,
				rootBoundary: m,
				padding: f,
				flipVariations: g,
				allowedAutoPlacements: p
			}) : q);
		}, []), v = t.rects.reference, w = t.rects.popper, $ = /* @__PURE__ */ new Map(), j = !0, D = d[0], E = 0; E < d.length; E++) {
			var A = d[E], H = C(A), k = re(A) === Y$1, F = ["top", W].indexOf(H) >= 0, U = F ? "width" : "height", M = oe(t, {
				placement: A,
				boundary: u,
				rootBoundary: m,
				altBoundary: h,
				padding: f
			}), S = F ? k ? T$1 : P$1 : k ? W : "top";
			v[U] > w[U] && (S = be(S));
			var ue = be(S), _ = [];
			if (a && _.push(M[H] <= 0), s && _.push(M[S] <= 0, M[ue] <= 0), _.every(function(z) {
				return z;
			})) {
				D = A, j = !1;
				break;
			}
			$.set(A, _);
		}
		if (j) {
			for (var pe = g ? 3 : 1, xe = function(z) {
				var q = d.find(function(de) {
					var ae = $.get(de);
					if (ae) return ae.slice(0, z).every(function(K) {
						return K;
					});
				});
				if (q) return D = q, "break";
			}, ie = pe; ie > 0; ie--) if (xe(ie) === "break") break;
		}
		t.placement !== D && (t.modifiersData[r]._skip = !0, t.placement = D, t.reset = !0);
	}
}
var gt = {
	name: "flip",
	enabled: !0,
	phase: "main",
	fn: en,
	requiresIfExists: ["offset"],
	data: { _skip: !1 }
};
function bt(e, t, n) {
	return n === void 0 && (n = {
		x: 0,
		y: 0
	}), {
		top: e.top - t.height - n.y,
		right: e.right - t.width + n.x,
		bottom: e.bottom - t.height + n.y,
		left: e.left - t.width - n.x
	};
}
function wt(e) {
	return [
		"top",
		T$1,
		W,
		P$1
	].some(function(t) {
		return e[t] >= 0;
	});
}
function tn(e) {
	var t = e.state, n = e.name, r = t.rects.reference, o = t.rects.popper, a = t.modifiersData.preventOverflow, c = oe(t, { elementContext: "reference" }), s = oe(t, { altBoundary: !0 }), i = bt(c, r), f = bt(s, o, a), u = wt(i), m = wt(f);
	t.modifiersData[n] = {
		referenceClippingOffsets: i,
		popperEscapeOffsets: f,
		isReferenceHidden: u,
		hasPopperEscaped: m
	}, t.attributes.popper = Object.assign({}, t.attributes.popper, {
		"data-popper-reference-hidden": u,
		"data-popper-escaped": m
	});
}
var xt = {
	name: "hide",
	enabled: !0,
	phase: "main",
	requiresIfExists: ["preventOverflow"],
	fn: tn
};
function nn(e, t, n) {
	var r = C(e), o = ["left", "top"].indexOf(r) >= 0 ? -1 : 1, a = typeof n == "function" ? n(Object.assign({}, t, { placement: e })) : n, c = a[0], s = a[1];
	return c = c || 0, s = (s || 0) * o, ["left", "right"].indexOf(r) >= 0 ? {
		x: s,
		y: c
	} : {
		x: c,
		y: s
	};
}
function rn(e) {
	var t = e.state, n = e.options, r = e.name, o = n.offset, a = o === void 0 ? [0, 0] : o, c = Ee.reduce(function(u, m) {
		return u[m] = nn(m, t.rects, a), u;
	}, {}), s = c[t.placement], i = s.x, f = s.y;
	t.modifiersData.popperOffsets != null && (t.modifiersData.popperOffsets.x += i, t.modifiersData.popperOffsets.y += f), t.modifiersData[r] = c;
}
var Ot = {
	name: "offset",
	enabled: !0,
	phase: "main",
	requires: ["popperOffsets"],
	fn: rn
};
function on(e) {
	var t = e.state, n = e.name;
	t.modifiersData[n] = yt({
		reference: t.rects.reference,
		element: t.rects.popper,
		placement: t.placement
	});
}
var Ve = {
	name: "popperOffsets",
	enabled: !0,
	phase: "read",
	fn: on,
	data: {}
};
function an(e) {
	return e === "x" ? "y" : "x";
}
function sn(e) {
	var t = e.state, n = e.options, r = e.name, o = n.mainAxis, a = o === void 0 ? !0 : o, c = n.altAxis, s = c === void 0 ? !1 : c, i = n.boundary, f = n.rootBoundary, u = n.altBoundary, m = n.padding, h = n.tether, l = h === void 0 ? !0 : h, g = n.tetherOffset, p = g === void 0 ? 0 : g, y = oe(t, {
		boundary: i,
		rootBoundary: f,
		padding: m,
		altBoundary: u
	}), b = C(t.placement), x = re(t.placement), O = !x, d = Me(b), v = an(d), w = t.modifiersData.popperOffsets, $ = t.rects.reference, j = t.rects.popper, D = typeof p == "function" ? p(Object.assign({}, t.rects, { placement: t.placement })) : p, E = typeof D == "number" ? {
		mainAxis: D,
		altAxis: D
	} : Object.assign({
		mainAxis: 0,
		altAxis: 0
	}, D), A = t.modifiersData.offset ? t.modifiersData.offset[t.placement] : null, H = {
		x: 0,
		y: 0
	};
	if (w) {
		if (a) {
			var k, F = d === "y" ? "top" : P$1, U = d === "y" ? W : T$1, M = d === "y" ? "height" : "width", S = w[d], ue = S + y[F], _ = S - y[U], pe = l ? -j[M] / 2 : 0, xe = x === "start" ? $[M] : j[M], ie = x === "start" ? -j[M] : -$[M], le = t.elements.arrow, z = l && le ? Pe(le) : {
				width: 0,
				height: 0
			}, q = t.modifiersData["arrow#persistent"] ? t.modifiersData["arrow#persistent"].padding : ct(), de = q[F], ae = q[U], K = fe(0, $[M], z[M]), Et = O ? $[M] / 2 - pe - K - de - E.mainAxis : xe - K - de - E.mainAxis, At = O ? -$[M] / 2 + pe + K + ae + E.mainAxis : ie + K + ae + E.mainAxis, Oe = t.elements.arrow && se(t.elements.arrow), kt = Oe ? d === "y" ? Oe.clientTop || 0 : Oe.clientLeft || 0 : 0, Ce = (k = A == null ? void 0 : A[d]) != null ? k : 0, Lt = S + Et - Ce - kt, Pt = S + At - Ce, qe = fe(l ? ve(ue, Lt) : ue, S, l ? J(_, Pt) : _);
			w[d] = qe, H[d] = qe - S;
		}
		if (s) {
			var Ie, Mt = d === "x" ? "top" : P$1, Wt = d === "x" ? W : T$1, X = w[v], he = v === "y" ? "height" : "width", Ne = X + y[Mt], Fe = X - y[Wt], $e = ["top", P$1].indexOf(b) !== -1, Ue = (Ie = A == null ? void 0 : A[v]) != null ? Ie : 0, _e = $e ? Ne : X - $[he] - j[he] - Ue + E.altAxis, ze = $e ? X + $[he] + j[he] - Ue - E.altAxis : Fe, Xe = l && $e ? St(_e, X, ze) : fe(l ? _e : Ne, X, l ? ze : Fe);
			w[v] = Xe, H[v] = Xe - X;
		}
		t.modifiersData[r] = H;
	}
}
var $t = {
	name: "preventOverflow",
	enabled: !0,
	phase: "main",
	fn: sn,
	requiresIfExists: ["offset"]
};
function fn(e) {
	return {
		scrollLeft: e.scrollLeft,
		scrollTop: e.scrollTop
	};
}
function cn(e) {
	return e === B(e) || !R(e) ? Be(e) : fn(e);
}
function un(e) {
	var t = e.getBoundingClientRect(), n = te(t.width) / e.offsetWidth || 1, r = te(t.height) / e.offsetHeight || 1;
	return n !== 1 || r !== 1;
}
function pn(e, t, n) {
	n === void 0 && (n = !1);
	var r = R(t), o = R(t) && un(t), a = N$1(t), c = ne(e, o, n), s = {
		scrollLeft: 0,
		scrollTop: 0
	}, i = {
		x: 0,
		y: 0
	};
	return (r || !r && !n) && ((V(t) !== "body" || He(a)) && (s = cn(t)), R(t) ? (i = ne(t, !0), i.x += t.clientLeft, i.y += t.clientTop) : a && (i.x = Re(a))), {
		x: c.left + s.scrollLeft - i.x,
		y: c.top + s.scrollTop - i.y,
		width: c.width,
		height: c.height
	};
}
function ln(e) {
	var t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set(), r = [];
	e.forEach(function(a) {
		t.set(a.name, a);
	});
	function o(a) {
		n.add(a.name);
		[].concat(a.requires || [], a.requiresIfExists || []).forEach(function(s) {
			if (!n.has(s)) {
				var i = t.get(s);
				i && o(i);
			}
		}), r.push(a);
	}
	return e.forEach(function(a) {
		n.has(a.name) || o(a);
	}), r;
}
function dn(e) {
	var t = ln(e);
	return it.reduce(function(n, r) {
		return n.concat(t.filter(function(o) {
			return o.phase === r;
		}));
	}, []);
}
function hn(e) {
	var t;
	return function() {
		return t || (t = new Promise(function(n) {
			Promise.resolve().then(function() {
				t = void 0, n(e());
			});
		})), t;
	};
}
function mn(e) {
	var t = e.reduce(function(n, r) {
		var o = n[r.name];
		return n[r.name] = o ? Object.assign({}, o, r, {
			options: Object.assign({}, o.options, r.options),
			data: Object.assign({}, o.data, r.data)
		}) : r, n;
	}, {});
	return Object.keys(t).map(function(n) {
		return t[n];
	});
}
var jt = {
	placement: "bottom",
	modifiers: [],
	strategy: "absolute"
};
function Dt() {
	for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
	return !t.some(function(r) {
		return !(r && typeof r.getBoundingClientRect == "function");
	});
}
function we(e) {
	e === void 0 && (e = {});
	var t = e, n = t.defaultModifiers, r = n === void 0 ? [] : n, o = t.defaultOptions, a = o === void 0 ? jt : o;
	return function(c, s, i) {
		i === void 0 && (i = a);
		var f = {
			placement: "bottom",
			orderedModifiers: [],
			options: Object.assign({}, jt, a),
			modifiersData: {},
			elements: {
				reference: c,
				popper: s
			},
			attributes: {},
			styles: {}
		}, u = [], m = !1, h = {
			state: f,
			setOptions: function(p) {
				var y = typeof p == "function" ? p(f.options) : p;
				g(), f.options = Object.assign({}, a, f.options, y), f.scrollParents = {
					reference: G(c) ? ce(c) : c.contextElement ? ce(c.contextElement) : [],
					popper: ce(s)
				};
				var b = dn(mn([].concat(r, f.options.modifiers)));
				return f.orderedModifiers = b.filter(function(x) {
					return x.enabled;
				}), l(), h.update();
			},
			forceUpdate: function() {
				if (!m) {
					var p = f.elements, y = p.reference, b = p.popper;
					if (Dt(y, b)) {
						f.rects = {
							reference: pn(y, se(b), f.options.strategy === "fixed"),
							popper: Pe(b)
						}, f.reset = !1, f.placement = f.options.placement, f.orderedModifiers.forEach(function(j) {
							return f.modifiersData[j.name] = Object.assign({}, j.data);
						});
						for (var x = 0; x < f.orderedModifiers.length; x++) {
							if (f.reset === !0) {
								f.reset = !1, x = -1;
								continue;
							}
							var O = f.orderedModifiers[x], d = O.fn, v = O.options, w = v === void 0 ? {} : v, $ = O.name;
							typeof d == "function" && (f = d({
								state: f,
								options: w,
								name: $,
								instance: h
							}) || f);
						}
					}
				}
			},
			update: hn(function() {
				return new Promise(function(p) {
					h.forceUpdate(), p(f);
				});
			}),
			destroy: function() {
				g(), m = !0;
			}
		};
		if (!Dt(c, s)) return h;
		h.setOptions(i).then(function(p) {
			!m && i.onFirstUpdate && i.onFirstUpdate(p);
		});
		function l() {
			f.orderedModifiers.forEach(function(p) {
				var y = p.name, b = p.options, x = b === void 0 ? {} : b, O = p.effect;
				if (typeof O == "function") {
					var d = O({
						state: f,
						name: y,
						instance: h,
						options: x
					}), v = function() {};
					u.push(d || v);
				}
			});
		}
		function g() {
			u.forEach(function(p) {
				return p();
			}), u = [];
		}
		return h;
	};
}
we();
we({ defaultModifiers: [
	Te,
	Ve,
	We,
	ke
] });
var wn = we({ defaultModifiers: [
	Te,
	Ve,
	We,
	ke,
	Ot,
	gt,
	$t,
	lt,
	xt
] });
//#endregion
//#region node_modules/element-plus/es/hooks/use-popper/index.mjs
var usePopper = (referenceElementRef, popperElementRef, opts = {}) => {
	const stateUpdater = {
		name: "updateState",
		enabled: true,
		phase: "write",
		fn: ({ state }) => {
			const derivedState = deriveState(state);
			Object.assign(states.value, derivedState);
		},
		requires: ["computeStyles"]
	};
	const options = computed(() => {
		const { onFirstUpdate, placement, strategy, modifiers } = unref(opts);
		return {
			onFirstUpdate,
			placement: placement || "bottom",
			strategy: strategy || "absolute",
			modifiers: [
				...modifiers || [],
				stateUpdater,
				{
					name: "applyStyles",
					enabled: false
				}
			]
		};
	});
	const instanceRef = /* @__PURE__ */ shallowRef();
	const states = /* @__PURE__ */ ref({
		styles: {
			popper: {
				position: unref(options).strategy,
				left: "0",
				top: "0"
			},
			arrow: { position: "absolute" }
		},
		attributes: {}
	});
	const destroy = () => {
		if (!instanceRef.value) return;
		instanceRef.value.destroy();
		instanceRef.value = void 0;
	};
	watch(options, (newOptions) => {
		const instance = unref(instanceRef);
		if (instance) instance.setOptions(newOptions);
	}, { deep: true });
	watch([referenceElementRef, popperElementRef], ([referenceElement, popperElement]) => {
		destroy();
		if (!referenceElement || !popperElement) return;
		instanceRef.value = wn(referenceElement, popperElement, unref(options));
	});
	onBeforeUnmount(() => {
		destroy();
	});
	return {
		state: computed(() => ({ ...unref(instanceRef)?.state || {} })),
		styles: computed(() => unref(states).styles),
		attributes: computed(() => unref(states).attributes),
		update: () => unref(instanceRef)?.update(),
		forceUpdate: () => unref(instanceRef)?.forceUpdate(),
		instanceRef: computed(() => unref(instanceRef))
	};
};
function deriveState(state) {
	const elements = Object.keys(state.elements);
	return {
		styles: fromPairs(elements.map((element) => [element, state.styles[element] || {}])),
		attributes: fromPairs(elements.map((element) => [element, state.attributes[element]]))
	};
}
//#endregion
//#region node_modules/element-plus/es/hooks/use-same-target/index.mjs
var useSameTarget = (handleClick) => {
	if (!handleClick) return {
		onClick: NOOP,
		onMousedown: NOOP,
		onMouseup: NOOP
	};
	let mousedownTarget = false;
	let mouseupTarget = false;
	const onClick = (e) => {
		if (mousedownTarget && mouseupTarget) handleClick(e);
		mousedownTarget = mouseupTarget = false;
	};
	const onMousedown = (e) => {
		mousedownTarget = e.target === e.currentTarget;
	};
	const onMouseup = (e) => {
		mouseupTarget = e.target === e.currentTarget;
	};
	return {
		onClick,
		onMousedown,
		onMouseup
	};
};
//#endregion
//#region node_modules/element-plus/es/hooks/use-timeout/index.mjs
function useTimeout() {
	let timeoutHandle;
	const registerTimeout = (fn, delay) => {
		cancelTimeout();
		timeoutHandle = globalThis.setTimeout(fn, delay);
	};
	const cancelTimeout = () => {
		if (timeoutHandle === void 0) return;
		globalThis.clearTimeout(timeoutHandle);
		timeoutHandle = void 0;
	};
	tryOnScopeDispose(() => cancelTimeout());
	return {
		registerTimeout,
		cancelTimeout
	};
}
//#endregion
//#region node_modules/element-plus/es/hooks/use-id/index.mjs
var defaultIdInjection = {
	prefix: Math.floor(Math.random() * 1e4),
	current: 0
};
var ID_INJECTION_KEY = Symbol("elIdInjection");
var useIdInjection = () => {
	return getCurrentInstance() ? inject(ID_INJECTION_KEY, defaultIdInjection) : defaultIdInjection;
};
var useId = (deterministicId) => {
	const idInjection = useIdInjection();
	if (!isClient && idInjection === defaultIdInjection) debugWarn("IdInjection", `Looks like you are using server rendering, you must provide a id provider to ensure the hydration process to be succeed
usage: app.provide(ID_INJECTION_KEY, {
  prefix: number,
  current: number,
})`);
	const namespace = useGetDerivedNamespace();
	return computedEager(() => unref(deterministicId) || `${namespace.value}-id-${idInjection.prefix}-${idInjection.current++}`);
};
//#endregion
//#region node_modules/element-plus/es/hooks/use-escape-keydown/index.mjs
var registeredEscapeHandlers = [];
var cachedHandler = (event) => {
	if (getEventCode(event) === EVENT_CODE.esc) registeredEscapeHandlers.forEach((registeredHandler) => registeredHandler(event));
};
var useEscapeKeydown = (handler) => {
	onMounted(() => {
		if (registeredEscapeHandlers.length === 0) document.addEventListener("keydown", cachedHandler);
		if (isClient) registeredEscapeHandlers.push(handler);
	});
	onBeforeUnmount(() => {
		registeredEscapeHandlers = registeredEscapeHandlers.filter((registeredHandler) => registeredHandler !== handler);
		if (registeredEscapeHandlers.length === 0) {
			if (isClient) document.removeEventListener("keydown", cachedHandler);
		}
	});
};
//#endregion
//#region node_modules/element-plus/es/hooks/use-popper-container/index.mjs
var usePopperContainerId = () => {
	const namespace = useGetDerivedNamespace();
	const idInjection = useIdInjection();
	const id = computed(() => {
		return `${namespace.value}-popper-container-${idInjection.prefix}`;
	});
	return {
		id,
		selector: computed(() => `#${id.value}`)
	};
};
var createContainer = (id) => {
	const container = document.createElement("div");
	container.id = id;
	document.body.appendChild(container);
	return container;
};
var usePopperContainer = () => {
	const { id, selector } = usePopperContainerId();
	onBeforeMount(() => {
		if (!isClient) return;
		if (!document.body.querySelector(selector.value)) createContainer(id.value);
	});
	return {
		id,
		selector
	};
};
//#endregion
//#region node_modules/element-plus/es/hooks/use-delayed-toggle/index.mjs
/**
* @deprecated Removed after 3.0.0, Use `UseDelayedToggleProps` instead.
*/
var useDelayedToggleProps = buildProps({
	/**
	* @description delay of appearance, in millisecond, not valid in controlled mode
	*/
	showAfter: {
		type: Number,
		default: 0
	},
	/**
	* @description delay of disappear, in millisecond, not valid in controlled mode
	*/
	hideAfter: {
		type: Number,
		default: 200
	},
	/**
	* @description disappear automatically, in millisecond, not valid in controlled mode
	*/
	autoClose: {
		type: Number,
		default: 0
	}
});
var useDelayedTogglePropsDefaults = {
	showAfter: 0,
	hideAfter: 200,
	autoClose: 0
};
var useDelayedToggle = ({ showAfter, hideAfter, autoClose, open, close }) => {
	const { registerTimeout } = useTimeout();
	const { registerTimeout: registerTimeoutForAutoClose, cancelTimeout: cancelTimeoutForAutoClose } = useTimeout();
	const onOpen = (event, delay = unref(showAfter)) => {
		registerTimeout(() => {
			open(event);
			const _autoClose = unref(autoClose);
			if (isNumber(_autoClose) && _autoClose > 0) registerTimeoutForAutoClose(() => {
				close(event);
			}, _autoClose);
		}, delay);
	};
	const onClose = (event, delay = unref(hideAfter)) => {
		cancelTimeoutForAutoClose();
		registerTimeout(() => {
			close(event);
		}, delay);
	};
	return {
		onOpen,
		onClose
	};
};
//#endregion
//#region node_modules/element-plus/es/hooks/use-forward-ref/index.mjs
var FORWARD_REF_INJECTION_KEY = Symbol("elForwardRef");
var useForwardRef = (forwardRef) => {
	const setForwardRef = ((el) => {
		forwardRef.value = el;
	});
	provide(FORWARD_REF_INJECTION_KEY, { setForwardRef });
};
var useForwardRefDirective = (setForwardRef) => {
	return {
		mounted(el) {
			setForwardRef(el);
		},
		updated(el) {
			setForwardRef(el);
		},
		unmounted() {
			setForwardRef(null);
		}
	};
};
//#endregion
//#region node_modules/element-plus/es/hooks/use-z-index/index.mjs
var initial = { current: 0 };
var zIndex = /* @__PURE__ */ ref(0);
var defaultInitialZIndex = 2e3;
var ZINDEX_INJECTION_KEY = Symbol("elZIndexContextKey");
var zIndexContextKey = Symbol("zIndexContextKey");
var useZIndex = (zIndexOverrides) => {
	const increasingInjection = getCurrentInstance() ? inject(ZINDEX_INJECTION_KEY, initial) : initial;
	const zIndexInjection = zIndexOverrides || (getCurrentInstance() ? inject(zIndexContextKey, void 0) : void 0);
	const initialZIndex = computed(() => {
		const zIndexFromInjection = unref(zIndexInjection);
		return isNumber(zIndexFromInjection) ? zIndexFromInjection : defaultInitialZIndex;
	});
	const currentZIndex = computed(() => initialZIndex.value + zIndex.value);
	const nextZIndex = () => {
		increasingInjection.current++;
		zIndex.value = increasingInjection.current;
		return currentZIndex.value;
	};
	if (!isClient && !inject(ZINDEX_INJECTION_KEY)) debugWarn("ZIndexInjection", `Looks like you are using server rendering, you must provide a z-index provider to ensure the hydration process to be succeed
usage: app.provide(ZINDEX_INJECTION_KEY, { current: 0 })`);
	return {
		initialZIndex,
		currentZIndex,
		nextZIndex
	};
};
//#endregion
//#region node_modules/element-plus/es/hooks/use-cursor/index.mjs
function useCursor(input) {
	let selectionInfo;
	function recordCursor() {
		if (input.value == void 0) return;
		const { selectionStart, selectionEnd, value } = input.value;
		if (selectionStart == null || selectionEnd == null) return;
		selectionInfo = {
			selectionStart,
			selectionEnd,
			value,
			beforeTxt: value.slice(0, Math.max(0, selectionStart)),
			afterTxt: value.slice(Math.max(0, selectionEnd))
		};
	}
	function setCursor() {
		if (input.value == void 0 || selectionInfo == void 0) return;
		const { value } = input.value;
		const { beforeTxt, afterTxt, selectionStart } = selectionInfo;
		if (beforeTxt == void 0 || afterTxt == void 0 || selectionStart == void 0) return;
		let startPos = value.length;
		if (value.endsWith(afterTxt)) startPos = value.length - afterTxt.length;
		else if (value.startsWith(beforeTxt)) startPos = beforeTxt.length;
		else {
			const beforeLastChar = beforeTxt[selectionStart - 1];
			const newIndex = value.indexOf(beforeLastChar, selectionStart - 1);
			if (newIndex !== -1) startPos = newIndex + 1;
		}
		input.value.setSelectionRange(startPos, startPos);
	}
	return [recordCursor, setCursor];
}
//#endregion
//#region node_modules/element-plus/es/utils/vue/vnode.mjs
var SCOPE$2 = "utils/vue/vnode";
function isFragment(node) {
	return isVNode(node) && node.type === Fragment;
}
function isComment(node) {
	return isVNode(node) && node.type === Comment;
}
function isValidElementNode(node) {
	return isVNode(node) && !isFragment(node) && !isComment(node);
}
var getNormalizedProps = (node) => {
	if (!isVNode(node)) {
		debugWarn(SCOPE$2, "[getNormalizedProps] must be a VNode");
		return {};
	}
	const raw = node.props || {};
	const type = (isVNode(node.type) ? node.type.props : void 0) || {};
	const props = {};
	Object.keys(type).forEach((key) => {
		if (hasOwn(type[key], "default")) props[key] = type[key].default;
	});
	Object.keys(raw).forEach((key) => {
		props[camelize$1(key)] = raw[key];
	});
	return props;
};
var flattedChildren = (children) => {
	const vNodes = isArray$1(children) ? children : [children];
	const result = [];
	vNodes.forEach((child) => {
		if (isArray$1(child)) result.push(...flattedChildren(child));
		else if (isVNode(child) && child.component?.subTree) result.push(child, ...flattedChildren(child.component.subTree));
		else if (isVNode(child) && isArray$1(child.children)) result.push(...flattedChildren(child.children));
		else if (isVNode(child) && child.shapeFlag === 2) result.push(...flattedChildren(child.type()));
		else result.push(child);
	});
	return result;
};
//#endregion
//#region node_modules/element-plus/es/hooks/use-size/index.mjs
var useSizeProp = buildProp({
	type: String,
	values: componentSizes,
	required: false
});
var SIZE_INJECTION_KEY = Symbol("size");
var useGlobalSize = () => {
	const injectedSize = inject(SIZE_INJECTION_KEY, {});
	return computed(() => {
		return unref(injectedSize.size) || "";
	});
};
//#endregion
//#region node_modules/element-plus/es/hooks/use-focus-controller/index.mjs
function useFocusController(target, { disabled, beforeFocus, afterFocus, beforeBlur, afterBlur } = {}) {
	const { emit } = getCurrentInstance();
	const wrapperRef = /* @__PURE__ */ shallowRef();
	const isFocused = /* @__PURE__ */ ref(false);
	const handleFocus = (event) => {
		const cancelFocus = isFunction$1(beforeFocus) ? beforeFocus(event) : false;
		if (unref(disabled) || isFocused.value || cancelFocus) return;
		isFocused.value = true;
		emit("focus", event);
		afterFocus?.();
	};
	const handleBlur = (event) => {
		const cancelBlur = isFunction$1(beforeBlur) ? beforeBlur(event) : false;
		if (unref(disabled) || event.relatedTarget && wrapperRef.value?.contains(event.relatedTarget) || cancelBlur) return;
		isFocused.value = false;
		emit("blur", event);
		afterBlur?.();
	};
	const handleClick = (event) => {
		if (unref(disabled) || isFocusable(event.target) || wrapperRef.value?.contains(document.activeElement) && wrapperRef.value !== document.activeElement) return;
		target.value?.focus();
	};
	watch([wrapperRef, () => unref(disabled)], ([el, disabled]) => {
		if (!el) return;
		if (disabled) el.removeAttribute("tabindex");
		else el.setAttribute("tabindex", "-1");
	});
	useEventListener(wrapperRef, "focus", handleFocus, true);
	useEventListener(wrapperRef, "blur", handleBlur, true);
	useEventListener(wrapperRef, "click", handleClick, true);
	return {
		isFocused,
		/** Avoid using wrapperRef and handleFocus/handleBlur together */
		wrapperRef,
		handleFocus,
		handleBlur
	};
}
//#endregion
//#region node_modules/element-plus/es/hooks/use-composition/index.mjs
function useComposition({ afterComposition, emit }) {
	const isComposing = /* @__PURE__ */ ref(false);
	const handleCompositionStart = (event) => {
		emit?.("compositionstart", event);
		isComposing.value = true;
	};
	const handleCompositionUpdate = (event) => {
		emit?.("compositionupdate", event);
		isComposing.value = true;
	};
	const handleCompositionEnd = (event) => {
		emit?.("compositionend", event);
		if (isComposing.value) {
			isComposing.value = false;
			nextTick(() => afterComposition(event));
		}
	};
	const handleComposition = (event) => {
		event.type === "compositionend" ? handleCompositionEnd(event) : handleCompositionUpdate(event);
	};
	return {
		isComposing,
		handleComposition,
		handleCompositionStart,
		handleCompositionUpdate,
		handleCompositionEnd
	};
}
//#endregion
//#region node_modules/element-plus/es/hooks/use-empty-values/index.mjs
var emptyValuesContextKey = Symbol("emptyValuesContextKey");
var SCOPE$1 = "use-empty-values";
var DEFAULT_EMPTY_VALUES = [
	"",
	void 0,
	null
];
/**
* @deprecated Removed after 3.0.0, Use `UseEmptyValuesProps` instead.
*/
var useEmptyValuesProps = buildProps({
	/**
	* @description empty values supported by the component
	*/
	emptyValues: Array,
	/**
	* @description return value when cleared, if you want to set `undefined`, use `() => undefined`
	*/
	valueOnClear: {
		type: definePropType([
			String,
			Number,
			Boolean,
			Function
		]),
		default: void 0,
		validator: (val) => {
			val = isFunction$1(val) ? val() : val;
			if (isArray$1(val)) return val.every((item) => !item);
			return !val;
		}
	}
});
var useEmptyValues = (props, defaultValue) => {
	const config = getCurrentInstance() ? inject(emptyValuesContextKey, /* @__PURE__ */ ref({})) : /* @__PURE__ */ ref({});
	const emptyValues = computed(() => props.emptyValues || config.value.emptyValues || DEFAULT_EMPTY_VALUES);
	const valueOnClear = computed(() => {
		if (isFunction$1(props.valueOnClear)) return props.valueOnClear();
		else if (props.valueOnClear !== void 0) return props.valueOnClear;
		else if (isFunction$1(config.value.valueOnClear)) return config.value.valueOnClear();
		else if (config.value.valueOnClear !== void 0) return config.value.valueOnClear;
		return defaultValue !== void 0 ? defaultValue : void 0;
	});
	const isEmptyValue = (value) => {
		let result = true;
		if (isArray$1(value)) result = emptyValues.value.some((emptyValue) => {
			return isEqual(value, emptyValue);
		});
		else result = emptyValues.value.includes(value);
		return result;
	};
	if (!isEmptyValue(valueOnClear.value)) debugWarn(SCOPE$1, "value-on-clear should be a value of empty-values");
	return {
		emptyValues,
		valueOnClear,
		isEmptyValue
	};
};
//#endregion
//#region node_modules/element-plus/es/hooks/use-aria/index.mjs
/**
* @deprecated Removed after 3.0.0, Use `AriaProps` instead.
*/
var ariaProps = buildProps({
	/**
	* @description native `aria-label` attribute
	*/
	ariaLabel: String,
	/**
	* @description native `aria-orientation` attribute
	*/
	ariaOrientation: {
		type: String,
		values: [
			"horizontal",
			"vertical",
			"undefined"
		]
	},
	/**
	* @description native `aria-controls` attribute
	*/
	ariaControls: String
});
var useAriaProps = (arias) => {
	return pick(ariaProps, arias);
};
//#endregion
//#region node_modules/element-plus/es/utils/vue/install.mjs
var withPropsDefaultsSetter = (target) => {
	const _p = target.props;
	const props = isArray$1(_p) ? fromPairs(_p.map((key) => [key, {}])) : _p;
	target.setPropsDefaults = (defaults) => {
		if (!props) return;
		for (const [key, value] of Object.entries(defaults)) {
			const prop = props[key];
			if (!hasOwn(props, key)) continue;
			if (isPlainObject(prop)) {
				props[key] = {
					...prop,
					default: value
				};
				continue;
			}
			props[key] = {
				type: prop,
				default: value
			};
		}
		target.props = props;
	};
};
var withInstall = (main, extra) => {
	main.install = (app) => {
		for (const comp of [main, ...Object.values(extra ?? {})]) app.component(comp.name, comp);
	};
	if (extra) for (const [key, comp] of Object.entries(extra)) main[key] = comp;
	withPropsDefaultsSetter(main);
	return main;
};
var withInstallFunction = (fn, name) => {
	fn.install = (app) => {
		fn._context = app._context;
		app.config.globalProperties[name] = fn;
	};
	return fn;
};
var withInstallDirective = (directive, name) => {
	directive.install = (app) => {
		app.directive(name, directive);
	};
	return directive;
};
var withNoopInstall = (component) => {
	component.install = NOOP;
	withPropsDefaultsSetter(component);
	return component;
};
//#endregion
//#region node_modules/@element-plus/icons-vue/dist/index.js
/*! Element Plus Icons Vue v2.3.2 */
var arrow_down_default = /* @__PURE__ */ defineComponent({
	name: "ArrowDown",
	__name: "arrow-down",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M831.872 340.864 512 652.672 192.128 340.864a30.59 30.59 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.712a29.12 29.12 0 0 0 0-41.728 30.59 30.59 0 0 0-42.752 0z"
		})]));
	}
});
var arrow_left_default = /* @__PURE__ */ defineComponent({
	name: "ArrowLeft",
	__name: "arrow-left",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M609.408 149.376 277.76 489.6a32 32 0 0 0 0 44.672l331.648 340.352a29.12 29.12 0 0 0 41.728 0 30.59 30.59 0 0 0 0-42.752L339.264 511.936l311.872-319.872a30.59 30.59 0 0 0 0-42.688 29.12 29.12 0 0 0-41.728 0"
		})]));
	}
});
var arrow_right_default = /* @__PURE__ */ defineComponent({
	name: "ArrowRight",
	__name: "arrow-right",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M340.864 149.312a30.59 30.59 0 0 0 0 42.752L652.736 512 340.864 831.872a30.59 30.59 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z"
		})]));
	}
});
var arrow_up_default = /* @__PURE__ */ defineComponent({
	name: "ArrowUp",
	__name: "arrow-up",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "m488.832 344.32-339.84 356.672a32 32 0 0 0 0 44.16l.384.384a29.44 29.44 0 0 0 42.688 0l320-335.872 319.872 335.872a29.44 29.44 0 0 0 42.688 0l.384-.384a32 32 0 0 0 0-44.16L535.168 344.32a32 32 0 0 0-46.336 0"
		})]));
	}
});
var back_default = /* @__PURE__ */ defineComponent({
	name: "Back",
	__name: "back",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64"
		}), createBaseVNode("path", {
			fill: "currentColor",
			d: "m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312z"
		})]));
	}
});
var box_default = /* @__PURE__ */ defineComponent({
	name: "Box",
	__name: "box",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [
			createBaseVNode("path", {
				fill: "currentColor",
				d: "M317.056 128 128 344.064V896h768V344.064L706.944 128zm-14.528-64h418.944a32 32 0 0 1 24.064 10.88l206.528 236.096A32 32 0 0 1 960 332.032V928a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V332.032a32 32 0 0 1 7.936-21.12L278.4 75.008A32 32 0 0 1 302.528 64"
			}),
			createBaseVNode("path", {
				fill: "currentColor",
				d: "M64 320h896v64H64z"
			}),
			createBaseVNode("path", {
				fill: "currentColor",
				d: "M448 327.872V640h128V327.872L526.08 128h-28.16zM448 64h128l64 256v352a32 32 0 0 1-32 32H416a32 32 0 0 1-32-32V320z"
			})
		]));
	}
});
var calendar_default = /* @__PURE__ */ defineComponent({
	name: "Calendar",
	__name: "calendar",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M128 384v512h768V192H768v32a32 32 0 1 1-64 0v-32H320v32a32 32 0 0 1-64 0v-32H128v128h768v64zm192-256h384V96a32 32 0 1 1 64 0v32h160a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h160V96a32 32 0 0 1 64 0zm-32 384h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 0 1 0 64h-64a32 32 0 0 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m192-192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64m0 192h64a32 32 0 1 1 0 64h-64a32 32 0 1 1 0-64"
		})]));
	}
});
var caret_right_default = /* @__PURE__ */ defineComponent({
	name: "CaretRight",
	__name: "caret-right",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M384 192v640l384-320.064z"
		})]));
	}
});
var caret_top_default = /* @__PURE__ */ defineComponent({
	name: "CaretTop",
	__name: "caret-top",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M512 320 192 704h639.936z"
		})]));
	}
});
var check_default = /* @__PURE__ */ defineComponent({
	name: "Check",
	__name: "check",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M406.656 706.944 195.84 496.256a32 32 0 1 0-45.248 45.248l256 256 512-512a32 32 0 0 0-45.248-45.248L406.592 706.944z"
		})]));
	}
});
var circle_check_filled_default = /* @__PURE__ */ defineComponent({
	name: "CircleCheckFilled",
	__name: "circle-check-filled",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.27 38.27 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336z"
		})]));
	}
});
var circle_check_default = /* @__PURE__ */ defineComponent({
	name: "CircleCheck",
	__name: "circle-check",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896"
		}), createBaseVNode("path", {
			fill: "currentColor",
			d: "M745.344 361.344a32 32 0 0 1 45.312 45.312l-288 288a32 32 0 0 1-45.312 0l-160-160a32 32 0 1 1 45.312-45.312L480 626.752z"
		})]));
	}
});
var circle_close_filled_default = /* @__PURE__ */ defineComponent({
	name: "CircleCloseFilled",
	__name: "circle-close-filled",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336z"
		})]));
	}
});
var circle_close_default = /* @__PURE__ */ defineComponent({
	name: "CircleClose",
	__name: "circle-close",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "m466.752 512-90.496-90.496a32 32 0 0 1 45.248-45.248L512 466.752l90.496-90.496a32 32 0 1 1 45.248 45.248L557.248 512l90.496 90.496a32 32 0 1 1-45.248 45.248L512 557.248l-90.496 90.496a32 32 0 0 1-45.248-45.248z"
		}), createBaseVNode("path", {
			fill: "currentColor",
			d: "M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896"
		})]));
	}
});
var clock_default = /* @__PURE__ */ defineComponent({
	name: "Clock",
	__name: "clock",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [
			createBaseVNode("path", {
				fill: "currentColor",
				d: "M512 896a384 384 0 1 0 0-768 384 384 0 0 0 0 768m0 64a448 448 0 1 1 0-896 448 448 0 0 1 0 896"
			}),
			createBaseVNode("path", {
				fill: "currentColor",
				d: "M480 256a32 32 0 0 1 32 32v256a32 32 0 0 1-64 0V288a32 32 0 0 1 32-32"
			}),
			createBaseVNode("path", {
				fill: "currentColor",
				d: "M480 512h256q32 0 32 32t-32 32H480q-32 0-32-32t32-32"
			})
		]));
	}
});
var close_default = /* @__PURE__ */ defineComponent({
	name: "Close",
	__name: "close",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
		})]));
	}
});
var d_arrow_left_default = /* @__PURE__ */ defineComponent({
	name: "DArrowLeft",
	__name: "d-arrow-left",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M529.408 149.376a29.12 29.12 0 0 1 41.728 0 30.59 30.59 0 0 1 0 42.688L259.264 511.936l311.872 319.936a30.59 30.59 0 0 1-.512 43.264 29.12 29.12 0 0 1-41.216-.512L197.76 534.272a32 32 0 0 1 0-44.672zm256 0a29.12 29.12 0 0 1 41.728 0 30.59 30.59 0 0 1 0 42.688L515.264 511.936l311.872 319.936a30.59 30.59 0 0 1-.512 43.264 29.12 29.12 0 0 1-41.216-.512L453.76 534.272a32 32 0 0 1 0-44.672z"
		})]));
	}
});
var d_arrow_right_default = /* @__PURE__ */ defineComponent({
	name: "DArrowRight",
	__name: "d-arrow-right",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M452.864 149.312a29.12 29.12 0 0 1 41.728.064L826.24 489.664a32 32 0 0 1 0 44.672L494.592 874.624a29.12 29.12 0 0 1-41.728 0 30.59 30.59 0 0 1 0-42.752L764.736 512 452.864 192a30.59 30.59 0 0 1 0-42.688m-256 0a29.12 29.12 0 0 1 41.728.064L570.24 489.664a32 32 0 0 1 0 44.672L238.592 874.624a29.12 29.12 0 0 1-41.728 0 30.59 30.59 0 0 1 0-42.752L508.736 512 196.864 192a30.59 30.59 0 0 1 0-42.688"
		})]));
	}
});
var delete_default = /* @__PURE__ */ defineComponent({
	name: "Delete",
	__name: "delete",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32zm448-64v-64H416v64zM224 896h576V256H224zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32m192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32"
		})]));
	}
});
var document_default = /* @__PURE__ */ defineComponent({
	name: "Document",
	__name: "document",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M832 384H576V128H192v768h640zm-26.496-64L640 154.496V320zM160 64h480l256 256v608a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32m160 448h384v64H320zm0-192h160v64H320zm0 384h384v64H320z"
		})]));
	}
});
var download_default = /* @__PURE__ */ defineComponent({
	name: "Download",
	__name: "download",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M160 832h704a32 32 0 1 1 0 64H160a32 32 0 1 1 0-64m384-253.696 236.288-236.352 45.248 45.248L508.8 704 192 387.2l45.248-45.248L480 584.704V128h64z"
		})]));
	}
});
var expand_default = /* @__PURE__ */ defineComponent({
	name: "Expand",
	__name: "expand",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M128 192h768v128H128zm0 256h512v128H128zm0 256h768v128H128zm576-352 192 160-192 128z"
		})]));
	}
});
var fold_default = /* @__PURE__ */ defineComponent({
	name: "Fold",
	__name: "fold",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M896 192H128v128h768zm0 256H384v128h512zm0 256H128v128h768zM320 384 128 512l192 128z"
		})]));
	}
});
var full_screen_default = /* @__PURE__ */ defineComponent({
	name: "FullScreen",
	__name: "full-screen",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "m160 96.064 192 .192a32 32 0 0 1 0 64l-192-.192V352a32 32 0 0 1-64 0V96h64zm0 831.872V928H96V672a32 32 0 1 1 64 0v191.936l192-.192a32 32 0 1 1 0 64zM864 96.064V96h64v256a32 32 0 1 1-64 0V160.064l-192 .192a32 32 0 1 1 0-64zm0 831.872-192-.192a32 32 0 0 1 0-64l192 .192V672a32 32 0 1 1 64 0v256h-64z"
		})]));
	}
});
var hide_default = /* @__PURE__ */ defineComponent({
	name: "Hide",
	__name: "hide",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M876.8 156.8c0-9.6-3.2-16-9.6-22.4s-12.8-9.6-22.4-9.6-16 3.2-22.4 9.6L736 220.8c-64-32-137.6-51.2-224-60.8-160 16-288 73.6-377.6 176S0 496 0 512s48 73.6 134.4 176c22.4 25.6 44.8 48 73.6 67.2l-86.4 89.6c-6.4 6.4-9.6 12.8-9.6 22.4s3.2 16 9.6 22.4 12.8 9.6 22.4 9.6 16-3.2 22.4-9.6l704-710.4c3.2-6.4 6.4-12.8 6.4-22.4m-646.4 528Q115.2 579.2 76.8 512q43.2-72 153.6-172.8C304 272 400 230.4 512 224c64 3.2 124.8 19.2 176 44.8l-54.4 54.4C598.4 300.8 560 288 512 288c-64 0-115.2 22.4-160 64s-64 96-64 160c0 48 12.8 89.6 35.2 124.8L256 707.2c-9.6-6.4-19.2-16-25.6-22.4m140.8-96Q352 555.2 352 512c0-44.8 16-83.2 48-112s67.2-48 112-48c28.8 0 54.4 6.4 73.6 19.2zM889.599 336c-12.8-16-28.8-28.8-41.6-41.6l-48 48c73.6 67.2 124.8 124.8 150.4 169.6q-43.2 72-153.6 172.8c-73.6 67.2-172.8 108.8-284.8 115.2-51.2-3.2-99.2-12.8-140.8-28.8l-48 48c57.6 22.4 118.4 38.4 188.8 44.8 160-16 288-73.6 377.6-176S1024 528 1024 512s-48.001-73.6-134.401-176"
		}), createBaseVNode("path", {
			fill: "currentColor",
			d: "M511.998 672c-12.8 0-25.6-3.2-38.4-6.4l-51.2 51.2c28.8 12.8 57.6 19.2 89.6 19.2 64 0 115.2-22.4 160-64 41.6-41.6 64-96 64-160 0-32-6.4-64-19.2-89.6l-51.2 51.2c3.2 12.8 6.4 25.6 6.4 38.4 0 44.8-16 83.2-48 112s-67.2 48-112 48"
		})]));
	}
});
var info_filled_default = /* @__PURE__ */ defineComponent({
	name: "InfoFilled",
	__name: "info-filled",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M512 64a448 448 0 1 1 0 896.064A448 448 0 0 1 512 64m67.2 275.072c33.28 0 60.288-23.104 60.288-57.344s-27.072-57.344-60.288-57.344c-33.28 0-60.16 23.104-60.16 57.344s26.88 57.344 60.16 57.344M590.912 699.2c0-6.848 2.368-24.64 1.024-34.752l-52.608 60.544c-10.88 11.456-24.512 19.392-30.912 17.28a12.99 12.99 0 0 1-8.256-14.72l87.68-276.992c7.168-35.136-12.544-67.2-54.336-71.296-44.096 0-108.992 44.736-148.48 101.504 0 6.784-1.28 23.68.064 33.792l52.544-60.608c10.88-11.328 23.552-19.328 29.952-17.152a12.8 12.8 0 0 1 7.808 16.128L388.48 728.576c-10.048 32.256 8.96 63.872 55.04 71.04 67.84 0 107.904-43.648 147.456-100.416z"
		})]));
	}
});
var list_default = /* @__PURE__ */ defineComponent({
	name: "List",
	__name: "list",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M704 192h160v736H160V192h160v64h384zM288 512h448v-64H288zm0 256h448v-64H288zm96-576V96h256v96z"
		})]));
	}
});
var loading_default = /* @__PURE__ */ defineComponent({
	name: "Loading",
	__name: "loading",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32m0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32m448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32m-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32M195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248m452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248M828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0m-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0"
		})]));
	}
});
var minus_default = /* @__PURE__ */ defineComponent({
	name: "Minus",
	__name: "minus",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M128 544h768a32 32 0 1 0 0-64H128a32 32 0 0 0 0 64"
		})]));
	}
});
var more_filled_default = /* @__PURE__ */ defineComponent({
	name: "MoreFilled",
	__name: "more-filled",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M176 416a112 112 0 1 1 0 224 112 112 0 0 1 0-224m336 0a112 112 0 1 1 0 224 112 112 0 0 1 0-224m336 0a112 112 0 1 1 0 224 112 112 0 0 1 0-224"
		})]));
	}
});
var more_default = /* @__PURE__ */ defineComponent({
	name: "More",
	__name: "more",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M176 416a112 112 0 1 0 0 224 112 112 0 0 0 0-224m0 64a48 48 0 1 1 0 96 48 48 0 0 1 0-96m336-64a112 112 0 1 1 0 224 112 112 0 0 1 0-224m0 64a48 48 0 1 0 0 96 48 48 0 0 0 0-96m336-64a112 112 0 1 1 0 224 112 112 0 0 1 0-224m0 64a48 48 0 1 0 0 96 48 48 0 0 0 0-96"
		})]));
	}
});
var notebook_default = /* @__PURE__ */ defineComponent({
	name: "Notebook",
	__name: "notebook",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M192 128v768h640V128zm-32-64h704a32 32 0 0 1 32 32v832a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32"
		}), createBaseVNode("path", {
			fill: "currentColor",
			d: "M672 128h64v768h-64zM96 192h128q32 0 32 32t-32 32H96q-32 0-32-32t32-32m0 192h128q32 0 32 32t-32 32H96q-32 0-32-32t32-32m0 192h128q32 0 32 32t-32 32H96q-32 0-32-32t32-32m0 192h128q32 0 32 32t-32 32H96q-32 0-32-32t32-32"
		})]));
	}
});
var picture_filled_default = /* @__PURE__ */ defineComponent({
	name: "PictureFilled",
	__name: "picture-filled",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M96 896a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h832a32 32 0 0 1 32 32v704a32 32 0 0 1-32 32zm315.52-228.48-68.928-68.928a32 32 0 0 0-45.248 0L128 768.064h778.688l-242.112-290.56a32 32 0 0 0-49.216 0L458.752 665.408a32 32 0 0 1-47.232 2.112M256 384a96 96 0 1 0 192.064-.064A96 96 0 0 0 256 384"
		})]));
	}
});
var plus_default = /* @__PURE__ */ defineComponent({
	name: "Plus",
	__name: "plus",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64z"
		})]));
	}
});
var question_filled_default = /* @__PURE__ */ defineComponent({
	name: "QuestionFilled",
	__name: "question-filled",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m23.744 191.488c-52.096 0-92.928 14.784-123.2 44.352-30.976 29.568-45.76 70.4-45.76 122.496h80.256c0-29.568 5.632-52.8 17.6-68.992 13.376-19.712 35.2-28.864 66.176-28.864 23.936 0 42.944 6.336 56.32 19.712 12.672 13.376 19.712 31.68 19.712 54.912 0 17.6-6.336 34.496-19.008 49.984l-8.448 9.856c-45.76 40.832-73.216 70.4-82.368 89.408-9.856 19.008-14.08 42.24-14.08 68.992v9.856h80.96v-9.856c0-16.896 3.52-31.68 10.56-45.76 6.336-12.672 15.488-24.64 28.16-35.2 33.792-29.568 54.208-48.576 60.544-55.616 16.896-22.528 26.048-51.392 26.048-86.592q0-64.416-42.24-101.376c-28.16-25.344-65.472-37.312-111.232-37.312m-12.672 406.208a54.27 54.27 0 0 0-38.72 14.784 49.4 49.4 0 0 0-15.488 38.016c0 15.488 4.928 28.16 15.488 38.016A54.85 54.85 0 0 0 523.072 768c15.488 0 28.16-4.928 38.72-14.784a51.52 51.52 0 0 0 16.192-38.72 51.97 51.97 0 0 0-15.488-38.016 55.94 55.94 0 0 0-39.424-14.784"
		})]));
	}
});
var refresh_left_default = /* @__PURE__ */ defineComponent({
	name: "RefreshLeft",
	__name: "refresh-left",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M289.088 296.704h92.992a32 32 0 0 1 0 64H232.96a32 32 0 0 1-32-32V179.712a32 32 0 0 1 64 0v50.56a384 384 0 0 1 643.84 282.88 384 384 0 0 1-383.936 384 384 384 0 0 1-384-384h64a320 320 0 1 0 640 0 320 320 0 0 0-555.712-216.448z"
		})]));
	}
});
var refresh_right_default = /* @__PURE__ */ defineComponent({
	name: "RefreshRight",
	__name: "refresh-right",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M784.512 230.272v-50.56a32 32 0 1 1 64 0v149.056a32 32 0 0 1-32 32H667.52a32 32 0 1 1 0-64h92.992A320 320 0 1 0 524.8 833.152a320 320 0 0 0 320-320h64a384 384 0 0 1-384 384 384 384 0 0 1-384-384 384 384 0 0 1 643.712-282.88"
		})]));
	}
});
var scale_to_original_default = /* @__PURE__ */ defineComponent({
	name: "ScaleToOriginal",
	__name: "scale-to-original",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M813.176 180.706a60.235 60.235 0 0 1 60.236 60.235v481.883a60.235 60.235 0 0 1-60.236 60.235H210.824a60.235 60.235 0 0 1-60.236-60.235V240.94a60.235 60.235 0 0 1 60.236-60.235h602.352zm0-60.235H210.824A120.47 120.47 0 0 0 90.353 240.94v481.883a120.47 120.47 0 0 0 120.47 120.47h602.353a120.47 120.47 0 0 0 120.471-120.47V240.94a120.47 120.47 0 0 0-120.47-120.47zm-120.47 180.705a30.12 30.12 0 0 0-30.118 30.118v301.177a30.118 30.118 0 0 0 60.236 0V331.294a30.12 30.12 0 0 0-30.118-30.118m-361.412 0a30.12 30.12 0 0 0-30.118 30.118v301.177a30.118 30.118 0 1 0 60.236 0V331.294a30.12 30.12 0 0 0-30.118-30.118M512 361.412a30.12 30.12 0 0 0-30.118 30.117v30.118a30.118 30.118 0 0 0 60.236 0V391.53A30.12 30.12 0 0 0 512 361.412M512 512a30.12 30.12 0 0 0-30.118 30.118v30.117a30.118 30.118 0 0 0 60.236 0v-30.117A30.12 30.12 0 0 0 512 512"
		})]));
	}
});
var search_default = /* @__PURE__ */ defineComponent({
	name: "Search",
	__name: "search",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704"
		})]));
	}
});
var setting_default = /* @__PURE__ */ defineComponent({
	name: "Setting",
	__name: "setting",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357 357 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a352 352 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357 357 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294 294 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293 293 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294 294 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288 288 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293 293 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a288 288 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384m0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256"
		})]));
	}
});
var sort_down_default = /* @__PURE__ */ defineComponent({
	name: "SortDown",
	__name: "sort-down",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M576 96v709.568L333.312 562.816A32 32 0 1 0 288 608l297.408 297.344A32 32 0 0 0 640 882.688V96a32 32 0 0 0-64 0"
		})]));
	}
});
var sort_up_default = /* @__PURE__ */ defineComponent({
	name: "SortUp",
	__name: "sort-up",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M384 141.248V928a32 32 0 1 0 64 0V218.56l242.688 242.688A32 32 0 1 0 736 416L438.592 118.656A32 32 0 0 0 384 141.248"
		})]));
	}
});
var star_filled_default = /* @__PURE__ */ defineComponent({
	name: "StarFilled",
	__name: "star-filled",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M313.6 924.48a70.4 70.4 0 0 1-74.152-5.365 70.4 70.4 0 0 1-27.992-68.875l37.888-220.928L88.96 472.96a70.4 70.4 0 0 1 3.788-104.225A70.4 70.4 0 0 1 128 352.896l221.76-32.256 99.2-200.96a70.4 70.4 0 0 1 100.246-28.595 70.4 70.4 0 0 1 25.962 28.595l99.2 200.96 221.824 32.256a70.4 70.4 0 0 1 39.04 120.064L774.72 629.376l37.888 220.928a70.4 70.4 0 0 1-102.144 74.24L512 820.096l-198.4 104.32z"
		})]));
	}
});
var star_default = /* @__PURE__ */ defineComponent({
	name: "Star",
	__name: "star",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "m512 747.84 228.16 119.936a6.4 6.4 0 0 0 9.28-6.72l-43.52-254.08 184.512-179.904a6.4 6.4 0 0 0-3.52-10.88l-255.104-37.12L517.76 147.904a6.4 6.4 0 0 0-11.52 0L392.192 379.072l-255.104 37.12a6.4 6.4 0 0 0-3.52 10.88L318.08 606.976l-43.584 254.08a6.4 6.4 0 0 0 9.28 6.72zM313.6 924.48a70.4 70.4 0 0 1-102.144-74.24l37.888-220.928L88.96 472.96A70.4 70.4 0 0 1 128 352.896l221.76-32.256 99.2-200.96a70.4 70.4 0 0 1 126.208 0l99.2 200.96 221.824 32.256a70.4 70.4 0 0 1 39.04 120.064L774.72 629.376l37.888 220.928a70.4 70.4 0 0 1-102.144 74.24L512 820.096l-198.4 104.32z"
		})]));
	}
});
var success_filled_default = /* @__PURE__ */ defineComponent({
	name: "SuccessFilled",
	__name: "success-filled",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.27 38.27 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336z"
		})]));
	}
});
var ticket_default = /* @__PURE__ */ defineComponent({
	name: "Ticket",
	__name: "ticket",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M640 832H64V640a128 128 0 1 0 0-256V192h576v160h64V192h256v192a128 128 0 1 0 0 256v192H704V672h-64zm0-416v192h64V416z"
		})]));
	}
});
var upload_default = /* @__PURE__ */ defineComponent({
	name: "Upload",
	__name: "upload",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M160 832h704a32 32 0 1 1 0 64H160a32 32 0 1 1 0-64m384-578.304V704h-64V247.296L237.248 490.048 192 444.8 508.8 128l316.8 316.8-45.312 45.248z"
		})]));
	}
});
var user_default = /* @__PURE__ */ defineComponent({
	name: "User",
	__name: "user",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M512 512a192 192 0 1 0 0-384 192 192 0 0 0 0 384m0 64a256 256 0 1 1 0-512 256 256 0 0 1 0 512m320 320v-96a96 96 0 0 0-96-96H288a96 96 0 0 0-96 96v96a32 32 0 1 1-64 0v-96a160 160 0 0 1 160-160h448a160 160 0 0 1 160 160v96a32 32 0 1 1-64 0"
		})]));
	}
});
var view_default = /* @__PURE__ */ defineComponent({
	name: "View",
	__name: "view",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M512 160c320 0 512 352 512 352S832 864 512 864 0 512 0 512s192-352 512-352m0 64c-225.28 0-384.128 208.064-436.8 288 52.608 79.872 211.456 288 436.8 288 225.28 0 384.128-208.064 436.8-288-52.608-79.872-211.456-288-436.8-288m0 64a224 224 0 1 1 0 448 224 224 0 0 1 0-448m0 64a160.19 160.19 0 0 0-160 160c0 88.192 71.744 160 160 160s160-71.808 160-160-71.744-160-160-160"
		})]));
	}
});
var warning_filled_default = /* @__PURE__ */ defineComponent({
	name: "WarningFilled",
	__name: "warning-filled",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 192a58.43 58.43 0 0 0-58.24 63.744l23.36 256.384a35.072 35.072 0 0 0 69.76 0l23.296-256.384A58.43 58.43 0 0 0 512 256m0 512a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4"
		})]));
	}
});
var zoom_in_default = /* @__PURE__ */ defineComponent({
	name: "ZoomIn",
	__name: "zoom-in",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704m-32-384v-96a32 32 0 0 1 64 0v96h96a32 32 0 0 1 0 64h-96v96a32 32 0 0 1-64 0v-96h-96a32 32 0 0 1 0-64z"
		})]));
	}
});
var zoom_out_default = /* @__PURE__ */ defineComponent({
	name: "ZoomOut",
	__name: "zoom-out",
	setup(__props) {
		return (_ctx, _cache) => (openBlock(), createElementBlock("svg", {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: "0 0 1024 1024"
		}, [createBaseVNode("path", {
			fill: "currentColor",
			d: "m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704M352 448h256a32 32 0 0 1 0 64H352a32 32 0 0 1 0-64"
		})]));
	}
});
//#endregion
//#region node_modules/element-plus/es/utils/vue/icon.mjs
var iconPropType = definePropType([
	String,
	Object,
	Function
]);
var CloseComponents = { Close: close_default };
var TypeComponents = {
	Close: close_default,
	SuccessFilled: success_filled_default,
	InfoFilled: info_filled_default,
	WarningFilled: warning_filled_default,
	CircleCloseFilled: circle_close_filled_default
};
var TypeComponentsMap = {
	primary: info_filled_default,
	success: success_filled_default,
	warning: warning_filled_default,
	error: circle_close_filled_default,
	info: info_filled_default
};
var ValidateComponentsMap = {
	validating: loading_default,
	success: circle_check_default,
	error: circle_close_default
};
//#endregion
//#region node_modules/element-plus/es/components/icon/index.mjs
var ElIcon = withInstall(/* @__PURE__ */ defineComponent({
	name: "ElIcon",
	inheritAttrs: false,
	__name: "icon",
	props: buildProps({
		/**
		* @description SVG icon size, size x size
		*/
		size: { type: definePropType([Number, String]) },
		/**
		* @description SVG tag's fill attribute
		*/
		color: { type: String }
	}),
	setup(__props) {
		const props = __props;
		const ns = useNamespace("icon");
		const style = computed(() => {
			const { size, color } = props;
			const fontSize = addUnit(size);
			if (!fontSize && !color) return {};
			return {
				fontSize,
				"--color": color
			};
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("i", mergeProps({
				class: unref(ns).b(),
				style: style.value
			}, _ctx.$attrs), [renderSlot(_ctx.$slots, "default")], 16);
		};
	}
}));
//#endregion
//#region node_modules/element-plus/es/components/popper/src/popper.mjs
var roleTypes = [
	"dialog",
	"grid",
	"group",
	"listbox",
	"menu",
	"navigation",
	"tooltip",
	"tree"
];
/**
* @deprecated Removed after 3.0.0, Use `PopperProps` instead.
*/
var popperProps = buildProps({ role: {
	type: String,
	values: roleTypes,
	default: "tooltip"
} });
//#endregion
//#region node_modules/element-plus/es/components/popper/src/constants.mjs
var POPPER_INJECTION_KEY = Symbol("popper");
var POPPER_CONTENT_INJECTION_KEY = Symbol("popperContent");
//#endregion
//#region node_modules/element-plus/es/components/popper/src/arrow2.mjs
var arrow_default = /* @__PURE__ */ defineComponent({
	name: "ElPopperArrow",
	inheritAttrs: false,
	__name: "arrow",
	setup(__props, { expose: __expose }) {
		const ns = useNamespace("popper");
		const { arrowRef, arrowStyle } = inject(POPPER_CONTENT_INJECTION_KEY, void 0);
		onBeforeUnmount(() => {
			arrowRef.value = void 0;
		});
		__expose({ 
		/**
		* @description Arrow element
		*/
arrowRef });
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("span", {
				ref_key: "arrowRef",
				ref: arrowRef,
				class: normalizeClass(unref(ns).e("arrow")),
				style: normalizeStyle(unref(arrowStyle)),
				"data-popper-arrow": ""
			}, null, 6);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/popper/src/trigger.mjs
/**
* @deprecated Removed after 3.0.0, Use `PopperTriggerProps` instead.
*/
var popperTriggerProps = buildProps({
	/** @description Indicates the reference element to which the popper is attached */
	virtualRef: { type: definePropType(Object) },
	/** @description Indicates whether virtual triggering is enabled */
	virtualTriggering: Boolean,
	onMouseenter: { type: definePropType(Function) },
	onMouseleave: { type: definePropType(Function) },
	onClick: { type: definePropType(Function) },
	onKeydown: { type: definePropType(Function) },
	onFocus: { type: definePropType(Function) },
	onBlur: { type: definePropType(Function) },
	onContextmenu: { type: definePropType(Function) },
	id: String,
	open: Boolean
});
//#endregion
//#region node_modules/element-plus/es/components/slot/src/only-child.mjs
var NAME = "ElOnlyChild";
var OnlyChild = /* @__PURE__ */ defineComponent({
	name: NAME,
	setup(_, { slots, attrs }) {
		const forwardRefDirective = useForwardRefDirective(inject(FORWARD_REF_INJECTION_KEY)?.setForwardRef ?? NOOP);
		return () => {
			const defaultSlot = slots.default?.(attrs);
			if (!defaultSlot) return null;
			const [firstLegitNode, length] = findFirstLegitChild(defaultSlot);
			if (!firstLegitNode) {
				debugWarn(NAME, "no valid child node found");
				return null;
			}
			if (length > 1) debugWarn(NAME, "requires exact only one valid child.");
			return withDirectives(cloneVNode(firstLegitNode, attrs), [[forwardRefDirective]]);
		};
	}
});
function findFirstLegitChild(node) {
	if (!node) return [null, 0];
	const children = node;
	const len = children.filter((c) => c.type !== Comment).length;
	for (const child of children) {
		/**
		* when user uses h(Fragment, [text]) to render plain string,
		* this switch case just cannot handle, when the value is primitives
		* we should just return the wrapped string
		*/
		if (isObject$2(child)) switch (child.type) {
			case Comment: continue;
			case Text:
			case "svg": return [wrapTextContent(child), len];
			case Fragment: return findFirstLegitChild(child.children);
			default: return [child, len];
		}
		return [wrapTextContent(child), len];
	}
	return [null, 0];
}
function wrapTextContent(s) {
	return createVNode("span", { "class": useNamespace("only-child").e("content") }, [s]);
}
//#endregion
//#region node_modules/element-plus/es/components/popper/src/trigger2.mjs
var trigger_default$1 = /* @__PURE__ */ defineComponent({
	name: "ElPopperTrigger",
	inheritAttrs: false,
	__name: "trigger",
	props: popperTriggerProps,
	setup(__props, { expose: __expose }) {
		const props = __props;
		const { role, triggerRef } = inject(POPPER_INJECTION_KEY, void 0);
		useForwardRef(triggerRef);
		const ariaControls = computed(() => {
			return ariaHaspopup.value ? props.id : void 0;
		});
		const ariaDescribedby = computed(() => {
			if (role && role.value === "tooltip") return props.open && props.id ? props.id : void 0;
		});
		const ariaHaspopup = computed(() => {
			if (role && role.value !== "tooltip") return role.value;
		});
		const ariaExpanded = computed(() => {
			return ariaHaspopup.value ? `${props.open}` : void 0;
		});
		let virtualTriggerAriaStopWatch = void 0;
		const TRIGGER_ELE_EVENTS = [
			"onMouseenter",
			"onMouseleave",
			"onClick",
			"onKeydown",
			"onFocus",
			"onBlur",
			"onContextmenu"
		];
		onMounted(() => {
			watch(() => props.virtualRef, (virtualEl) => {
				if (virtualEl) triggerRef.value = unrefElement(virtualEl);
			}, { immediate: true });
			watch(triggerRef, (el, prevEl) => {
				virtualTriggerAriaStopWatch?.();
				virtualTriggerAriaStopWatch = void 0;
				if (isElement(prevEl)) TRIGGER_ELE_EVENTS.forEach((eventName) => {
					const handler = props[eventName];
					if (handler) prevEl.removeEventListener(eventName.slice(2).toLowerCase(), handler, ["onFocus", "onBlur"].includes(eventName));
				});
				if (isElement(el)) {
					TRIGGER_ELE_EVENTS.forEach((eventName) => {
						const handler = props[eventName];
						if (handler) el.addEventListener(eventName.slice(2).toLowerCase(), handler, ["onFocus", "onBlur"].includes(eventName));
					});
					if (isFocusable(el)) virtualTriggerAriaStopWatch = watch([
						ariaControls,
						ariaDescribedby,
						ariaHaspopup,
						ariaExpanded
					], (watches) => {
						[
							"aria-controls",
							"aria-describedby",
							"aria-haspopup",
							"aria-expanded"
						].forEach((key, idx) => {
							isNil(watches[idx]) ? el.removeAttribute(key) : el.setAttribute(key, watches[idx]);
						});
					}, { immediate: true });
				}
				if (isElement(prevEl) && isFocusable(prevEl)) [
					"aria-controls",
					"aria-describedby",
					"aria-haspopup",
					"aria-expanded"
				].forEach((key) => prevEl.removeAttribute(key));
			}, { immediate: true });
		});
		onBeforeUnmount(() => {
			virtualTriggerAriaStopWatch?.();
			virtualTriggerAriaStopWatch = void 0;
			if (triggerRef.value && isElement(triggerRef.value)) {
				const el = triggerRef.value;
				TRIGGER_ELE_EVENTS.forEach((eventName) => {
					const handler = props[eventName];
					if (handler) el.removeEventListener(eventName.slice(2).toLowerCase(), handler, ["onFocus", "onBlur"].includes(eventName));
				});
				triggerRef.value = void 0;
			}
		});
		__expose({ 
		/**
		* @description trigger element
		*/
triggerRef });
		return (_ctx, _cache) => {
			return !__props.virtualTriggering ? (openBlock(), createBlock(unref(OnlyChild), mergeProps({ key: 0 }, _ctx.$attrs, {
				"aria-controls": ariaControls.value,
				"aria-describedby": ariaDescribedby.value,
				"aria-expanded": ariaExpanded.value,
				"aria-haspopup": ariaHaspopup.value
			}), {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 16, [
				"aria-controls",
				"aria-describedby",
				"aria-expanded",
				"aria-haspopup"
			])) : createCommentVNode("v-if", true);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/popper/src/arrow.mjs
/**
* @deprecated Removed after 3.0.0, Use `PopperArrowProps` instead.
*/
var popperArrowProps = buildProps({ arrowOffset: {
	type: Number,
	default: 5
} });
var popperArrowPropsDefaults = { arrowOffset: 5 };
/**
* @deprecated Removed after 3.0.0, Use `PopperContentProps` instead.
*/
var popperContentProps = buildProps({
	...buildProps({
		boundariesPadding: {
			type: Number,
			default: 0
		},
		fallbackPlacements: {
			type: definePropType(Array),
			default: void 0
		},
		gpuAcceleration: {
			type: Boolean,
			default: true
		},
		/**
		* @description offset of the Tooltip
		*/
		offset: {
			type: Number,
			default: 12
		},
		/**
		* @description position of Tooltip
		*/
		placement: {
			type: String,
			values: Ee,
			default: "bottom"
		},
		/**
		* @description [popper.js](https://popper.js.org/docs/v2/) parameters
		*/
		popperOptions: {
			type: definePropType(Object),
			default: () => ({})
		},
		strategy: {
			type: String,
			values: ["fixed", "absolute"],
			default: "absolute"
		}
	}),
	...popperArrowProps,
	id: String,
	style: {
		type: definePropType([
			String,
			Array,
			Object,
			Boolean
		]),
		default: void 0
	},
	className: { type: definePropType([
		String,
		Array,
		Object
	]) },
	effect: {
		type: definePropType(String),
		default: "dark"
	},
	visible: Boolean,
	enterable: {
		type: Boolean,
		default: true
	},
	pure: Boolean,
	focusOnShow: Boolean,
	trapping: Boolean,
	popperClass: { type: definePropType([
		String,
		Array,
		Object
	]) },
	popperStyle: {
		type: definePropType([
			String,
			Array,
			Object,
			Boolean
		]),
		default: void 0
	},
	referenceEl: { type: definePropType(Object) },
	triggerTargetEl: { type: definePropType(Object) },
	stopPopperMouseEvent: {
		type: Boolean,
		default: true
	},
	virtualTriggering: Boolean,
	zIndex: Number,
	...useAriaProps(["ariaLabel"]),
	loop: Boolean
});
var popperContentPropsDefaults = {
	boundariesPadding: 0,
	gpuAcceleration: true,
	offset: 12,
	placement: "bottom",
	popperOptions: () => ({}),
	strategy: "absolute",
	...popperArrowPropsDefaults,
	effect: "dark",
	enterable: true,
	stopPopperMouseEvent: true,
	visible: false,
	pure: false,
	focusOnShow: false,
	trapping: false,
	virtualTriggering: false,
	loop: false,
	style: void 0,
	popperStyle: void 0
};
var popperContentEmits = {
	mouseenter: (evt) => evt instanceof MouseEvent,
	mouseleave: (evt) => evt instanceof MouseEvent,
	focus: () => true,
	blur: () => true,
	close: () => true
};
//#endregion
//#region node_modules/element-plus/es/components/form/src/constants.mjs
var formContextKey = Symbol("formContextKey");
var formItemContextKey = Symbol("formItemContextKey");
//#endregion
//#region node_modules/element-plus/es/components/form/src/hooks/use-form-common-props.mjs
var useFormSize = (fallback, ignore = {}) => {
	const emptyRef = /* @__PURE__ */ ref(void 0);
	const size = ignore.prop ? emptyRef : useProp("size");
	const globalConfig = ignore.global ? emptyRef : useGlobalSize();
	const form = ignore.form ? { size: void 0 } : inject(formContextKey, void 0);
	const formItem = ignore.formItem ? { size: void 0 } : inject(formItemContextKey, void 0);
	return computed(() => size.value || unref(fallback) || formItem?.size || form?.size || globalConfig.value || "");
};
var useFormDisabled = (fallback) => {
	const disabled = useProp("disabled");
	const form = inject(formContextKey, void 0);
	return computed(() => {
		return disabled.value ?? unref(fallback) ?? form?.disabled ?? false;
	});
};
//#endregion
//#region node_modules/element-plus/es/components/form/src/hooks/use-form-item.mjs
var useFormItem = () => {
	return {
		form: inject(formContextKey, void 0),
		formItem: inject(formItemContextKey, void 0)
	};
};
var useFormItemInputId = (props, { formItemContext, disableIdGeneration, disableIdManagement }) => {
	if (!disableIdGeneration) disableIdGeneration = /* @__PURE__ */ ref(false);
	if (!disableIdManagement) disableIdManagement = /* @__PURE__ */ ref(false);
	const instance = getCurrentInstance();
	const inLabel = () => {
		let parent = instance?.parent;
		while (parent) {
			if (parent.type.name === "ElFormItem") return false;
			if (parent.type.name === "ElLabelWrap") return true;
			parent = parent.parent;
		}
		return false;
	};
	const inputId = /* @__PURE__ */ ref();
	let idUnwatch = void 0;
	const isLabeledByFormItem = computed(() => {
		return !!(!(props.label || props.ariaLabel) && formItemContext && formItemContext.inputIds && formItemContext.inputIds?.length <= 1);
	});
	onMounted(() => {
		idUnwatch = watch([/* @__PURE__ */ toRef(props, "id"), disableIdGeneration], ([id, disableIdGeneration]) => {
			const newId = id ?? (!disableIdGeneration ? useId().value : void 0);
			if (newId !== inputId.value) {
				if (formItemContext?.removeInputId && !inLabel()) {
					inputId.value && formItemContext.removeInputId(inputId.value);
					if (!disableIdManagement?.value && !disableIdGeneration && newId) formItemContext.addInputId(newId);
				}
				inputId.value = newId;
			}
		}, { immediate: true });
	});
	onUnmounted(() => {
		idUnwatch && idUnwatch();
		if (formItemContext?.removeInputId) inputId.value && formItemContext.removeInputId(inputId.value);
	});
	return {
		isLabeledByFormItem,
		inputId
	};
};
//#endregion
//#region node_modules/element-plus/es/utils/arrays.mjs
var unique = (arr) => [...new Set(arr)];
var extractFirst = (arr) => {
	return isArray$1(arr) ? arr[0] : arr;
};
/** like `_.castArray`, except falsy value returns empty array. */
var castArray = (arr) => {
	if (!arr && arr !== 0) return [];
	return isArray$1(arr) ? arr : [arr];
};
//#endregion
//#region node_modules/element-plus/es/components/focus-trap/src/tokens.mjs
var FOCUS_AFTER_TRAPPED = "focus-trap.focus-after-trapped";
var FOCUS_AFTER_RELEASED = "focus-trap.focus-after-released";
var FOCUSOUT_PREVENTED = "focus-trap.focusout-prevented";
var FOCUS_AFTER_TRAPPED_OPTS = {
	cancelable: true,
	bubbles: false
};
var FOCUSOUT_PREVENTED_OPTS = {
	cancelable: true,
	bubbles: false
};
var ON_TRAP_FOCUS_EVT = "focusAfterTrapped";
var ON_RELEASE_FOCUS_EVT = "focusAfterReleased";
var FOCUS_TRAP_INJECTION_KEY = Symbol("elFocusTrap");
//#endregion
//#region node_modules/element-plus/es/components/focus-trap/src/utils.mjs
var focusReason = /* @__PURE__ */ ref();
var lastUserFocusTimestamp = /* @__PURE__ */ ref(0);
var lastAutomatedFocusTimestamp = /* @__PURE__ */ ref(0);
var focusReasonUserCount = 0;
var obtainAllFocusableElements = (element) => {
	const nodes = [];
	const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, { acceptNode: (node) => {
		const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
		if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
		return node.tabIndex >= 0 || node === document.activeElement ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
	} });
	while (walker.nextNode()) nodes.push(walker.currentNode);
	return nodes;
};
var getVisibleElement = (elements, container) => {
	for (const element of elements) if (!isHidden(element, container)) return element;
};
var isHidden = (element, container) => {
	if (getComputedStyle(element).visibility === "hidden") return true;
	while (element) {
		if (container && element === container) return false;
		if (getComputedStyle(element).display === "none") return true;
		element = element.parentElement;
	}
	return false;
};
var getEdges = (container) => {
	const focusable = obtainAllFocusableElements(container);
	return [getVisibleElement(focusable, container), getVisibleElement(focusable.reverse(), container)];
};
var isSelectable = (element) => {
	return element instanceof HTMLInputElement && "select" in element;
};
var tryFocus = (element, shouldSelect) => {
	if (element) {
		const prevFocusedElement = document.activeElement;
		focusElement(element, { preventScroll: true });
		lastAutomatedFocusTimestamp.value = window.performance.now();
		if (element !== prevFocusedElement && isSelectable(element) && shouldSelect) element.select();
	}
};
function removeFromStack(list, item) {
	const copy = [...list];
	const idx = list.indexOf(item);
	if (idx !== -1) copy.splice(idx, 1);
	return copy;
}
var createFocusableStack = () => {
	let stack = [];
	const push = (layer) => {
		const currentLayer = stack[0];
		if (currentLayer && layer !== currentLayer) currentLayer.pause();
		stack = removeFromStack(stack, layer);
		stack.unshift(layer);
	};
	const remove = (layer) => {
		stack = removeFromStack(stack, layer);
		stack[0]?.resume?.();
	};
	return {
		push,
		remove
	};
};
var focusFirstDescendant = (elements, shouldSelect = false) => {
	const prevFocusedElement = document.activeElement;
	for (const element of elements) {
		tryFocus(element, shouldSelect);
		if (document.activeElement !== prevFocusedElement) return;
	}
};
var focusableStack = createFocusableStack();
var isFocusCausedByUserEvent = () => {
	return lastUserFocusTimestamp.value > lastAutomatedFocusTimestamp.value;
};
var notifyFocusReasonPointer = () => {
	focusReason.value = "pointer";
	lastUserFocusTimestamp.value = window.performance.now();
};
var notifyFocusReasonKeydown = () => {
	focusReason.value = "keyboard";
	lastUserFocusTimestamp.value = window.performance.now();
};
var useFocusReason = () => {
	onMounted(() => {
		if (focusReasonUserCount === 0) {
			document.addEventListener("mousedown", notifyFocusReasonPointer);
			document.addEventListener("touchstart", notifyFocusReasonPointer);
			document.addEventListener("keydown", notifyFocusReasonKeydown);
		}
		focusReasonUserCount++;
	});
	onBeforeUnmount(() => {
		focusReasonUserCount--;
		if (focusReasonUserCount <= 0) {
			document.removeEventListener("mousedown", notifyFocusReasonPointer);
			document.removeEventListener("touchstart", notifyFocusReasonPointer);
			document.removeEventListener("keydown", notifyFocusReasonKeydown);
		}
	});
	return {
		focusReason,
		lastUserFocusTimestamp,
		lastAutomatedFocusTimestamp
	};
};
var createFocusOutPreventedEvent = (detail) => {
	return new CustomEvent(FOCUSOUT_PREVENTED, {
		...FOCUSOUT_PREVENTED_OPTS,
		detail
	});
};
//#endregion
//#region node_modules/element-plus/es/components/focus-trap/src/focus-trap.vue_vue_type_script_lang.mjs
var focus_trap_vue_vue_type_script_lang_default = /* @__PURE__ */ defineComponent({
	name: "ElFocusTrap",
	inheritAttrs: false,
	props: {
		loop: Boolean,
		trapped: Boolean,
		focusTrapEl: Object,
		focusStartEl: {
			type: [Object, String],
			default: "first"
		}
	},
	emits: [
		ON_TRAP_FOCUS_EVT,
		ON_RELEASE_FOCUS_EVT,
		"focusin",
		"focusout",
		"focusout-prevented",
		"release-requested"
	],
	setup(props, { emit }) {
		const forwardRef = /* @__PURE__ */ ref();
		let lastFocusBeforeTrapped;
		let lastFocusAfterTrapped;
		const { focusReason } = useFocusReason();
		useEscapeKeydown((event) => {
			if (props.trapped && !focusLayer.paused) emit("release-requested", event);
		});
		const focusLayer = {
			paused: false,
			pause() {
				this.paused = true;
			},
			resume() {
				this.paused = false;
			}
		};
		const onKeydown = (e) => {
			if (!props.loop && !props.trapped) return;
			if (focusLayer.paused) return;
			const { altKey, ctrlKey, metaKey, currentTarget, shiftKey } = e;
			const { loop } = props;
			const isTabbing = getEventCode(e) === EVENT_CODE.tab && !altKey && !ctrlKey && !metaKey;
			const currentFocusingEl = document.activeElement;
			if (isTabbing && currentFocusingEl) {
				const container = currentTarget;
				const [first, last] = getEdges(container);
				if (!(first && last)) {
					if (currentFocusingEl === container) {
						const focusoutPreventedEvent = createFocusOutPreventedEvent({ focusReason: focusReason.value });
						emit("focusout-prevented", focusoutPreventedEvent);
						if (!focusoutPreventedEvent.defaultPrevented) e.preventDefault();
					}
				} else if (!shiftKey && currentFocusingEl === last) {
					const focusoutPreventedEvent = createFocusOutPreventedEvent({ focusReason: focusReason.value });
					emit("focusout-prevented", focusoutPreventedEvent);
					if (!focusoutPreventedEvent.defaultPrevented) {
						e.preventDefault();
						if (loop) tryFocus(first, true);
					}
				} else if (shiftKey && [first, container].includes(currentFocusingEl)) {
					const focusoutPreventedEvent = createFocusOutPreventedEvent({ focusReason: focusReason.value });
					emit("focusout-prevented", focusoutPreventedEvent);
					if (!focusoutPreventedEvent.defaultPrevented) {
						e.preventDefault();
						if (loop) tryFocus(last, true);
					}
				}
			}
		};
		provide(FOCUS_TRAP_INJECTION_KEY, {
			focusTrapRef: forwardRef,
			onKeydown
		});
		watch(() => props.focusTrapEl, (focusTrapEl) => {
			if (focusTrapEl) forwardRef.value = focusTrapEl;
		}, { immediate: true });
		watch([forwardRef], ([forwardRef], [oldForwardRef]) => {
			if (forwardRef) {
				forwardRef.addEventListener("keydown", onKeydown);
				forwardRef.addEventListener("focusin", onFocusIn);
				forwardRef.addEventListener("focusout", onFocusOut);
			}
			if (oldForwardRef) {
				oldForwardRef.removeEventListener("keydown", onKeydown);
				oldForwardRef.removeEventListener("focusin", onFocusIn);
				oldForwardRef.removeEventListener("focusout", onFocusOut);
			}
		});
		const trapOnFocus = (e) => {
			emit(ON_TRAP_FOCUS_EVT, e);
		};
		const releaseOnFocus = (e) => emit(ON_RELEASE_FOCUS_EVT, e);
		const onFocusIn = (e) => {
			const trapContainer = unref(forwardRef);
			if (!trapContainer) return;
			const target = e.target;
			const relatedTarget = e.relatedTarget;
			const isFocusedInTrap = target && trapContainer.contains(target);
			if (!props.trapped) {
				if (!(relatedTarget && trapContainer.contains(relatedTarget))) lastFocusBeforeTrapped = relatedTarget;
			}
			if (isFocusedInTrap) emit("focusin", e);
			if (focusLayer.paused) return;
			if (props.trapped) if (isFocusedInTrap) lastFocusAfterTrapped = target;
			else tryFocus(lastFocusAfterTrapped, true);
		};
		const onFocusOut = (e) => {
			const trapContainer = unref(forwardRef);
			if (focusLayer.paused || !trapContainer) return;
			if (props.trapped) {
				const relatedTarget = e.relatedTarget;
				if (!isNil(relatedTarget) && !trapContainer.contains(relatedTarget)) setTimeout(() => {
					if (!focusLayer.paused && props.trapped) {
						const focusoutPreventedEvent = createFocusOutPreventedEvent({ focusReason: focusReason.value });
						emit("focusout-prevented", focusoutPreventedEvent);
						if (!focusoutPreventedEvent.defaultPrevented) tryFocus(lastFocusAfterTrapped, true);
					}
				}, 0);
			} else {
				const target = e.target;
				if (!(target && trapContainer.contains(target))) emit("focusout", e);
			}
		};
		async function startTrap() {
			await nextTick();
			const trapContainer = unref(forwardRef);
			if (trapContainer) {
				focusableStack.push(focusLayer);
				const prevFocusedElement = trapContainer.contains(document.activeElement) ? lastFocusBeforeTrapped : document.activeElement;
				lastFocusBeforeTrapped = prevFocusedElement;
				if (!trapContainer.contains(prevFocusedElement)) {
					const focusEvent = new Event(FOCUS_AFTER_TRAPPED, FOCUS_AFTER_TRAPPED_OPTS);
					trapContainer.addEventListener(FOCUS_AFTER_TRAPPED, trapOnFocus);
					trapContainer.dispatchEvent(focusEvent);
					if (!focusEvent.defaultPrevented) nextTick(() => {
						let focusStartEl = props.focusStartEl;
						if (!isString(focusStartEl)) {
							tryFocus(focusStartEl);
							if (document.activeElement !== focusStartEl) focusStartEl = "first";
						}
						if (focusStartEl === "first") focusFirstDescendant(obtainAllFocusableElements(trapContainer), true);
						if (document.activeElement === prevFocusedElement || focusStartEl === "container") tryFocus(trapContainer);
					});
				}
			}
		}
		function stopTrap() {
			const trapContainer = unref(forwardRef);
			if (trapContainer) {
				trapContainer.removeEventListener(FOCUS_AFTER_TRAPPED, trapOnFocus);
				const releasedEvent = new CustomEvent(FOCUS_AFTER_RELEASED, {
					...FOCUS_AFTER_TRAPPED_OPTS,
					detail: { focusReason: focusReason.value }
				});
				trapContainer.addEventListener(FOCUS_AFTER_RELEASED, releaseOnFocus);
				trapContainer.dispatchEvent(releasedEvent);
				if (!releasedEvent.defaultPrevented && (focusReason.value == "keyboard" || !isFocusCausedByUserEvent() || trapContainer.contains(document.activeElement))) tryFocus(lastFocusBeforeTrapped ?? document.body);
				trapContainer.removeEventListener(FOCUS_AFTER_RELEASED, releaseOnFocus);
				focusableStack.remove(focusLayer);
				lastFocusBeforeTrapped = null;
				lastFocusAfterTrapped = null;
			}
		}
		onMounted(() => {
			if (props.trapped) startTrap();
			watch(() => props.trapped, (trapped) => {
				if (trapped) startTrap();
				else stopTrap();
			});
		});
		onBeforeUnmount(() => {
			if (props.trapped) stopTrap();
			if (forwardRef.value) {
				forwardRef.value.removeEventListener("keydown", onKeydown);
				forwardRef.value.removeEventListener("focusin", onFocusIn);
				forwardRef.value.removeEventListener("focusout", onFocusOut);
				forwardRef.value = void 0;
			}
			lastFocusBeforeTrapped = null;
			lastFocusAfterTrapped = null;
		});
		return { onKeydown };
	}
});
//#endregion
//#region node_modules/element-plus/es/_virtual/_plugin-vue_export-helper.mjs
var _plugin_vue_export_helper_default$1 = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region node_modules/element-plus/es/components/focus-trap/src/focus-trap.mjs
function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
	return renderSlot(_ctx.$slots, "default", { handleKeydown: _ctx.onKeydown });
}
//#endregion
//#region node_modules/element-plus/es/components/focus-trap/index.mjs
var focus_trap_default$1 = /* @__PURE__ */ _plugin_vue_export_helper_default$1(focus_trap_vue_vue_type_script_lang_default, [["render", _sfc_render$6]]);
//#endregion
//#region node_modules/element-plus/es/components/popper/src/utils.mjs
var buildPopperOptions = (props, modifiers = []) => {
	const { placement, strategy, popperOptions } = props;
	const options = {
		placement,
		strategy,
		...popperOptions,
		modifiers: [...genModifiers(props), ...modifiers]
	};
	deriveExtraModifiers(options, popperOptions?.modifiers);
	return options;
};
var unwrapMeasurableEl = ($el) => {
	if (!isClient) return;
	return unrefElement($el);
};
function genModifiers(options) {
	const { offset, gpuAcceleration, fallbackPlacements } = options;
	return [
		{
			name: "offset",
			options: { offset: [0, offset ?? 12] }
		},
		{
			name: "preventOverflow",
			options: { padding: {
				top: 0,
				bottom: 0,
				left: 0,
				right: 0
			} }
		},
		{
			name: "flip",
			options: {
				padding: 5,
				fallbackPlacements
			}
		},
		{
			name: "computeStyles",
			options: { gpuAcceleration }
		}
	];
}
function deriveExtraModifiers(options, modifiers) {
	if (modifiers) options.modifiers = [...options.modifiers, ...modifiers ?? []];
}
//#endregion
//#region node_modules/element-plus/es/components/popper/src/composables/use-content.mjs
var DEFAULT_ARROW_OFFSET = 0;
var usePopperContent = (props) => {
	const { popperInstanceRef, contentRef, triggerRef, role } = inject(POPPER_INJECTION_KEY, void 0);
	const arrowRef = /* @__PURE__ */ ref();
	const arrowOffset = computed(() => props.arrowOffset);
	const eventListenerModifier = computed(() => {
		return {
			name: "eventListeners",
			enabled: !!props.visible
		};
	});
	const arrowModifier = computed(() => {
		const arrowEl = unref(arrowRef);
		const offset = unref(arrowOffset) ?? DEFAULT_ARROW_OFFSET;
		return {
			name: "arrow",
			enabled: !isUndefined$1(arrowEl),
			options: {
				element: arrowEl,
				padding: offset
			}
		};
	});
	const options = computed(() => {
		return {
			onFirstUpdate: () => {
				update();
			},
			...buildPopperOptions(props, [unref(arrowModifier), unref(eventListenerModifier)])
		};
	});
	const computedReference = computed(() => unwrapMeasurableEl(props.referenceEl) || unref(triggerRef));
	const { attributes, state, styles, update, forceUpdate, instanceRef } = usePopper(computedReference, contentRef, options);
	watch(instanceRef, (instance) => popperInstanceRef.value = instance, { flush: "sync" });
	onMounted(() => {
		watch(() => unref(computedReference)?.getBoundingClientRect?.(), () => {
			update();
		});
	});
	let stopResizeObserver;
	watch(() => props.visible, (visible) => {
		stopResizeObserver?.();
		stopResizeObserver = void 0;
		if (visible) stopResizeObserver = useResizeObserver(contentRef, update).stop;
	});
	onBeforeUnmount(() => {
		popperInstanceRef.value = void 0;
		stopResizeObserver?.();
		stopResizeObserver = void 0;
	});
	return {
		attributes,
		arrowRef,
		contentRef,
		instanceRef,
		state,
		styles,
		role,
		forceUpdate,
		update
	};
};
//#endregion
//#region node_modules/element-plus/es/components/popper/src/composables/use-content-dom.mjs
var usePopperContentDOM = (props, { attributes, styles, role }) => {
	const { nextZIndex } = useZIndex();
	const ns = useNamespace("popper");
	const contentAttrs = computed(() => unref(attributes).popper);
	const contentZIndex = /* @__PURE__ */ ref(isNumber(props.zIndex) ? props.zIndex : nextZIndex());
	const contentClass = computed(() => [
		ns.b(),
		ns.is("pure", props.pure),
		ns.is(props.effect),
		props.popperClass
	]);
	const contentStyle = computed(() => {
		return [
			{ zIndex: unref(contentZIndex) },
			unref(styles).popper,
			props.popperStyle || {}
		];
	});
	const ariaModal = computed(() => role.value === "dialog" ? "false" : void 0);
	const arrowStyle = computed(() => unref(styles).arrow || {});
	const updateZIndex = () => {
		contentZIndex.value = isNumber(props.zIndex) ? props.zIndex : nextZIndex();
	};
	return {
		ariaModal,
		arrowStyle,
		contentAttrs,
		contentClass,
		contentStyle,
		contentZIndex,
		updateZIndex
	};
};
//#endregion
//#region node_modules/element-plus/es/components/popper/src/composables/use-focus-trap.mjs
var usePopperContentFocusTrap = (props, emit) => {
	const trapped = /* @__PURE__ */ ref(false);
	const focusStartRef = /* @__PURE__ */ ref();
	const onFocusAfterTrapped = () => {
		emit("focus");
	};
	const onFocusAfterReleased = (event) => {
		if (event.detail?.focusReason !== "pointer") {
			focusStartRef.value = "first";
			emit("blur");
		}
	};
	const onFocusInTrap = (event) => {
		if (props.visible && !trapped.value) {
			if (event.target) focusStartRef.value = event.target;
			trapped.value = true;
		}
	};
	const onFocusoutPrevented = (event) => {
		if (!props.trapping) {
			if (event.detail.focusReason === "pointer") event.preventDefault();
			trapped.value = false;
		}
	};
	const onReleaseRequested = () => {
		trapped.value = false;
		emit("close");
	};
	onBeforeUnmount(() => {
		focusStartRef.value = void 0;
	});
	return {
		focusStartRef,
		trapped,
		onFocusAfterReleased,
		onFocusAfterTrapped,
		onFocusInTrap,
		onFocusoutPrevented,
		onReleaseRequested
	};
};
//#endregion
//#region node_modules/element-plus/es/components/popper/src/content2.mjs
var content_default$1 = /* @__PURE__ */ defineComponent({
	name: "ElPopperContent",
	__name: "content",
	props: popperContentProps,
	emits: popperContentEmits,
	setup(__props, { expose: __expose, emit: __emit }) {
		const emit = __emit;
		const props = __props;
		const { focusStartRef, trapped, onFocusAfterReleased, onFocusAfterTrapped, onFocusInTrap, onFocusoutPrevented, onReleaseRequested } = usePopperContentFocusTrap(props, emit);
		const { attributes, arrowRef, contentRef, styles, instanceRef, role, update } = usePopperContent(props);
		const { ariaModal, arrowStyle, contentAttrs, contentClass, contentStyle, updateZIndex } = usePopperContentDOM(props, {
			styles,
			attributes,
			role
		});
		const formItemContext = inject(formItemContextKey, void 0);
		provide(POPPER_CONTENT_INJECTION_KEY, {
			arrowStyle,
			arrowRef
		});
		if (formItemContext) provide(formItemContextKey, {
			...formItemContext,
			addInputId: NOOP,
			removeInputId: NOOP
		});
		let triggerTargetAriaStopWatch = void 0;
		const updatePopper = (shouldUpdateZIndex = true) => {
			update();
			shouldUpdateZIndex && updateZIndex();
		};
		const togglePopperAlive = () => {
			updatePopper(false);
			if (props.visible && props.focusOnShow) trapped.value = true;
			else if (props.visible === false) trapped.value = false;
		};
		onMounted(() => {
			watch(() => props.triggerTargetEl, (triggerTargetEl, prevTriggerTargetEl) => {
				triggerTargetAriaStopWatch?.();
				triggerTargetAriaStopWatch = void 0;
				const el = unref(triggerTargetEl || contentRef.value);
				const prevEl = unref(prevTriggerTargetEl || contentRef.value);
				if (isElement(el)) triggerTargetAriaStopWatch = watch([
					role,
					() => props.ariaLabel,
					ariaModal,
					() => props.id
				], (watches) => {
					[
						"role",
						"aria-label",
						"aria-modal",
						"id"
					].forEach((key, idx) => {
						isNil(watches[idx]) ? el.removeAttribute(key) : el.setAttribute(key, watches[idx]);
					});
				}, { immediate: true });
				if (prevEl !== el && isElement(prevEl)) [
					"role",
					"aria-label",
					"aria-modal",
					"id"
				].forEach((key) => {
					prevEl.removeAttribute(key);
				});
			}, { immediate: true });
			watch(() => props.visible, togglePopperAlive, { immediate: true });
		});
		onBeforeUnmount(() => {
			triggerTargetAriaStopWatch?.();
			triggerTargetAriaStopWatch = void 0;
			contentRef.value = void 0;
		});
		__expose({
			/**
			* @description popper content element
			*/
			popperContentRef: contentRef,
			/**
			* @description popperjs instance
			*/
			popperInstanceRef: instanceRef,
			/**
			* @description method for updating popper
			*/
			updatePopper,
			/**
			* @description content style
			*/
			contentStyle
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", mergeProps({
				ref_key: "contentRef",
				ref: contentRef
			}, unref(contentAttrs), {
				style: unref(contentStyle),
				class: unref(contentClass),
				tabindex: "-1",
				onMouseenter: _cache[0] || (_cache[0] = (e) => _ctx.$emit("mouseenter", e)),
				onMouseleave: _cache[1] || (_cache[1] = (e) => _ctx.$emit("mouseleave", e))
			}), [createVNode(unref(focus_trap_default$1), {
				loop: __props.loop,
				trapped: unref(trapped),
				"trap-on-focus-in": true,
				"focus-trap-el": unref(contentRef),
				"focus-start-el": unref(focusStartRef),
				onFocusAfterTrapped: unref(onFocusAfterTrapped),
				onFocusAfterReleased: unref(onFocusAfterReleased),
				onFocusin: unref(onFocusInTrap),
				onFocusoutPrevented: unref(onFocusoutPrevented),
				onReleaseRequested: unref(onReleaseRequested)
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 8, [
				"loop",
				"trapped",
				"focus-trap-el",
				"focus-start-el",
				"onFocusAfterTrapped",
				"onFocusAfterReleased",
				"onFocusin",
				"onFocusoutPrevented",
				"onReleaseRequested"
			])], 16);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/popper/index.mjs
var ElPopper = withInstall(/* @__PURE__ */ defineComponent({
	name: "ElPopper",
	inheritAttrs: false,
	__name: "popper",
	props: popperProps,
	setup(__props, { expose: __expose }) {
		const props = __props;
		const popperProvides = {
			/**
			* @description trigger element
			*/
			triggerRef: /* @__PURE__ */ ref(),
			/**
			* @description popperjs instance
			*/
			popperInstanceRef: /* @__PURE__ */ ref(),
			/**
			* @description popper content element
			*/
			contentRef: /* @__PURE__ */ ref(),
			/**
			* @description popper reference element
			*/
			referenceRef: /* @__PURE__ */ ref(),
			/**
			* @description role determines how aria attributes are distributed
			*/
			role: computed(() => props.role)
		};
		__expose(popperProvides);
		provide(POPPER_INJECTION_KEY, popperProvides);
		return (_ctx, _cache) => {
			return renderSlot(_ctx.$slots, "default");
		};
	}
}));
({
	...useDelayedTogglePropsDefaults,
	...popperContentPropsDefaults
});
/**
* @deprecated Removed after 3.0.0, Use `ElTooltipContentProps` instead.
*/
var useTooltipContentProps = buildProps({
	...useDelayedToggleProps,
	...popperContentProps,
	/**
	* @description which element the tooltip CONTENT appends to
	*/
	appendTo: { type: definePropType([String, Object]) },
	/**
	* @description display content, can be overridden by `slot#content`
	*/
	content: {
		type: String,
		default: ""
	},
	/**
	* @description whether `content` is treated as HTML string
	*/
	rawContent: Boolean,
	/**
	* @description when tooltip inactive and `persistent` is `false` , popconfirm will be destroyed
	*/
	persistent: Boolean,
	/**
	* @description visibility of Tooltip
	*/
	visible: {
		type: definePropType(Boolean),
		default: null
	},
	/**
	* @description animation name
	*/
	transition: String,
	/**
	* @description whether tooltip content is teleported, if `true` it will be teleported to where `append-to` sets
	*/
	teleported: {
		type: Boolean,
		default: true
	},
	/**
	* @description whether Tooltip is disabled
	*/
	disabled: Boolean,
	...useAriaProps(["ariaLabel"])
});
//#endregion
//#region node_modules/element-plus/es/components/tooltip/src/trigger.mjs
/**
* @deprecated Removed after 3.0.0, Use `UseTooltipTriggerProps` instead.
*/
var useTooltipTriggerProps = buildProps({
	...popperTriggerProps,
	/**
	* @description whether Tooltip is disabled
	*/
	disabled: Boolean,
	/**
	* @description How should the tooltip be triggered (to show), not valid in controlled mode
	*/
	trigger: {
		type: definePropType([String, Array]),
		default: "hover"
	},
	/**
	* @description When you click the mouse to focus on the trigger element, you can define a set of keyboard codes to control the display of tooltip through the keyboard, not valid in controlled mode
	*/
	triggerKeys: {
		type: definePropType(Array),
		default: () => [
			EVENT_CODE.enter,
			EVENT_CODE.numpadEnter,
			EVENT_CODE.space
		]
	},
	/**
	* @description when triggering tooltips through hover, whether to focus the trigger element, which improves accessibility
	*/
	focusOnTarget: Boolean
});
//#endregion
//#region node_modules/element-plus/es/components/tooltip/src/tooltip.mjs
var { useModelToggleProps: useTooltipModelToggleProps, useModelToggleEmits: useTooltipModelToggleEmits, useModelToggle: useTooltipModelToggle } = createModelToggleComposable("visible");
/**
* @deprecated Removed after 3.0.0, Use `UseTooltipProps` instead.
*/
var useTooltipProps = buildProps({
	...popperProps,
	...useTooltipModelToggleProps,
	...useTooltipContentProps,
	...useTooltipTriggerProps,
	...popperArrowProps,
	/**
	* @description whether the tooltip content has an arrow
	*/
	showArrow: {
		type: Boolean,
		default: true
	}
});
var tooltipEmits = [
	...useTooltipModelToggleEmits,
	"before-show",
	"before-hide",
	"show",
	"hide",
	"open",
	"close"
];
//#endregion
//#region node_modules/element-plus/es/components/tooltip/src/constants.mjs
var TOOLTIP_INJECTION_KEY = Symbol("elTooltip");
//#endregion
//#region node_modules/element-plus/es/components/tooltip/src/utils.mjs
var isTriggerType = (trigger, type) => {
	if (isArray$1(trigger)) return trigger.includes(type);
	return trigger === type;
};
var whenTrigger = (trigger, type, handler) => {
	return (e) => {
		isTriggerType(unref(trigger), type) && handler(e);
	};
};
//#endregion
//#region node_modules/element-plus/es/components/tooltip/src/trigger2.mjs
var trigger_default = /* @__PURE__ */ defineComponent({
	name: "ElTooltipTrigger",
	__name: "trigger",
	props: useTooltipTriggerProps,
	setup(__props, { expose: __expose }) {
		const props = __props;
		const ns = useNamespace("tooltip");
		const { controlled, id, open, onOpen, onClose, onToggle } = inject(TOOLTIP_INJECTION_KEY, void 0);
		const triggerRef = /* @__PURE__ */ ref(null);
		const stopWhenControlledOrDisabled = () => {
			if (unref(controlled) || props.disabled) return true;
		};
		const trigger = /* @__PURE__ */ toRef(props, "trigger");
		const onMouseenter = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "hover", (e) => {
			onOpen(e);
			if (props.focusOnTarget && e.target) nextTick(() => {
				focusElement(e.target, { preventScroll: true });
			});
		}));
		const onMouseleave = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "hover", onClose));
		const onClick = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "click", (e) => {
			if (e.button === 0) onToggle(e);
		}));
		const onFocus = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "focus", onOpen));
		const onBlur = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "focus", onClose));
		const onContextMenu = composeEventHandlers(stopWhenControlledOrDisabled, whenTrigger(trigger, "contextmenu", (e) => {
			e.preventDefault();
			onToggle(e);
		}));
		const onKeydown = composeEventHandlers(stopWhenControlledOrDisabled, (e) => {
			const code = getEventCode(e);
			if (props.triggerKeys.includes(code)) {
				e.preventDefault();
				onToggle(e);
			}
		});
		__expose({ 
		/**
		* @description trigger element
		*/
triggerRef });
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(trigger_default$1), {
				id: unref(id),
				"virtual-ref": __props.virtualRef,
				open: unref(open),
				"virtual-triggering": __props.virtualTriggering,
				class: normalizeClass(unref(ns).e("trigger")),
				onBlur: unref(onBlur),
				onClick: unref(onClick),
				onContextmenu: unref(onContextMenu),
				onFocus: unref(onFocus),
				onMouseenter: unref(onMouseenter),
				onMouseleave: unref(onMouseleave),
				onKeydown: unref(onKeydown)
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 8, [
				"id",
				"virtual-ref",
				"open",
				"virtual-triggering",
				"class",
				"onBlur",
				"onClick",
				"onContextmenu",
				"onFocus",
				"onMouseenter",
				"onMouseleave",
				"onKeydown"
			]);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/tooltip/src/content2.mjs
var content_default = /* @__PURE__ */ defineComponent({
	name: "ElTooltipContent",
	inheritAttrs: false,
	__name: "content",
	props: useTooltipContentProps,
	setup(__props, { expose: __expose }) {
		const props = __props;
		const { selector } = usePopperContainerId();
		const ns = useNamespace("tooltip");
		const contentRef = /* @__PURE__ */ ref();
		const popperContentRef = computedEager(() => contentRef.value?.popperContentRef);
		let stopHandle;
		const { controlled, id, open, trigger, onClose, onOpen, onShow, onHide, onBeforeShow, onBeforeHide } = inject(TOOLTIP_INJECTION_KEY, void 0);
		const transitionClass = computed(() => {
			return props.transition || `${ns.namespace.value}-fade-in-linear`;
		});
		const persistentRef = computed(() => {
			return props.persistent;
		});
		onBeforeUnmount(() => {
			stopHandle?.();
		});
		const shouldRender = computed(() => {
			return unref(persistentRef) ? true : unref(open);
		});
		const shouldShow = computed(() => {
			return props.disabled ? false : unref(open);
		});
		const appendTo = computed(() => {
			return props.appendTo || selector.value;
		});
		const contentStyle = computed(() => props.style ?? {});
		const ariaHidden = /* @__PURE__ */ ref(true);
		const onTransitionLeave = () => {
			onHide();
			isFocusInsideContent() && focusElement(document.body, { preventScroll: true });
			ariaHidden.value = true;
		};
		const stopWhenControlled = () => {
			if (unref(controlled)) return true;
		};
		const onContentEnter = composeEventHandlers(stopWhenControlled, () => {
			if (props.enterable && isTriggerType(unref(trigger), "hover")) onOpen();
		});
		const onContentLeave = composeEventHandlers(stopWhenControlled, () => {
			if (isTriggerType(unref(trigger), "hover")) onClose();
		});
		const onBeforeEnter = () => {
			contentRef.value?.updatePopper?.();
			onBeforeShow?.();
		};
		const onBeforeLeave = () => {
			onBeforeHide?.();
		};
		const onAfterShow = () => {
			onShow();
		};
		const onBlur = () => {
			if (!props.virtualTriggering) onClose();
		};
		const isFocusInsideContent = (event) => {
			const popperContent = contentRef.value?.popperContentRef;
			const activeElement = event?.relatedTarget || document.activeElement;
			return popperContent?.contains(activeElement);
		};
		watch(() => unref(open), (val) => {
			if (!val) stopHandle?.();
			else {
				ariaHidden.value = false;
				stopHandle = onClickOutside(popperContentRef, () => {
					if (unref(controlled)) return;
					if (castArray(unref(trigger)).every((item) => {
						return item !== "hover" && item !== "focus";
					})) onClose();
				}, { detectIframe: true });
			}
		}, { flush: "post" });
		__expose({
			/**
			* @description el-popper-content component instance
			*/
			contentRef,
			/**
			* @description validate current focus event is trigger inside el-popper-content
			*/
			isFocusInsideContent
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Teleport, {
				disabled: !__props.teleported,
				to: appendTo.value
			}, [shouldRender.value || !ariaHidden.value ? (openBlock(), createBlock(Transition, {
				key: 0,
				name: transitionClass.value,
				appear: !persistentRef.value,
				onAfterLeave: onTransitionLeave,
				onBeforeEnter,
				onAfterEnter: onAfterShow,
				onBeforeLeave,
				persisted: ""
			}, {
				default: withCtx(() => [withDirectives(createVNode(unref(content_default$1), mergeProps({
					id: unref(id),
					ref_key: "contentRef",
					ref: contentRef
				}, _ctx.$attrs, {
					"aria-label": __props.ariaLabel,
					"aria-hidden": ariaHidden.value,
					"boundaries-padding": __props.boundariesPadding,
					"fallback-placements": __props.fallbackPlacements,
					"gpu-acceleration": __props.gpuAcceleration,
					offset: __props.offset,
					placement: __props.placement,
					"popper-options": __props.popperOptions,
					"arrow-offset": __props.arrowOffset,
					strategy: __props.strategy,
					effect: __props.effect,
					enterable: __props.enterable,
					pure: __props.pure,
					"popper-class": __props.popperClass,
					"popper-style": [__props.popperStyle, contentStyle.value],
					"reference-el": __props.referenceEl,
					"trigger-target-el": __props.triggerTargetEl,
					visible: shouldShow.value,
					"z-index": __props.zIndex,
					loop: __props.loop,
					onMouseenter: unref(onContentEnter),
					onMouseleave: unref(onContentLeave),
					onBlur,
					onClose: unref(onClose)
				}), {
					default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
					_: 3
				}, 16, [
					"id",
					"aria-label",
					"aria-hidden",
					"boundaries-padding",
					"fallback-placements",
					"gpu-acceleration",
					"offset",
					"placement",
					"popper-options",
					"arrow-offset",
					"strategy",
					"effect",
					"enterable",
					"pure",
					"popper-class",
					"popper-style",
					"reference-el",
					"trigger-target-el",
					"visible",
					"z-index",
					"loop",
					"onMouseenter",
					"onMouseleave",
					"onClose"
				]), [[vShow, shouldShow.value]])]),
				_: 3
			}, 8, ["name", "appear"])) : createCommentVNode("v-if", true)], 8, ["disabled", "to"]);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/tooltip/src/tooltip.vue_vue_type_script_setup_true_lang.mjs
var _hoisted_1$20 = ["innerHTML"];
var _hoisted_2$11 = { key: 1 };
//#endregion
//#region node_modules/element-plus/es/components/tooltip/index.mjs
var ElTooltip = withInstall(/* @__PURE__ */ defineComponent({
	name: "ElTooltip",
	__name: "tooltip",
	props: useTooltipProps,
	emits: tooltipEmits,
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		usePopperContainer();
		const ns = useNamespace("tooltip");
		const id = useId();
		const popperRef = /* @__PURE__ */ ref();
		const contentRef = /* @__PURE__ */ ref();
		const updatePopper = () => {
			const popperComponent = unref(popperRef);
			if (popperComponent) popperComponent.popperInstanceRef?.update();
		};
		const open = /* @__PURE__ */ ref(false);
		const toggleReason = /* @__PURE__ */ ref();
		const { show, hide, hasUpdateHandler } = useTooltipModelToggle({
			indicator: open,
			toggleReason
		});
		const { onOpen, onClose } = useDelayedToggle({
			showAfter: /* @__PURE__ */ toRef(props, "showAfter"),
			hideAfter: /* @__PURE__ */ toRef(props, "hideAfter"),
			autoClose: /* @__PURE__ */ toRef(props, "autoClose"),
			open: show,
			close: hide
		});
		const controlled = computed(() => isBoolean(props.visible) && !hasUpdateHandler.value);
		const kls = computed(() => {
			return [ns.b(), props.popperClass];
		});
		provide(TOOLTIP_INJECTION_KEY, {
			controlled,
			id,
			open: /* @__PURE__ */ readonly(open),
			trigger: /* @__PURE__ */ toRef(props, "trigger"),
			onOpen,
			onClose,
			onToggle: (event) => {
				if (unref(open)) onClose(event);
				else onOpen(event);
			},
			onShow: () => {
				emit("show", toggleReason.value);
			},
			onHide: () => {
				emit("hide", toggleReason.value);
			},
			onBeforeShow: () => {
				emit("before-show", toggleReason.value);
			},
			onBeforeHide: () => {
				emit("before-hide", toggleReason.value);
			},
			updatePopper
		});
		watch(() => props.disabled, (disabled) => {
			if (disabled && open.value) open.value = false;
			if (!disabled && isBoolean(props.visible)) open.value = props.visible;
		});
		const isFocusInsideContent = (event) => {
			return contentRef.value?.isFocusInsideContent(event);
		};
		onDeactivated(() => open.value && hide());
		onBeforeUnmount(() => {
			toggleReason.value = void 0;
		});
		__expose({
			/**
			* @description el-popper component instance
			*/
			popperRef,
			/**
			* @description el-tooltip-content component instance
			*/
			contentRef,
			/**
			* @description validate current focus event is trigger inside el-tooltip-content
			*/
			isFocusInsideContent,
			/**
			* @description update el-popper component instance
			*/
			updatePopper,
			/**
			* @description expose onOpen function to mange el-tooltip open state
			*/
			onOpen,
			/**
			* @description expose onClose function to manage el-tooltip close state
			*/
			onClose,
			/**
			* @description expose hide function
			*/
			hide
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(unref(ElPopper), {
				ref_key: "popperRef",
				ref: popperRef,
				role: __props.role
			}, {
				default: withCtx(() => [createVNode(trigger_default, {
					disabled: __props.disabled,
					trigger: __props.trigger,
					"trigger-keys": __props.triggerKeys,
					"virtual-ref": __props.virtualRef,
					"virtual-triggering": __props.virtualTriggering,
					"focus-on-target": __props.focusOnTarget
				}, {
					default: withCtx(() => [_ctx.$slots.default ? renderSlot(_ctx.$slots, "default", { key: 0 }) : createCommentVNode("v-if", true)]),
					_: 3
				}, 8, [
					"disabled",
					"trigger",
					"trigger-keys",
					"virtual-ref",
					"virtual-triggering",
					"focus-on-target"
				]), createVNode(content_default, {
					ref_key: "contentRef",
					ref: contentRef,
					"aria-label": __props.ariaLabel,
					"boundaries-padding": __props.boundariesPadding,
					content: __props.content,
					disabled: __props.disabled,
					effect: __props.effect,
					enterable: __props.enterable,
					"fallback-placements": __props.fallbackPlacements,
					"hide-after": __props.hideAfter,
					"gpu-acceleration": __props.gpuAcceleration,
					offset: __props.offset,
					persistent: __props.persistent,
					"popper-class": kls.value,
					"popper-style": __props.popperStyle,
					placement: __props.placement,
					"popper-options": __props.popperOptions,
					"arrow-offset": __props.arrowOffset,
					pure: __props.pure,
					"raw-content": __props.rawContent,
					"reference-el": __props.referenceEl,
					"trigger-target-el": __props.triggerTargetEl,
					"show-after": __props.showAfter,
					strategy: __props.strategy,
					teleported: __props.teleported,
					transition: __props.transition,
					"virtual-triggering": __props.virtualTriggering,
					"z-index": __props.zIndex,
					"append-to": __props.appendTo,
					loop: __props.loop
				}, {
					default: withCtx(() => [renderSlot(_ctx.$slots, "content", {}, () => [__props.rawContent ? (openBlock(), createElementBlock("span", {
						key: 0,
						innerHTML: __props.content
					}, null, 8, _hoisted_1$20)) : (openBlock(), createElementBlock("span", _hoisted_2$11, toDisplayString(__props.content), 1))]), __props.showArrow ? (openBlock(), createBlock(unref(arrow_default), { key: 0 })) : createCommentVNode("v-if", true)]),
					_: 3
				}, 8, [
					"aria-label",
					"boundaries-padding",
					"content",
					"disabled",
					"effect",
					"enterable",
					"fallback-placements",
					"hide-after",
					"gpu-acceleration",
					"offset",
					"persistent",
					"popper-class",
					"popper-style",
					"placement",
					"popper-options",
					"arrow-offset",
					"pure",
					"raw-content",
					"reference-el",
					"trigger-target-el",
					"show-after",
					"strategy",
					"teleported",
					"transition",
					"virtual-triggering",
					"z-index",
					"append-to",
					"loop"
				])]),
				_: 3
			}, 8, ["role"]);
		};
	}
}));
//#endregion
//#region node_modules/element-plus/es/utils/typescript.mjs
var mutable = (val) => val;
//#endregion
//#region node_modules/element-plus/es/components/input/src/input.mjs
/**
* @deprecated Removed after 3.0.0, Use `InputProps` instead.
*/
var inputProps = buildProps({
	/**
	* @description native input id
	*/
	id: {
		type: String,
		default: void 0
	},
	/**
	* @description input box size
	*/
	size: useSizeProp,
	/**
	* @description whether to disable
	*/
	disabled: {
		type: Boolean,
		default: void 0
	},
	/**
	* @description binding value
	*/
	modelValue: {
		type: definePropType([
			String,
			Number,
			Object
		]),
		default: ""
	},
	/**
	* @description v-model modifiers, reference [Vue modifiers](https://vuejs.org/guide/essentials/forms.html#modifiers)
	*/
	modelModifiers: {
		type: definePropType(Object),
		default: () => ({})
	},
	/**
	* @description same as `maxlength` in native input
	*/
	maxlength: { type: [String, Number] },
	/**
	* @description same as `minlength` in native input
	*/
	minlength: { type: [String, Number] },
	/**
	* @description type of input, see more in [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types)
	*/
	type: {
		type: definePropType(String),
		default: "text"
	},
	/**
	* @description control the resizability
	*/
	resize: {
		type: String,
		values: [
			"none",
			"both",
			"horizontal",
			"vertical"
		]
	},
	/**
	* @description whether textarea has an adaptive height
	*/
	autosize: {
		type: definePropType([Boolean, Object]),
		default: false
	},
	/**
	* @description native input autocomplete
	*/
	autocomplete: {
		type: definePropType(String),
		default: "off"
	},
	/**
	* @description format content
	*/
	formatter: { type: Function },
	/**
	* @description parse content
	*/
	parser: { type: Function },
	/**
	* @description placeholder
	*/
	placeholder: { type: String },
	/**
	* @description native input form
	*/
	form: { type: String },
	/**
	* @description native input readonly
	*/
	readonly: Boolean,
	/**
	* @description whether to show clear button
	*/
	clearable: Boolean,
	/**
	* @description custom clear icon component
	*/
	clearIcon: {
		type: iconPropType,
		default: circle_close_default
	},
	/**
	* @description toggleable password input
	*/
	showPassword: Boolean,
	/**
	* @description word count
	*/
	showWordLimit: Boolean,
	/**
	* @description word count position, valid when `show-word-limit` is true
	*/
	wordLimitPosition: {
		type: String,
		values: ["inside", "outside"],
		default: "inside"
	},
	/**
	* @description suffix icon
	*/
	suffixIcon: { type: iconPropType },
	/**
	* @description prefix icon
	*/
	prefixIcon: { type: iconPropType },
	/**
	* @description container role, internal properties provided for use by the picker component
	*/
	containerRole: {
		type: String,
		default: void 0
	},
	/**
	* @description input tabindex
	*/
	tabindex: {
		type: [String, Number],
		default: 0
	},
	/**
	* @description whether to trigger form validation
	*/
	validateEvent: {
		type: Boolean,
		default: true
	},
	/**
	* @description input or textarea element style
	*/
	inputStyle: {
		type: definePropType([
			Object,
			Array,
			String,
			Boolean
		]),
		default: () => mutable({})
	},
	/**
	* @description Count graphemes of input value. If it's set, native maxlength and minlength won't be used.
	*/
	countGraphemes: { type: definePropType(Function) },
	/**
	* @description native input autofocus
	*/
	autofocus: Boolean,
	rows: {
		type: Number,
		default: 2
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
	* @description same as `name` in native input
	*/
	name: String
});
var inputEmits = {
	[UPDATE_MODEL_EVENT]: (value) => isString(value),
	input: (value) => isString(value),
	change: (value, evt) => isString(value) && (evt instanceof Event || evt === void 0),
	focus: (evt) => evt instanceof FocusEvent,
	blur: (evt) => evt instanceof FocusEvent,
	clear: (evt) => evt === void 0 || evt instanceof MouseEvent,
	mouseleave: (evt) => evt instanceof MouseEvent,
	mouseenter: (evt) => evt instanceof MouseEvent,
	keydown: (evt) => evt instanceof Event,
	compositionstart: (evt) => evt instanceof CompositionEvent,
	compositionupdate: (evt) => evt instanceof CompositionEvent,
	compositionend: (evt) => evt instanceof CompositionEvent
};
markRaw(circle_close_default);
//#endregion
//#region node_modules/element-plus/es/components/input/src/utils.mjs
var hiddenTextarea = void 0;
var HIDDEN_STYLE = {
	height: "0",
	visibility: "hidden",
	overflow: isFirefox() ? "" : "hidden",
	position: "absolute",
	"z-index": "-1000",
	top: "0",
	right: "0"
};
var CONTEXT_STYLE = [
	"letter-spacing",
	"line-height",
	"padding-top",
	"padding-bottom",
	"font-family",
	"font-weight",
	"font-size",
	"text-rendering",
	"text-transform",
	"width",
	"text-indent",
	"padding-left",
	"padding-right",
	"border-width",
	"box-sizing",
	"word-break"
];
var looseToNumber = (val) => {
	const n = Number.parseFloat(val);
	return Number.isNaN(n) ? val : n;
};
function calculateNodeStyling(targetElement) {
	const style = window.getComputedStyle(targetElement);
	const boxSizing = style.getPropertyValue("box-sizing");
	const paddingSize = Number.parseFloat(style.getPropertyValue("padding-bottom")) + Number.parseFloat(style.getPropertyValue("padding-top"));
	const borderSize = Number.parseFloat(style.getPropertyValue("border-bottom-width")) + Number.parseFloat(style.getPropertyValue("border-top-width"));
	return {
		contextStyle: CONTEXT_STYLE.map((name) => [name, style.getPropertyValue(name)]),
		paddingSize,
		borderSize,
		boxSizing
	};
}
function calcTextareaHeight(targetElement, minRows = 1, maxRows) {
	if (!hiddenTextarea) {
		hiddenTextarea = document.createElement("textarea");
		let hostNode = document.body;
		if (!isFirefox() && targetElement.parentNode) hostNode = targetElement.parentNode;
		hostNode.appendChild(hiddenTextarea);
	}
	const { paddingSize, borderSize, boxSizing, contextStyle } = calculateNodeStyling(targetElement);
	contextStyle.forEach(([key, value]) => hiddenTextarea?.style.setProperty(key, value));
	Object.entries(HIDDEN_STYLE).forEach(([key, value]) => hiddenTextarea?.style.setProperty(key, value, "important"));
	hiddenTextarea.value = targetElement.value || targetElement.placeholder || "";
	let height = hiddenTextarea.scrollHeight;
	const result = {};
	if (boxSizing === "border-box") height = height + borderSize;
	else if (boxSizing === "content-box") height = height - paddingSize;
	hiddenTextarea.value = "";
	const singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;
	if (isNumber(minRows)) {
		let minHeight = singleRowHeight * minRows;
		if (boxSizing === "border-box") minHeight = minHeight + paddingSize + borderSize;
		height = Math.max(minHeight, height);
		result.minHeight = `${minHeight}px`;
	}
	if (isNumber(maxRows)) {
		let maxHeight = singleRowHeight * maxRows;
		if (boxSizing === "border-box") maxHeight = maxHeight + paddingSize + borderSize;
		height = Math.min(maxHeight, height);
	}
	result.height = `${height}px`;
	hiddenTextarea.parentNode?.removeChild(hiddenTextarea);
	hiddenTextarea = void 0;
	return result;
}
//#endregion
//#region node_modules/element-plus/es/components/input/src/input.vue_vue_type_script_setup_true_lang.mjs
var _hoisted_1$19 = [
	"id",
	"name",
	"minlength",
	"maxlength",
	"type",
	"disabled",
	"readonly",
	"autocomplete",
	"tabindex",
	"aria-label",
	"placeholder",
	"form",
	"autofocus",
	"role",
	"inputmode"
];
var _hoisted_2$10 = [
	"id",
	"name",
	"minlength",
	"maxlength",
	"tabindex",
	"disabled",
	"readonly",
	"autocomplete",
	"aria-label",
	"placeholder",
	"form",
	"autofocus",
	"rows",
	"role",
	"inputmode"
];
var COMPONENT_NAME$6 = "ElInput";
//#endregion
//#region node_modules/element-plus/es/components/input/index.mjs
var ElInput = withInstall(/* @__PURE__ */ defineComponent({
	name: COMPONENT_NAME$6,
	inheritAttrs: false,
	__name: "input",
	props: inputProps,
	emits: inputEmits,
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const rawAttrs = useAttrs$1();
		const slots = useSlots();
		const containerKls = computed(() => [
			props.type === "textarea" ? nsTextarea.b() : nsInput.b(),
			nsInput.m(inputSize.value),
			nsInput.is("disabled", inputDisabled.value),
			nsInput.is("exceed", inputExceed.value),
			{
				[nsInput.b("group")]: slots.prepend || slots.append,
				[nsInput.m("prefix")]: slots.prefix || props.prefixIcon,
				[nsInput.m("suffix")]: slots.suffix || props.suffixIcon || props.clearable || props.showPassword,
				[nsInput.bm("suffix", "password-clear")]: showClear.value && showPwdVisible.value,
				[nsInput.b("hidden")]: props.type === "hidden"
			},
			rawAttrs.class
		]);
		const wrapperKls = computed(() => [nsInput.e("wrapper"), nsInput.is("focus", isFocused.value)]);
		const attrs = useAttrs();
		const maxlength = computed(() => props.maxlength?.toString());
		const { form: elForm, formItem: elFormItem } = useFormItem();
		const { inputId } = useFormItemInputId(props, { formItemContext: elFormItem });
		const inputSize = useFormSize();
		const inputDisabled = useFormDisabled();
		const nsInput = useNamespace("input");
		const nsTextarea = useNamespace("textarea");
		const input = /* @__PURE__ */ shallowRef();
		const textarea = /* @__PURE__ */ shallowRef();
		const hovering = /* @__PURE__ */ ref(false);
		const passwordVisible = /* @__PURE__ */ ref(false);
		const countStyle = /* @__PURE__ */ ref();
		const clearIconStyle = /* @__PURE__ */ ref();
		const textareaCalcStyle = /* @__PURE__ */ shallowRef(props.inputStyle);
		const saveValue = /* @__PURE__ */ ref("");
		const textareaHeight = /* @__PURE__ */ ref();
		const _ref = computed(() => input.value || textarea.value);
		const { wrapperRef, isFocused, handleFocus, handleBlur } = useFocusController(_ref, {
			disabled: inputDisabled,
			afterBlur() {
				if (props.validateEvent) elFormItem?.validate?.("blur").catch(NOOP);
			}
		});
		const needStatusIcon = computed(() => elForm?.statusIcon ?? false);
		const validateState = computed(() => elFormItem?.validateState || "");
		const validateIcon = computed(() => validateState.value && ValidateComponentsMap[validateState.value]);
		const passwordIcon = computed(() => passwordVisible.value ? view_default : hide_default);
		const containerStyle = computed(() => [rawAttrs.style]);
		const textareaStyle = computed(() => [
			props.inputStyle,
			textareaCalcStyle.value,
			{ resize: props.resize },
			textareaHeight.value ? { height: textareaHeight.value } : void 0
		]);
		const nativeInputValue = computed(() => isNil(props.modelValue) ? "" : String(props.modelValue));
		const renderClear = computed(() => props.clearable && !inputDisabled.value && !props.readonly);
		const showClear = computed(() => renderClear.value && !!nativeInputValue.value && (isFocused.value || hovering.value));
		const showPwdVisible = computed(() => props.showPassword && !inputDisabled.value && !!nativeInputValue.value);
		const isWordLimitVisible = computed(() => props.showWordLimit && !!maxlength.value && (props.type === "text" || props.type === "textarea") && !inputDisabled.value && !props.readonly && !props.showPassword);
		const textLength = computed(() => {
			if (props.countGraphemes && props.showWordLimit) return props.countGraphemes(nativeInputValue.value);
			return nativeInputValue.value.length;
		});
		const inputExceed = computed(() => !!isWordLimitVisible.value && textLength.value > Number(maxlength.value));
		const suffixVisible = computed(() => !!slots.suffix || !!props.suffixIcon || props.clearable || props.showPassword || isWordLimitVisible.value || !!validateState.value && needStatusIcon.value);
		const hasModelModifiers = computed(() => !!Object.keys(props.modelModifiers).length);
		const [recordCursor, setCursor] = useCursor(input);
		let rAFId;
		useResizeObserver(textarea, (entries) => {
			onceInitSizeTextarea();
			if (!isWordLimitVisible.value && !renderClear.value || props.resize !== "both" && props.resize !== "horizontal") return;
			const { width } = entries[0].target.getBoundingClientRect();
			const updateStyle = () => {
				rAFId = void 0;
				countStyle.value = { 
				/** right: 100% - (width - right(10)) */
right: `calc(100% - ${width - 10}px)` };
				clearIconStyle.value = { 
				/** right: 100% - (width - right(11)) */
right: `calc(100% - ${width - 11}px)` };
			};
			rAFId && cAF(rAFId);
			rAFId = rAF(updateStyle);
		});
		const resizeTextarea = () => {
			const { type, autosize } = props;
			if (!isClient || type !== "textarea" || !textarea.value) return;
			if (autosize) {
				const minRows = isObject$2(autosize) ? autosize.minRows : void 0;
				const maxRows = isObject$2(autosize) ? autosize.maxRows : void 0;
				const textareaStyle = calcTextareaHeight(textarea.value, minRows, maxRows);
				textareaCalcStyle.value = {
					overflowY: "hidden",
					...textareaStyle
				};
				nextTick(() => {
					textarea.value.offsetHeight;
					textareaCalcStyle.value = textareaStyle;
				});
			} else textareaCalcStyle.value = { minHeight: calcTextareaHeight(textarea.value).minHeight };
		};
		const createOnceInitResize = (resizeTextarea) => {
			let isInit = false;
			return () => {
				if (isInit || !props.autosize) {
					if (props.resize !== "none") setTimeout(() => {
						textareaHeight.value = textarea.value?.style.height;
					});
					return;
				}
				if (!(textarea.value?.offsetParent === null)) {
					setTimeout(resizeTextarea);
					isInit = true;
				}
			};
		};
		const onceInitSizeTextarea = createOnceInitResize(resizeTextarea);
		const setNativeInputValue = () => {
			const input = _ref.value;
			const formatterValue = props.formatter ? props.formatter(nativeInputValue.value) : nativeInputValue.value;
			if (!input || input.value === formatterValue || props.type === "file") return;
			input.value = formatterValue;
		};
		const formatValue = (value) => {
			const { trim, number } = props.modelModifiers;
			if (trim) value = value.trim();
			if (number) value = `${looseToNumber(value)}`;
			if (props.formatter && props.parser) value = props.parser(value);
			return value;
		};
		const handleInput = async (event) => {
			if (isComposing.value) return;
			const { lazy } = props.modelModifiers;
			let { value } = event.target;
			let shouldForceNativeUpdate = false;
			if (lazy) {
				emit(INPUT_EVENT, value);
				return;
			}
			value = formatValue(value);
			if (props.countGraphemes && maxlength.value != null) {
				const limit = Number(maxlength.value);
				const graphemes = props.countGraphemes(value);
				const saveGraphemes = props.countGraphemes(saveValue.value);
				if (graphemes > limit && graphemes > saveGraphemes) if (saveGraphemes > limit) {
					value = saveValue.value;
					shouldForceNativeUpdate = true;
				} else {
					const prevValue = saveValue.value;
					const nextValue = value;
					let prefixLen = 0;
					while (prefixLen < prevValue.length && prefixLen < nextValue.length && prevValue[prefixLen] === nextValue[prefixLen]) prefixLen++;
					let prevSuffixIndex = prevValue.length;
					let nextSuffixIndex = nextValue.length;
					while (prevSuffixIndex > prefixLen && nextSuffixIndex > prefixLen && prevValue[prevSuffixIndex - 1] === nextValue[nextSuffixIndex - 1]) {
						prevSuffixIndex--;
						nextSuffixIndex--;
					}
					const before = nextValue.slice(0, prefixLen);
					const removed = prevValue.slice(prefixLen, prevSuffixIndex);
					const inserted = nextValue.slice(prefixLen, nextSuffixIndex);
					const after = nextValue.slice(nextSuffixIndex);
					const baseCount = saveGraphemes - props.countGraphemes(removed);
					const availableInserted = Math.max(0, limit - baseCount);
					let acceptedInserted = "";
					if (availableInserted > 0) if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
						const segmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
						for (const { segment } of segmenter.segment(inserted)) {
							const candidate = acceptedInserted + segment;
							if (props.countGraphemes(candidate) > availableInserted) break;
							acceptedInserted = candidate;
						}
					} else for (const char of Array.from(inserted)) {
						const candidate = acceptedInserted + char;
						if (props.countGraphemes(candidate) > availableInserted) break;
						acceptedInserted = candidate;
					}
					value = before + acceptedInserted + after;
					shouldForceNativeUpdate = true;
				}
			}
			if (String(value) === nativeInputValue.value) {
				if (props.formatter || shouldForceNativeUpdate) {
					const target = event.target;
					const blockedValue = target.value;
					const selectionStart = target.selectionStart;
					const selectionEnd = target.selectionEnd;
					setNativeInputValue();
					if (shouldForceNativeUpdate && _ref.value && selectionStart != null && selectionEnd != null) {
						const restoredValue = _ref.value.value;
						const afterTxt = blockedValue.slice(Math.max(0, selectionEnd));
						let caretPos = Math.min(selectionStart, restoredValue.length);
						if (afterTxt && restoredValue.endsWith(afterTxt)) caretPos = restoredValue.length - afterTxt.length;
						_ref.value.setSelectionRange(caretPos, caretPos);
					}
				}
				return;
			}
			saveValue.value = value;
			recordCursor();
			emit(UPDATE_MODEL_EVENT, value);
			emit(INPUT_EVENT, value);
			await nextTick();
			if (props.formatter && props.parser || !hasModelModifiers.value) setNativeInputValue();
			setCursor();
		};
		const handleChange = async (event) => {
			let { value } = event.target;
			value = formatValue(value);
			if (props.modelModifiers.lazy) emit(UPDATE_MODEL_EVENT, value);
			emit(CHANGE_EVENT, value, event);
			await nextTick();
			setNativeInputValue();
		};
		const { isComposing, handleCompositionStart, handleCompositionUpdate, handleCompositionEnd } = useComposition({
			emit,
			afterComposition: handleInput
		});
		const handlePasswordVisible = () => {
			passwordVisible.value = !passwordVisible.value;
		};
		const focus = () => _ref.value?.focus();
		const blur = () => _ref.value?.blur();
		const handleMouseLeave = (evt) => {
			hovering.value = false;
			emit("mouseleave", evt);
		};
		const handleMouseEnter = (evt) => {
			hovering.value = true;
			emit("mouseenter", evt);
		};
		const handleKeydown = (evt) => {
			emit("keydown", evt);
		};
		const select = () => {
			_ref.value?.select();
		};
		const clear = (evt) => {
			emit(UPDATE_MODEL_EVENT, "");
			emit(CHANGE_EVENT, "");
			emit("clear", evt);
			emit(INPUT_EVENT, "");
		};
		watch(() => props.modelValue, () => {
			nextTick(() => {
				resizeTextarea();
				if (props.autosize) textareaHeight.value = void 0;
			});
			if (props.validateEvent) elFormItem?.validate?.("change").catch(NOOP);
		});
		watch(() => nativeInputValue.value, (val) => {
			saveValue.value = val;
		}, { immediate: true });
		watch(nativeInputValue, (newValue) => {
			if (!_ref.value) return;
			const { trim, number } = props.modelModifiers;
			const elValue = _ref.value.value;
			const displayValue = (number || props.type === "number") && !/^0\d/.test(elValue) ? `${looseToNumber(elValue)}` : elValue;
			if (displayValue === newValue) return;
			if (document.activeElement === _ref.value && _ref.value.type !== "range") {
				if (trim && displayValue.trim() === newValue) return;
			}
			setNativeInputValue();
		});
		watch(() => props.type, async () => {
			await nextTick();
			setNativeInputValue();
			resizeTextarea();
		});
		onMounted(() => {
			if (!props.formatter && props.parser) debugWarn(COMPONENT_NAME$6, "If you set the parser, you also need to set the formatter.");
			setNativeInputValue();
			nextTick(resizeTextarea);
		});
		onBeforeUnmount(() => {
			rAFId && cAF(rAFId);
		});
		__expose({
			/** @description HTML input element */
			input,
			/** @description HTML textarea element */
			textarea,
			/** @description HTML element, input or textarea */
			ref: _ref,
			/** @description style of textarea. */
			textareaStyle,
			/** @description from props (used on unit test) */
			autosize: /* @__PURE__ */ toRef(props, "autosize"),
			/** @description is input composing */
			isComposing,
			/** @description whether the password is visible */
			passwordVisible,
			/** @description HTML input element native method */
			focus,
			/** @description HTML input element native method */
			blur,
			/** @description HTML input element native method */
			select,
			/** @description clear input value */
			clear,
			/** @description resize textarea. */
			resizeTextarea
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				class: normalizeClass([containerKls.value, {
					[unref(nsInput).bm("group", "append")]: _ctx.$slots.append,
					[unref(nsInput).bm("group", "prepend")]: _ctx.$slots.prepend
				}]),
				style: normalizeStyle(containerStyle.value),
				onMouseenter: handleMouseEnter,
				onMouseleave: handleMouseLeave
			}, [createCommentVNode(" input "), __props.type !== "textarea" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
				createCommentVNode(" prepend slot "),
				_ctx.$slots.prepend ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: normalizeClass(unref(nsInput).be("group", "prepend"))
				}, [renderSlot(_ctx.$slots, "prepend")], 2)) : createCommentVNode("v-if", true),
				createBaseVNode("div", {
					ref_key: "wrapperRef",
					ref: wrapperRef,
					class: normalizeClass(wrapperKls.value)
				}, [
					createCommentVNode(" prefix slot "),
					_ctx.$slots.prefix || __props.prefixIcon ? (openBlock(), createElementBlock("span", {
						key: 0,
						class: normalizeClass(unref(nsInput).e("prefix"))
					}, [createBaseVNode("span", { class: normalizeClass(unref(nsInput).e("prefix-inner")) }, [renderSlot(_ctx.$slots, "prefix"), __props.prefixIcon ? (openBlock(), createBlock(unref(ElIcon), {
						key: 0,
						class: normalizeClass(unref(nsInput).e("icon"))
					}, {
						default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(__props.prefixIcon)))]),
						_: 1
					}, 8, ["class"])) : createCommentVNode("v-if", true)], 2)], 2)) : createCommentVNode("v-if", true),
					createBaseVNode("input", mergeProps({
						id: unref(inputId),
						ref_key: "input",
						ref: input,
						class: unref(nsInput).e("inner")
					}, unref(attrs), {
						name: __props.name,
						minlength: __props.countGraphemes ? void 0 : __props.minlength,
						maxlength: __props.countGraphemes ? void 0 : maxlength.value,
						type: __props.showPassword ? passwordVisible.value ? "text" : "password" : __props.type,
						disabled: unref(inputDisabled),
						readonly: __props.readonly,
						autocomplete: __props.autocomplete,
						tabindex: __props.tabindex,
						"aria-label": __props.ariaLabel,
						placeholder: __props.placeholder,
						style: __props.inputStyle,
						form: __props.form,
						autofocus: __props.autofocus,
						role: __props.containerRole,
						inputmode: __props.inputmode,
						onCompositionstart: _cache[0] || (_cache[0] = (...args) => unref(handleCompositionStart) && unref(handleCompositionStart)(...args)),
						onCompositionupdate: _cache[1] || (_cache[1] = (...args) => unref(handleCompositionUpdate) && unref(handleCompositionUpdate)(...args)),
						onCompositionend: _cache[2] || (_cache[2] = (...args) => unref(handleCompositionEnd) && unref(handleCompositionEnd)(...args)),
						onInput: handleInput,
						onChange: handleChange,
						onKeydown: handleKeydown
					}), null, 16, _hoisted_1$19),
					createCommentVNode(" suffix slot "),
					suffixVisible.value ? (openBlock(), createElementBlock("span", {
						key: 1,
						class: normalizeClass(unref(nsInput).e("suffix"))
					}, [createBaseVNode("span", { class: normalizeClass(unref(nsInput).e("suffix-inner")) }, [
						renderClear.value ? (openBlock(), createBlock(unref(ElIcon), {
							key: 0,
							class: normalizeClass([unref(nsInput).e("icon"), unref(nsInput).e("clear")]),
							style: normalizeStyle({ visibility: showClear.value ? "visible" : "hidden" }),
							onMousedown: withModifiers(unref(NOOP), ["prevent"]),
							onClick: clear
						}, {
							default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(__props.clearIcon)))]),
							_: 1
						}, 8, [
							"class",
							"style",
							"onMousedown"
						])) : createCommentVNode("v-if", true),
						!showClear.value || !showPwdVisible.value || !isWordLimitVisible.value ? (openBlock(), createElementBlock(Fragment, { key: 1 }, [renderSlot(_ctx.$slots, "suffix"), __props.suffixIcon ? (openBlock(), createBlock(unref(ElIcon), {
							key: 0,
							class: normalizeClass(unref(nsInput).e("icon"))
						}, {
							default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(__props.suffixIcon)))]),
							_: 1
						}, 8, ["class"])) : createCommentVNode("v-if", true)], 64)) : createCommentVNode("v-if", true),
						showPwdVisible.value ? (openBlock(), createBlock(unref(ElIcon), {
							key: 2,
							class: normalizeClass([unref(nsInput).e("icon"), unref(nsInput).e("password")]),
							onClick: handlePasswordVisible,
							onMousedown: withModifiers(unref(NOOP), ["prevent"]),
							onMouseup: withModifiers(unref(NOOP), ["prevent"])
						}, {
							default: withCtx(() => [renderSlot(_ctx.$slots, "password-icon", { visible: passwordVisible.value }, () => [(openBlock(), createBlock(resolveDynamicComponent(passwordIcon.value)))])]),
							_: 3
						}, 8, [
							"class",
							"onMousedown",
							"onMouseup"
						])) : createCommentVNode("v-if", true),
						isWordLimitVisible.value ? (openBlock(), createElementBlock("span", {
							key: 3,
							class: normalizeClass([unref(nsInput).e("count"), unref(nsInput).is("outside", __props.wordLimitPosition === "outside")])
						}, [createBaseVNode("span", { class: normalizeClass(unref(nsInput).e("count-inner")) }, toDisplayString(textLength.value) + " / " + toDisplayString(maxlength.value), 3)], 2)) : createCommentVNode("v-if", true),
						validateState.value && validateIcon.value && needStatusIcon.value ? (openBlock(), createBlock(unref(ElIcon), {
							key: 4,
							class: normalizeClass([
								unref(nsInput).e("icon"),
								unref(nsInput).e("validateIcon"),
								unref(nsInput).is("loading", validateState.value === "validating")
							])
						}, {
							default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(validateIcon.value)))]),
							_: 1
						}, 8, ["class"])) : createCommentVNode("v-if", true)
					], 2)], 2)) : createCommentVNode("v-if", true)
				], 2),
				createCommentVNode(" append slot "),
				_ctx.$slots.append ? (openBlock(), createElementBlock("div", {
					key: 1,
					class: normalizeClass(unref(nsInput).be("group", "append"))
				}, [renderSlot(_ctx.$slots, "append")], 2)) : createCommentVNode("v-if", true)
			], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
				createCommentVNode(" textarea "),
				createBaseVNode("textarea", mergeProps({
					id: unref(inputId),
					ref_key: "textarea",
					ref: textarea,
					class: [
						unref(nsTextarea).e("inner"),
						unref(nsInput).is("focus", unref(isFocused)),
						unref(nsTextarea).is("clearable", __props.clearable)
					]
				}, unref(attrs), {
					name: __props.name,
					minlength: __props.countGraphemes ? void 0 : __props.minlength,
					maxlength: __props.countGraphemes ? void 0 : maxlength.value,
					tabindex: __props.tabindex,
					disabled: unref(inputDisabled),
					readonly: __props.readonly,
					autocomplete: __props.autocomplete,
					style: textareaStyle.value,
					"aria-label": __props.ariaLabel,
					placeholder: __props.placeholder,
					form: __props.form,
					autofocus: __props.autofocus,
					rows: __props.rows,
					role: __props.containerRole,
					inputmode: __props.inputmode,
					onCompositionstart: _cache[3] || (_cache[3] = (...args) => unref(handleCompositionStart) && unref(handleCompositionStart)(...args)),
					onCompositionupdate: _cache[4] || (_cache[4] = (...args) => unref(handleCompositionUpdate) && unref(handleCompositionUpdate)(...args)),
					onCompositionend: _cache[5] || (_cache[5] = (...args) => unref(handleCompositionEnd) && unref(handleCompositionEnd)(...args)),
					onInput: handleInput,
					onFocus: _cache[6] || (_cache[6] = (...args) => unref(handleFocus) && unref(handleFocus)(...args)),
					onBlur: _cache[7] || (_cache[7] = (...args) => unref(handleBlur) && unref(handleBlur)(...args)),
					onChange: handleChange,
					onKeydown: handleKeydown
				}), null, 16, _hoisted_2$10),
				showClear.value ? (openBlock(), createBlock(unref(ElIcon), {
					key: 0,
					class: normalizeClass([unref(nsTextarea).e("icon"), unref(nsTextarea).e("clear")]),
					style: normalizeStyle(clearIconStyle.value),
					onMousedown: withModifiers(unref(NOOP), ["prevent"]),
					onClick: clear
				}, {
					default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(__props.clearIcon)))]),
					_: 1
				}, 8, [
					"class",
					"style",
					"onMousedown"
				])) : createCommentVNode("v-if", true),
				isWordLimitVisible.value ? (openBlock(), createElementBlock("span", {
					key: 1,
					style: normalizeStyle(countStyle.value),
					class: normalizeClass([unref(nsInput).e("count"), unref(nsInput).is("outside", __props.wordLimitPosition === "outside")])
				}, toDisplayString(textLength.value) + " / " + toDisplayString(maxlength.value), 7)) : createCommentVNode("v-if", true)
			], 64))], 38);
		};
	}
}));
//#endregion
//#region node_modules/element-plus/es/components/scrollbar/src/scrollbar.mjs
/**
* @deprecated Removed after 3.0.0, Use `ScrollbarProps` instead.
*/
var scrollbarProps = buildProps({
	/**
	* @description trigger distance(px)
	*/
	distance: {
		type: Number,
		default: 0
	},
	/**
	* @description height of scrollbar
	*/
	height: {
		type: [String, Number],
		default: ""
	},
	/**
	* @description max height of scrollbar
	*/
	maxHeight: {
		type: [String, Number],
		default: ""
	},
	/**
	* @description whether to use the native scrollbar
	*/
	native: Boolean,
	/**
	* @description style of wrap
	*/
	wrapStyle: {
		type: definePropType([
			String,
			Object,
			Array,
			Boolean
		]),
		default: ""
	},
	/**
	* @description class of wrap
	*/
	wrapClass: {
		type: [String, Array],
		default: ""
	},
	/**
	* @description class of view
	*/
	viewClass: {
		type: [String, Array],
		default: ""
	},
	/**
	* @description style of view
	*/
	viewStyle: {
		type: definePropType([
			String,
			Object,
			Array,
			Boolean
		]),
		default: ""
	},
	/**
	* @description do not respond to container size changes, if the container size does not change, it is better to set it to optimize performance
	*/
	noresize: Boolean,
	/**
	* @description element tag of the view
	*/
	tag: {
		type: String,
		default: "div"
	},
	/**
	* @description always show
	*/
	always: Boolean,
	/**
	* @description minimum size of scrollbar
	*/
	minSize: {
		type: Number,
		default: 20
	},
	/**
	* @description Wrap tabindex
	*/
	tabindex: {
		type: [String, Number],
		default: void 0
	},
	/**
	* @description id of view
	*/
	id: String,
	/**
	* @description role of view
	*/
	role: String,
	...useAriaProps(["ariaLabel", "ariaOrientation"])
});
var scrollbarEmits = {
	"end-reached": (direction) => [
		"left",
		"right",
		"top",
		"bottom"
	].includes(direction),
	scroll: ({ scrollTop, scrollLeft }) => [scrollTop, scrollLeft].every(isNumber)
};
//#endregion
//#region node_modules/element-plus/es/components/scrollbar/src/util.mjs
var BAR_MAP = {
	vertical: {
		offset: "offsetHeight",
		scroll: "scrollTop",
		scrollSize: "scrollHeight",
		size: "height",
		key: "vertical",
		axis: "Y",
		client: "clientY",
		direction: "top"
	},
	horizontal: {
		offset: "offsetWidth",
		scroll: "scrollLeft",
		scrollSize: "scrollWidth",
		size: "width",
		key: "horizontal",
		axis: "X",
		client: "clientX",
		direction: "left"
	}
};
var renderThumbStyle = ({ move, size, bar }) => ({
	[bar.size]: size,
	transform: `translate${bar.axis}(${move}%)`
});
//#endregion
//#region node_modules/element-plus/es/components/scrollbar/src/thumb.mjs
/**
* @deprecated Removed after 3.0.0, Use `ThumbProps` instead.
*/
var thumbProps = buildProps({
	vertical: Boolean,
	size: String,
	move: Number,
	ratio: {
		type: Number,
		required: true
	},
	always: Boolean
});
//#endregion
//#region node_modules/element-plus/es/components/scrollbar/src/constants.mjs
var scrollbarContextKey = Symbol("scrollbarContextKey");
//#endregion
//#region node_modules/element-plus/es/utils/numbers.mjs
/**
* Due to browser rendering and calculation precision loss issues,
* boundary checks cannot be based solely on value equality;
* a certain range of fluctuation is permissible.
*/
function isGreaterThan(a, b, epsilon = .03) {
	return a - b > epsilon;
}
//#endregion
//#region node_modules/element-plus/es/components/scrollbar/src/bar.mjs
/**
* @deprecated Removed after 3.0.0, Use `BarProps` instead.
*/
var barProps = buildProps({
	always: {
		type: Boolean,
		default: true
	},
	minSize: {
		type: Number,
		required: true
	}
});
//#endregion
//#region node_modules/element-plus/es/components/scrollbar/src/thumb.vue_vue_type_script_setup_true_lang.mjs
var COMPONENT_NAME$5 = "Thumb";
//#endregion
//#region node_modules/element-plus/es/components/scrollbar/src/thumb2.mjs
var thumb_default = /* @__PURE__ */ defineComponent({
	__name: "thumb",
	props: thumbProps,
	setup(__props) {
		const props = __props;
		const scrollbar = inject(scrollbarContextKey);
		const ns = useNamespace("scrollbar");
		if (!scrollbar) throwError(COMPONENT_NAME$5, "can not inject scrollbar context");
		const instance = /* @__PURE__ */ ref();
		const thumb = /* @__PURE__ */ ref();
		const thumbState = /* @__PURE__ */ ref({});
		const visible = /* @__PURE__ */ ref(false);
		let cursorDown = false;
		let cursorLeave = false;
		let baseScrollHeight = 0;
		let baseScrollWidth = 0;
		let originalOnSelectStart = isClient ? document.onselectstart : null;
		const bar = computed(() => BAR_MAP[props.vertical ? "vertical" : "horizontal"]);
		const thumbStyle = computed(() => renderThumbStyle({
			size: props.size,
			move: props.move,
			bar: bar.value
		}));
		const offsetRatio = computed(() => instance.value[bar.value.offset] ** 2 / scrollbar.wrapElement[bar.value.scrollSize] / props.ratio / thumb.value[bar.value.offset]);
		const clickThumbHandler = (e) => {
			e.stopPropagation();
			if (e.ctrlKey || [1, 2].includes(e.button)) return;
			window.getSelection()?.removeAllRanges();
			startDrag(e);
			const el = e.currentTarget;
			if (!el) return;
			thumbState.value[bar.value.axis] = el[bar.value.offset] - (e[bar.value.client] - el.getBoundingClientRect()[bar.value.direction]);
		};
		const clickTrackHandler = (e) => {
			if (!thumb.value || !instance.value || !scrollbar.wrapElement) return;
			const thumbPositionPercentage = (Math.abs(e.target.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]) - thumb.value[bar.value.offset] / 2) * 100 * offsetRatio.value / instance.value[bar.value.offset];
			scrollbar.wrapElement[bar.value.scroll] = thumbPositionPercentage * scrollbar.wrapElement[bar.value.scrollSize] / 100;
		};
		const startDrag = (e) => {
			e.stopImmediatePropagation();
			cursorDown = true;
			baseScrollHeight = scrollbar.wrapElement.scrollHeight;
			baseScrollWidth = scrollbar.wrapElement.scrollWidth;
			document.addEventListener("mousemove", mouseMoveDocumentHandler);
			document.addEventListener("mouseup", mouseUpDocumentHandler);
			originalOnSelectStart = document.onselectstart;
			document.onselectstart = () => false;
		};
		const mouseMoveDocumentHandler = (e) => {
			if (!instance.value || !thumb.value) return;
			if (cursorDown === false) return;
			const prevPage = thumbState.value[bar.value.axis];
			if (!prevPage) return;
			const thumbPositionPercentage = ((instance.value.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]) * -1 - (thumb.value[bar.value.offset] - prevPage)) * 100 * offsetRatio.value / instance.value[bar.value.offset];
			if (bar.value.scroll === "scrollLeft") scrollbar.wrapElement[bar.value.scroll] = thumbPositionPercentage * baseScrollWidth / 100;
			else scrollbar.wrapElement[bar.value.scroll] = thumbPositionPercentage * baseScrollHeight / 100;
		};
		const mouseUpDocumentHandler = () => {
			cursorDown = false;
			thumbState.value[bar.value.axis] = 0;
			document.removeEventListener("mousemove", mouseMoveDocumentHandler);
			document.removeEventListener("mouseup", mouseUpDocumentHandler);
			restoreOnselectstart();
			if (cursorLeave) visible.value = false;
		};
		const mouseMoveScrollbarHandler = () => {
			cursorLeave = false;
			visible.value = !!props.size;
		};
		const mouseLeaveScrollbarHandler = () => {
			cursorLeave = true;
			visible.value = cursorDown;
		};
		onBeforeUnmount(() => {
			restoreOnselectstart();
			document.removeEventListener("mouseup", mouseUpDocumentHandler);
		});
		const restoreOnselectstart = () => {
			if (document.onselectstart !== originalOnSelectStart) document.onselectstart = originalOnSelectStart;
		};
		useEventListener(/* @__PURE__ */ toRef(scrollbar, "scrollbarElement"), "mousemove", mouseMoveScrollbarHandler);
		useEventListener(/* @__PURE__ */ toRef(scrollbar, "scrollbarElement"), "mouseleave", mouseLeaveScrollbarHandler);
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Transition, {
				name: unref(ns).b("fade"),
				persisted: ""
			}, {
				default: withCtx(() => [withDirectives(createBaseVNode("div", {
					ref_key: "instance",
					ref: instance,
					class: normalizeClass([unref(ns).e("bar"), unref(ns).is(bar.value.key)]),
					onMousedown: clickTrackHandler,
					onClick: _cache[0] || (_cache[0] = withModifiers(() => {}, ["stop"]))
				}, [createBaseVNode("div", {
					ref_key: "thumb",
					ref: thumb,
					class: normalizeClass(unref(ns).e("thumb")),
					style: normalizeStyle(thumbStyle.value),
					onMousedown: clickThumbHandler
				}, null, 38)], 34), [[vShow, __props.always || visible.value]])]),
				_: 1
			}, 8, ["name"]);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/scrollbar/src/bar2.mjs
var bar_default = /* @__PURE__ */ defineComponent({
	__name: "bar",
	props: barProps,
	setup(__props, { expose: __expose }) {
		const props = __props;
		const scrollbar = inject(scrollbarContextKey);
		const moveX = /* @__PURE__ */ ref(0);
		const moveY = /* @__PURE__ */ ref(0);
		const sizeWidth = /* @__PURE__ */ ref("");
		const sizeHeight = /* @__PURE__ */ ref("");
		const ratioY = /* @__PURE__ */ ref(1);
		const ratioX = /* @__PURE__ */ ref(1);
		const handleScroll = (wrap) => {
			if (wrap) {
				const offsetHeight = wrap.offsetHeight - 4;
				const offsetWidth = wrap.offsetWidth - 4;
				moveY.value = wrap.scrollTop * 100 / offsetHeight * ratioY.value;
				moveX.value = wrap.scrollLeft * 100 / offsetWidth * ratioX.value;
			}
		};
		const update = () => {
			const wrap = scrollbar?.wrapElement;
			if (!wrap) return;
			const offsetHeight = wrap.offsetHeight - 4;
			const offsetWidth = wrap.offsetWidth - 4;
			const originalHeight = offsetHeight ** 2 / wrap.scrollHeight;
			const originalWidth = offsetWidth ** 2 / wrap.scrollWidth;
			const height = Math.max(originalHeight, props.minSize);
			const width = Math.max(originalWidth, props.minSize);
			ratioY.value = originalHeight / (offsetHeight - originalHeight) / (height / (offsetHeight - height));
			ratioX.value = originalWidth / (offsetWidth - originalWidth) / (width / (offsetWidth - width));
			sizeHeight.value = height + 4 < offsetHeight ? `${height}px` : "";
			sizeWidth.value = width + 4 < offsetWidth ? `${width}px` : "";
		};
		__expose({
			handleScroll,
			update
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock(Fragment, null, [createVNode(thumb_default, {
				move: moveX.value,
				ratio: ratioX.value,
				size: sizeWidth.value,
				always: __props.always
			}, null, 8, [
				"move",
				"ratio",
				"size",
				"always"
			]), createVNode(thumb_default, {
				move: moveY.value,
				ratio: ratioY.value,
				size: sizeHeight.value,
				vertical: "",
				always: __props.always
			}, null, 8, [
				"move",
				"ratio",
				"size",
				"always"
			])], 64);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/scrollbar/src/scrollbar.vue_vue_type_script_setup_true_lang.mjs
var _hoisted_1$18 = ["tabindex"];
var COMPONENT_NAME$4 = "ElScrollbar";
//#endregion
//#region node_modules/element-plus/es/components/scrollbar/index.mjs
var ElScrollbar = withInstall(/* @__PURE__ */ defineComponent({
	name: COMPONENT_NAME$4,
	__name: "scrollbar",
	props: scrollbarProps,
	emits: scrollbarEmits,
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const ns = useNamespace("scrollbar");
		let stopResizeObserver = void 0;
		let stopWrapResizeObserver = void 0;
		let stopResizeListener = void 0;
		let wrapScrollTop = 0;
		let wrapScrollLeft = 0;
		let direction = "";
		const distanceScrollState = {
			bottom: false,
			top: false,
			right: false,
			left: false
		};
		const scrollbarRef = /* @__PURE__ */ ref();
		const wrapRef = /* @__PURE__ */ ref();
		const resizeRef = /* @__PURE__ */ ref();
		const barRef = /* @__PURE__ */ ref();
		const wrapStyle = computed(() => {
			const style = {};
			const height = addUnit(props.height);
			const maxHeight = addUnit(props.maxHeight);
			if (height) style.height = height;
			if (maxHeight) style.maxHeight = maxHeight;
			return [props.wrapStyle, style];
		});
		const wrapKls = computed(() => {
			return [
				props.wrapClass,
				ns.e("wrap"),
				{ [ns.em("wrap", "hidden-default")]: !props.native }
			];
		});
		const resizeKls = computed(() => {
			return [ns.e("view"), props.viewClass];
		});
		const shouldSkipDirection = (direction) => {
			return distanceScrollState[direction] ?? false;
		};
		const DIRECTION_PAIRS = {
			top: "bottom",
			bottom: "top",
			left: "right",
			right: "left"
		};
		const updateTriggerStatus = (arrivedStates) => {
			const oppositeDirection = DIRECTION_PAIRS[direction];
			if (!oppositeDirection) return;
			const arrived = arrivedStates[direction];
			const oppositeArrived = arrivedStates[oppositeDirection];
			if (arrived && !distanceScrollState[direction]) distanceScrollState[direction] = true;
			if (!oppositeArrived && distanceScrollState[oppositeDirection]) distanceScrollState[oppositeDirection] = false;
		};
		const handleScroll = () => {
			if (wrapRef.value) {
				barRef.value?.handleScroll(wrapRef.value);
				const prevTop = wrapScrollTop;
				const prevLeft = wrapScrollLeft;
				wrapScrollTop = wrapRef.value.scrollTop;
				wrapScrollLeft = wrapRef.value.scrollLeft;
				const arrivedStates = {
					bottom: !isGreaterThan(wrapRef.value.scrollHeight - props.distance, wrapRef.value.clientHeight + wrapScrollTop),
					top: wrapScrollTop <= props.distance && prevTop !== 0,
					right: !isGreaterThan(wrapRef.value.scrollWidth - props.distance, wrapRef.value.clientWidth + wrapScrollLeft) && prevLeft !== wrapScrollLeft,
					left: wrapScrollLeft <= props.distance && prevLeft !== 0
				};
				emit("scroll", {
					scrollTop: wrapScrollTop,
					scrollLeft: wrapScrollLeft
				});
				if (prevTop !== wrapScrollTop) direction = wrapScrollTop > prevTop ? "bottom" : "top";
				if (prevLeft !== wrapScrollLeft) direction = wrapScrollLeft > prevLeft ? "right" : "left";
				if (props.distance > 0) {
					if (shouldSkipDirection(direction)) return;
					updateTriggerStatus(arrivedStates);
				}
				if (arrivedStates[direction]) emit("end-reached", direction);
			}
		};
		function scrollTo(arg1, arg2) {
			if (isObject$2(arg1)) wrapRef.value.scrollTo(arg1);
			else if (isNumber(arg1) && isNumber(arg2)) wrapRef.value.scrollTo(arg1, arg2);
		}
		const setScrollTop = (value) => {
			if (!isNumber(value)) {
				debugWarn(COMPONENT_NAME$4, "value must be a number");
				return;
			}
			wrapRef.value.scrollTop = value;
		};
		const setScrollLeft = (value) => {
			if (!isNumber(value)) {
				debugWarn(COMPONENT_NAME$4, "value must be a number");
				return;
			}
			wrapRef.value.scrollLeft = value;
		};
		const update = () => {
			barRef.value?.update();
			distanceScrollState[direction] = false;
			if (wrapRef.value) barRef.value?.handleScroll(wrapRef.value);
		};
		watch(() => props.noresize, (noresize) => {
			if (noresize) {
				stopResizeObserver?.();
				stopWrapResizeObserver?.();
				stopResizeListener?.();
			} else {
				({stop: stopResizeObserver} = useResizeObserver(resizeRef, update));
				({stop: stopWrapResizeObserver} = useResizeObserver(wrapRef, update));
				stopResizeListener = useEventListener("resize", update);
			}
		}, { immediate: true });
		watch(() => [props.maxHeight, props.height], () => {
			if (!props.native) nextTick(() => {
				update();
			});
		});
		provide(scrollbarContextKey, /* @__PURE__ */ reactive({
			scrollbarElement: scrollbarRef,
			wrapElement: wrapRef
		}));
		onActivated(() => {
			if (wrapRef.value) {
				wrapRef.value.scrollTop = wrapScrollTop;
				wrapRef.value.scrollLeft = wrapScrollLeft;
			}
		});
		onMounted(() => {
			if (!props.native) nextTick(() => {
				update();
			});
		});
		onUpdated(() => update());
		__expose({
			/** @description scrollbar wrap ref */
			wrapRef,
			/** @description update scrollbar state manually */
			update,
			/** @description scrolls to a particular set of coordinates */
			scrollTo,
			/** @description set distance to scroll top */
			setScrollTop,
			/** @description set distance to scroll left */
			setScrollLeft,
			/** @description handle scroll event */
			handleScroll
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref_key: "scrollbarRef",
				ref: scrollbarRef,
				class: normalizeClass(unref(ns).b())
			}, [createBaseVNode("div", {
				ref_key: "wrapRef",
				ref: wrapRef,
				class: normalizeClass(wrapKls.value),
				style: normalizeStyle(wrapStyle.value),
				tabindex: __props.tabindex,
				onScroll: handleScroll
			}, [(openBlock(), createBlock(resolveDynamicComponent(__props.tag), {
				id: __props.id,
				ref_key: "resizeRef",
				ref: resizeRef,
				class: normalizeClass(resizeKls.value),
				style: normalizeStyle(__props.viewStyle),
				role: __props.role,
				"aria-label": __props.ariaLabel,
				"aria-orientation": __props.ariaOrientation
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
				_: 3
			}, 8, [
				"id",
				"class",
				"style",
				"role",
				"aria-label",
				"aria-orientation"
			]))], 46, _hoisted_1$18), !__props.native ? (openBlock(), createBlock(bar_default, {
				key: 0,
				ref_key: "barRef",
				ref: barRef,
				always: __props.always,
				"min-size": __props.minSize
			}, null, 8, ["always", "min-size"])) : createCommentVNode("v-if", true)], 2);
		};
	}
}));
//#endregion
//#region node_modules/element-plus/es/components/badge/index.mjs
var ElBadge = withInstall(/* @__PURE__ */ defineComponent({
	name: "ElBadge",
	__name: "badge",
	props: buildProps({
		/**
		* @description display value.
		*/
		value: {
			type: [String, Number],
			default: ""
		},
		/**
		* @description maximum value, shows `{max}+` when exceeded. Only works if value is a number.
		*/
		max: {
			type: Number,
			default: 99
		},
		/**
		* @description if a little dot is displayed.
		*/
		isDot: Boolean,
		/**
		* @description hidden badge.
		*/
		hidden: Boolean,
		/**
		* @description badge type.
		*/
		type: {
			type: String,
			values: [
				"primary",
				"success",
				"warning",
				"info",
				"danger"
			],
			default: "danger"
		},
		/**
		* @description whether to show badge when value is zero.
		*/
		showZero: {
			type: Boolean,
			default: true
		},
		/**
		* @description customize dot background color
		*/
		color: String,
		/**
		* @description CSS style of badge
		*/
		badgeStyle: {
			type: definePropType([
				String,
				Object,
				Array,
				Boolean
			]),
			default: void 0
		},
		/**
		* @description set offset of the badge
		*/
		offset: {
			type: definePropType(Array),
			default: () => [0, 0]
		},
		/**
		* @description custom class name of badge
		*/
		badgeClass: { type: String }
	}),
	setup(__props, { expose: __expose }) {
		const props = __props;
		const ns = useNamespace("badge");
		const content = computed(() => {
			if (props.isDot) return "";
			if (isNumber(props.value) && isNumber(props.max)) return props.max < props.value ? `${props.max}+` : `${props.value}`;
			return `${props.value}`;
		});
		const style = computed(() => {
			return [{
				backgroundColor: props.color,
				marginRight: addUnit(-props.offset[0]),
				marginTop: addUnit(props.offset[1])
			}, props.badgeStyle ?? {}];
		});
		__expose({ 
		/** @description badge content */
content });
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", { class: normalizeClass(unref(ns).b()) }, [renderSlot(_ctx.$slots, "default"), createVNode(Transition, { name: `${unref(ns).namespace.value}-zoom-in-center` }, {
				default: withCtx(() => [!__props.hidden && (content.value || __props.isDot || _ctx.$slots.content) ? (openBlock(), createElementBlock("sup", {
					key: 0,
					class: normalizeClass([
						unref(ns).e("content"),
						unref(ns).em("content", __props.type),
						unref(ns).is("fixed", !!_ctx.$slots.default),
						unref(ns).is("dot", __props.isDot),
						unref(ns).is("hide-zero", !__props.showZero && __props.value === 0),
						__props.badgeClass
					]),
					style: normalizeStyle(style.value)
				}, [renderSlot(_ctx.$slots, "content", { value: content.value }, () => [createTextVNode(toDisplayString(content.value), 1)])], 6)) : createCommentVNode("v-if", true)]),
				_: 3
			}, 8, ["name"])], 2);
		};
	}
}));
//#endregion
//#region node_modules/element-plus/es/components/button/src/button.mjs
var buttonTypes = [
	"default",
	"primary",
	"success",
	"warning",
	"info",
	"danger",
	"text",
	""
];
/**
* @deprecated Removed after 3.0.0, Use `ButtonProps` instead.
*/
var buttonProps = buildProps({
	/**
	* @description button size
	*/
	size: useSizeProp,
	/**
	* @description disable the button
	*/
	disabled: {
		type: Boolean,
		default: void 0
	},
	/**
	* @description button type
	*/
	type: {
		type: String,
		values: buttonTypes,
		default: ""
	},
	/**
	* @description icon component
	*/
	icon: { type: iconPropType },
	/**
	* @description native button type
	*/
	nativeType: {
		type: String,
		values: [
			"button",
			"submit",
			"reset"
		],
		default: "button"
	},
	/**
	* @description determine whether it's loading
	*/
	loading: Boolean,
	/**
	* @description customize loading icon component
	*/
	loadingIcon: {
		type: iconPropType,
		default: () => loading_default
	},
	/**
	* @description determine whether it's a plain button
	*/
	plain: {
		type: Boolean,
		default: void 0
	},
	/**
	* @description determine whether it's a text button
	*/
	text: {
		type: Boolean,
		default: void 0
	},
	/**
	* @description determine whether it's a link button
	*/
	link: Boolean,
	/**
	* @description determine whether the text button background color is always on
	*/
	bg: Boolean,
	/**
	* @description native button autofocus
	*/
	autofocus: Boolean,
	/**
	* @description determine whether it's a round button
	*/
	round: {
		type: Boolean,
		default: void 0
	},
	/**
	* @description determine whether it's a circle button
	*/
	circle: Boolean,
	/**
	* @description determine whether it's a dashed button
	*/
	dashed: {
		type: Boolean,
		default: void 0
	},
	/**
	* @description custom button color, automatically calculate `hover` and `active` color
	*/
	color: String,
	/**
	* @description dark mode, which automatically converts `color` to dark mode colors
	*/
	dark: Boolean,
	/**
	* @description automatically insert a space between two chinese characters
	*/
	autoInsertSpace: {
		type: Boolean,
		default: void 0
	},
	/**
	* @description custom element tag
	*/
	tag: {
		type: definePropType([String, Object]),
		default: "button"
	}
});
var buttonEmits = { click: (evt) => evt instanceof MouseEvent };
//#endregion
//#region node_modules/element-plus/es/components/config-provider/src/constants.mjs
var configProviderContextKey = Symbol();
//#endregion
//#region node_modules/element-plus/es/components/config-provider/src/hooks/use-global-config.mjs
var globalConfig = /* @__PURE__ */ ref();
function useGlobalConfig(key, defaultValue = void 0) {
	const config = getCurrentInstance() ? inject(configProviderContextKey, globalConfig) : globalConfig;
	if (key) return computed(() => config.value?.[key] ?? defaultValue);
	else return config;
}
function useGlobalComponentSettings(block, sizeFallback) {
	const config = useGlobalConfig();
	const ns = useNamespace(block, computed(() => config.value?.namespace || "el"));
	const locale = useLocale(computed(() => config.value?.locale));
	const zIndex = useZIndex(computed(() => {
		const zIndex = config.value?.zIndex;
		return isNil(zIndex) || Number.isNaN(zIndex) ? defaultInitialZIndex : zIndex;
	}));
	const size = computed(() => unref(sizeFallback) || config.value?.size || "");
	provideGlobalConfig(computed(() => unref(config) || {}));
	return {
		ns,
		locale,
		zIndex,
		size
	};
}
var provideGlobalConfig = (config, app, global = false) => {
	const inSetup = !!getCurrentInstance();
	const oldConfig = inSetup ? useGlobalConfig() : void 0;
	const provideFn = app?.provide ?? (inSetup ? provide : void 0);
	if (!provideFn) {
		debugWarn("provideGlobalConfig", "provideGlobalConfig() can only be used inside setup().");
		return;
	}
	const context = computed(() => {
		const cfg = unref(config);
		if (!oldConfig?.value) return cfg;
		return mergeConfig(oldConfig.value, cfg);
	});
	provideFn(configProviderContextKey, context);
	provideFn(localeContextKey, computed(() => context.value.locale));
	provideFn(namespaceContextKey, computed(() => context.value.namespace));
	provideFn(zIndexContextKey, computed(() => context.value.zIndex));
	provideFn(SIZE_INJECTION_KEY, { size: computed(() => context.value.size || "") });
	provideFn(emptyValuesContextKey, computed(() => ({
		emptyValues: context.value.emptyValues,
		valueOnClear: context.value.valueOnClear
	})));
	if (global || !globalConfig.value) globalConfig.value = context.value;
	return context;
};
var mergeConfig = (a, b) => {
	const keys = [.../* @__PURE__ */ new Set([...keysOf(a), ...keysOf(b)])];
	const obj = {};
	for (const key of keys) obj[key] = b[key] !== void 0 ? b[key] : a[key];
	return obj;
};
//#endregion
//#region node_modules/element-plus/es/components/config-provider/src/config-provider-props.mjs
var configProviderProps = buildProps({
	/**
	* @description Controlling if the users want a11y features
	*/
	a11y: {
		type: Boolean,
		default: true
	},
	/**
	* @description Locale Object
	*/
	locale: { type: definePropType(Object) },
	/**
	* @description global component size
	*/
	size: useSizeProp,
	/**
	* @description button related configuration, [see the following table](https://element-plus.org/en-US/component/config-provider.html#button-attribute)
	*/
	button: { type: definePropType(Object) },
	/**
	* @description card related configuration, [see the following table](https://element-plus.org/en-US/component/config-provider.html#card-attribute)
	*/
	card: { type: definePropType(Object) },
	/**
	* @description dialog related configuration, [see the following table](https://element-plus.org/en-US/component/config-provider.html#dialog-attribute)
	*/
	dialog: { type: definePropType(Object) },
	/**
	* @description link related configuration, [see the following table](https://element-plus.org/en-US/component/config-provider.html#link-attribute)
	*/
	link: { type: definePropType(Object) },
	/**
	* @description features at experimental stage to be added, all features are default to be set to false, [see the following table](https://element-plus.org/en-US/component/config-provider.html#experimental-features)                                                                            | ^[object]
	*/
	experimentalFeatures: { type: definePropType(Object) },
	/**
	* @description Controls if we should handle keyboard navigation
	*/
	keyboardNavigation: {
		type: Boolean,
		default: true
	},
	/**
	* @description message related configuration, [see the following table](https://element-plus.org/en-US/component/config-provider.html#message-attribute)
	*/
	message: { type: definePropType(Object) },
	/**
	* @description global Initial zIndex
	*/
	zIndex: Number,
	/**
	* @description global component className prefix (cooperated with [$namespace](https://github.com/element-plus/element-plus/blob/dev/packages/theme-chalk/src/mixins/config.scss#L1)) | ^[string]
	*/
	namespace: {
		type: String,
		default: "el"
	},
	/**
	* @description table related configuration, [see the following table](https://element-plus.org/en-US/component/config-provider.html#table-attribute)
	*/
	table: { type: definePropType(Object) },
	...useEmptyValuesProps
});
//#endregion
//#region node_modules/element-plus/es/components/config-provider/src/config-provider.mjs
var messageConfig = { placement: "top" };
var ConfigProvider = /* @__PURE__ */ defineComponent({
	name: "ElConfigProvider",
	props: configProviderProps,
	setup(props, { slots }) {
		const config = provideGlobalConfig(props);
		watch(() => props.message, (val) => {
			Object.assign(messageConfig, config?.value?.message ?? {}, val ?? {});
		}, {
			immediate: true,
			deep: true
		});
		return () => renderSlot(slots, "default", { config: config?.value });
	}
});
//#endregion
//#region node_modules/element-plus/es/components/button/src/constants.mjs
var buttonGroupContextKey = Symbol("buttonGroupContextKey");
//#endregion
//#region node_modules/element-plus/es/components/button/src/use-button.mjs
var useButton = (props, emit) => {
	useDeprecated({
		from: "type.text",
		replacement: "link",
		version: "3.0.0",
		scope: "props",
		ref: "https://element-plus.org/en-US/component/button.html#button-attributes"
	}, computed(() => props.type === "text"));
	const buttonGroupContext = inject(buttonGroupContextKey, void 0);
	const globalConfig = useGlobalConfig("button");
	const { form } = useFormItem();
	const _size = useFormSize(computed(() => buttonGroupContext?.size));
	const _disabled = useFormDisabled();
	const _ref = /* @__PURE__ */ ref();
	const slots = useSlots();
	const _type = computed(() => props.type || buttonGroupContext?.type || globalConfig.value?.type || "");
	const autoInsertSpace = computed(() => props.autoInsertSpace ?? globalConfig.value?.autoInsertSpace ?? false);
	const _plain = computed(() => props.plain ?? globalConfig.value?.plain ?? false);
	const _round = computed(() => props.round ?? globalConfig.value?.round ?? false);
	const _text = computed(() => props.text ?? globalConfig.value?.text ?? false);
	const _dashed = computed(() => props.dashed ?? globalConfig.value?.dashed ?? false);
	const _props = computed(() => {
		if (props.tag === "button") return {
			ariaDisabled: _disabled.value || props.loading,
			disabled: _disabled.value || props.loading,
			autofocus: props.autofocus,
			type: props.nativeType
		};
		return {};
	});
	const shouldAddSpace = computed(() => {
		const defaultSlot = slots.default?.();
		if (autoInsertSpace.value && defaultSlot?.length === 1) {
			const slot = defaultSlot[0];
			if (slot?.type === Text) {
				const text = slot.children;
				return /^\p{Unified_Ideograph}{2}$/u.test(text.trim());
			}
		}
		return false;
	});
	const handleClick = (evt) => {
		if (_disabled.value || props.loading) {
			evt.stopPropagation();
			return;
		}
		if (props.nativeType === "reset") form?.resetFields();
		emit("click", evt);
	};
	return {
		_disabled,
		_size,
		_type,
		_ref,
		_props,
		_plain,
		_round,
		_text,
		_dashed,
		shouldAddSpace,
		handleClick
	};
};
//#endregion
//#region node_modules/@ctrl/tinycolor/dist/module/util.js
/**
* Take input from [0, n] and return it as [0, 1]
* @hidden
*/
function bound01(n, max) {
	if (isOnePointZero(n)) n = "100%";
	const isPercent = isPercentage(n);
	n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
	if (isPercent) n = parseInt(String(n * max), 10) / 100;
	if (Math.abs(n - max) < 1e-6) return 1;
	if (max === 360) n = (n < 0 ? n % max + max : n % max) / parseFloat(String(max));
	else n = n % max / parseFloat(String(max));
	return n;
}
/**
* Force a number between 0 and 1
* @hidden
*/
function clamp01(val) {
	return Math.min(1, Math.max(0, val));
}
/**
* Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
* <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
* @hidden
*/
function isOnePointZero(n) {
	return typeof n === "string" && n.indexOf(".") !== -1 && parseFloat(n) === 1;
}
/**
* Check to see if string passed in is a percentage
* @hidden
*/
function isPercentage(n) {
	return typeof n === "string" && n.indexOf("%") !== -1;
}
/**
* Return a valid alpha value [0,1] with all invalid values being set to 1
* @hidden
*/
function boundAlpha(a) {
	a = parseFloat(a);
	if (isNaN(a) || a < 0 || a > 1) a = 1;
	return a;
}
/**
* Replace a decimal with it's percentage value
* @hidden
*/
function convertToPercentage(n) {
	if (Number(n) <= 1) return `${Number(n) * 100}%`;
	return n;
}
/**
* Force a hex value to have 2 characters
* @hidden
*/
function pad2(c) {
	return c.length === 1 ? "0" + c : String(c);
}
//#endregion
//#region node_modules/@ctrl/tinycolor/dist/module/conversion.js
/**
* Handle bounds / percentage checking to conform to CSS color spec
* <http://www.w3.org/TR/css3-color/>
* *Assumes:* r, g, b in [0, 255] or [0, 1]
* *Returns:* { r, g, b } in [0, 255]
*/
function rgbToRgb(r, g, b) {
	return {
		r: bound01(r, 255) * 255,
		g: bound01(g, 255) * 255,
		b: bound01(b, 255) * 255
	};
}
/**
* Converts an RGB color value to HSL.
* *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
* *Returns:* { h, s, l } in [0,1]
*/
function rgbToHsl(r, g, b) {
	r = bound01(r, 255);
	g = bound01(g, 255);
	b = bound01(b, 255);
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h = 0;
	let s = 0;
	const l = (max + min) / 2;
	if (max === min) {
		s = 0;
		h = 0;
	} else {
		const d = max - min;
		s = l > .5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
			default: break;
		}
		h /= 6;
	}
	return {
		h,
		s,
		l
	};
}
function hue2rgb(p, q, t) {
	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	if (t < 1 / 6) return p + (q - p) * (6 * t);
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	return p;
}
/**
* Converts an HSL color value to RGB.
*
* *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
* *Returns:* { r, g, b } in the set [0, 255]
*/
function hslToRgb(h, s, l) {
	let r;
	let g;
	let b;
	h = bound01(h, 360);
	s = bound01(s, 100);
	l = bound01(l, 100);
	if (s === 0) {
		g = l;
		b = l;
		r = l;
	} else {
		const q = l < .5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}
	return {
		r: r * 255,
		g: g * 255,
		b: b * 255
	};
}
/**
* Converts an RGB color value to HSV
*
* *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
* *Returns:* { h, s, v } in [0,1]
*/
function rgbToHsv(r, g, b) {
	r = bound01(r, 255);
	g = bound01(g, 255);
	b = bound01(b, 255);
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h = 0;
	const v = max;
	const d = max - min;
	const s = max === 0 ? 0 : d / max;
	if (max === min) h = 0;
	else {
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
			default: break;
		}
		h /= 6;
	}
	return {
		h,
		s,
		v
	};
}
/**
* Converts an HSV color value to RGB.
*
* *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
* *Returns:* { r, g, b } in the set [0, 255]
*/
function hsvToRgb(h, s, v) {
	h = bound01(h, 360) * 6;
	s = bound01(s, 100);
	v = bound01(v, 100);
	const i = Math.floor(h);
	const f = h - i;
	const p = v * (1 - s);
	const q = v * (1 - f * s);
	const t = v * (1 - (1 - f) * s);
	const mod = i % 6;
	const r = [
		v,
		q,
		p,
		p,
		t,
		v
	][mod];
	const g = [
		t,
		v,
		v,
		q,
		p,
		p
	][mod];
	const b = [
		p,
		p,
		t,
		v,
		v,
		q
	][mod];
	return {
		r: r * 255,
		g: g * 255,
		b: b * 255
	};
}
/**
* Converts an RGB color to hex
*
* *Assumes:* r, g, and b are contained in the set [0, 255]
* *Returns:* a 3 or 6 character hex
*/
function rgbToHex(r, g, b, allow3Char) {
	const hex = [
		pad2(Math.round(r).toString(16)),
		pad2(Math.round(g).toString(16)),
		pad2(Math.round(b).toString(16))
	];
	if (allow3Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1))) return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
	return hex.join("");
}
/**
* Converts an RGBA color plus alpha transparency to hex
*
* *Assumes:* r, g, b are contained in the set [0, 255] and a in [0, 1]
* *Returns:* a 4 or 8 character rgba hex
*/
function rgbaToHex(r, g, b, a, allow4Char) {
	const hex = [
		pad2(Math.round(r).toString(16)),
		pad2(Math.round(g).toString(16)),
		pad2(Math.round(b).toString(16)),
		pad2(convertDecimalToHex(a))
	];
	if (allow4Char && hex[0].startsWith(hex[0].charAt(1)) && hex[1].startsWith(hex[1].charAt(1)) && hex[2].startsWith(hex[2].charAt(1)) && hex[3].startsWith(hex[3].charAt(1))) return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
	return hex.join("");
}
/**
* Converts CMYK to RBG
* Assumes c, m, y, k are in the set [0, 100]
*/
function cmykToRgb(c, m, y, k) {
	const cConv = c / 100;
	const mConv = m / 100;
	const yConv = y / 100;
	const kConv = k / 100;
	return {
		r: 255 * (1 - cConv) * (1 - kConv),
		g: 255 * (1 - mConv) * (1 - kConv),
		b: 255 * (1 - yConv) * (1 - kConv)
	};
}
function rgbToCmyk(r, g, b) {
	let c = 1 - r / 255;
	let m = 1 - g / 255;
	let y = 1 - b / 255;
	let k = Math.min(c, m, y);
	if (k === 1) {
		c = 0;
		m = 0;
		y = 0;
	} else {
		c = (c - k) / (1 - k) * 100;
		m = (m - k) / (1 - k) * 100;
		y = (y - k) / (1 - k) * 100;
	}
	k *= 100;
	return {
		c: Math.round(c),
		m: Math.round(m),
		y: Math.round(y),
		k: Math.round(k)
	};
}
/** Converts a decimal to a hex value */
function convertDecimalToHex(d) {
	return Math.round(parseFloat(d) * 255).toString(16);
}
/** Converts a hex value to a decimal */
function convertHexToDecimal(h) {
	return parseIntFromHex(h) / 255;
}
/** Parse a base-16 hex value into a base-10 integer */
function parseIntFromHex(val) {
	return parseInt(val, 16);
}
function numberInputToObject(color) {
	return {
		r: color >> 16,
		g: (color & 65280) >> 8,
		b: color & 255
	};
}
//#endregion
//#region node_modules/@ctrl/tinycolor/dist/module/css-color-names.js
/**
* @hidden
*/
var names = {
	aliceblue: "#f0f8ff",
	antiquewhite: "#faebd7",
	aqua: "#00ffff",
	aquamarine: "#7fffd4",
	azure: "#f0ffff",
	beige: "#f5f5dc",
	bisque: "#ffe4c4",
	black: "#000000",
	blanchedalmond: "#ffebcd",
	blue: "#0000ff",
	blueviolet: "#8a2be2",
	brown: "#a52a2a",
	burlywood: "#deb887",
	cadetblue: "#5f9ea0",
	chartreuse: "#7fff00",
	chocolate: "#d2691e",
	coral: "#ff7f50",
	cornflowerblue: "#6495ed",
	cornsilk: "#fff8dc",
	crimson: "#dc143c",
	cyan: "#00ffff",
	darkblue: "#00008b",
	darkcyan: "#008b8b",
	darkgoldenrod: "#b8860b",
	darkgray: "#a9a9a9",
	darkgreen: "#006400",
	darkgrey: "#a9a9a9",
	darkkhaki: "#bdb76b",
	darkmagenta: "#8b008b",
	darkolivegreen: "#556b2f",
	darkorange: "#ff8c00",
	darkorchid: "#9932cc",
	darkred: "#8b0000",
	darksalmon: "#e9967a",
	darkseagreen: "#8fbc8f",
	darkslateblue: "#483d8b",
	darkslategray: "#2f4f4f",
	darkslategrey: "#2f4f4f",
	darkturquoise: "#00ced1",
	darkviolet: "#9400d3",
	deeppink: "#ff1493",
	deepskyblue: "#00bfff",
	dimgray: "#696969",
	dimgrey: "#696969",
	dodgerblue: "#1e90ff",
	firebrick: "#b22222",
	floralwhite: "#fffaf0",
	forestgreen: "#228b22",
	fuchsia: "#ff00ff",
	gainsboro: "#dcdcdc",
	ghostwhite: "#f8f8ff",
	goldenrod: "#daa520",
	gold: "#ffd700",
	gray: "#808080",
	green: "#008000",
	greenyellow: "#adff2f",
	grey: "#808080",
	honeydew: "#f0fff0",
	hotpink: "#ff69b4",
	indianred: "#cd5c5c",
	indigo: "#4b0082",
	ivory: "#fffff0",
	khaki: "#f0e68c",
	lavenderblush: "#fff0f5",
	lavender: "#e6e6fa",
	lawngreen: "#7cfc00",
	lemonchiffon: "#fffacd",
	lightblue: "#add8e6",
	lightcoral: "#f08080",
	lightcyan: "#e0ffff",
	lightgoldenrodyellow: "#fafad2",
	lightgray: "#d3d3d3",
	lightgreen: "#90ee90",
	lightgrey: "#d3d3d3",
	lightpink: "#ffb6c1",
	lightsalmon: "#ffa07a",
	lightseagreen: "#20b2aa",
	lightskyblue: "#87cefa",
	lightslategray: "#778899",
	lightslategrey: "#778899",
	lightsteelblue: "#b0c4de",
	lightyellow: "#ffffe0",
	lime: "#00ff00",
	limegreen: "#32cd32",
	linen: "#faf0e6",
	magenta: "#ff00ff",
	maroon: "#800000",
	mediumaquamarine: "#66cdaa",
	mediumblue: "#0000cd",
	mediumorchid: "#ba55d3",
	mediumpurple: "#9370db",
	mediumseagreen: "#3cb371",
	mediumslateblue: "#7b68ee",
	mediumspringgreen: "#00fa9a",
	mediumturquoise: "#48d1cc",
	mediumvioletred: "#c71585",
	midnightblue: "#191970",
	mintcream: "#f5fffa",
	mistyrose: "#ffe4e1",
	moccasin: "#ffe4b5",
	navajowhite: "#ffdead",
	navy: "#000080",
	oldlace: "#fdf5e6",
	olive: "#808000",
	olivedrab: "#6b8e23",
	orange: "#ffa500",
	orangered: "#ff4500",
	orchid: "#da70d6",
	palegoldenrod: "#eee8aa",
	palegreen: "#98fb98",
	paleturquoise: "#afeeee",
	palevioletred: "#db7093",
	papayawhip: "#ffefd5",
	peachpuff: "#ffdab9",
	peru: "#cd853f",
	pink: "#ffc0cb",
	plum: "#dda0dd",
	powderblue: "#b0e0e6",
	purple: "#800080",
	rebeccapurple: "#663399",
	red: "#ff0000",
	rosybrown: "#bc8f8f",
	royalblue: "#4169e1",
	saddlebrown: "#8b4513",
	salmon: "#fa8072",
	sandybrown: "#f4a460",
	seagreen: "#2e8b57",
	seashell: "#fff5ee",
	sienna: "#a0522d",
	silver: "#c0c0c0",
	skyblue: "#87ceeb",
	slateblue: "#6a5acd",
	slategray: "#708090",
	slategrey: "#708090",
	snow: "#fffafa",
	springgreen: "#00ff7f",
	steelblue: "#4682b4",
	tan: "#d2b48c",
	teal: "#008080",
	thistle: "#d8bfd8",
	tomato: "#ff6347",
	turquoise: "#40e0d0",
	violet: "#ee82ee",
	wheat: "#f5deb3",
	white: "#ffffff",
	whitesmoke: "#f5f5f5",
	yellow: "#ffff00",
	yellowgreen: "#9acd32"
};
//#endregion
//#region node_modules/@ctrl/tinycolor/dist/module/format-input.js
/**
* Given a string or object, convert that input to RGB
*
* Possible string inputs:
* ```
* "red"
* "#f00" or "f00"
* "#ff0000" or "ff0000"
* "#ff000000" or "ff000000"
* "rgb 255 0 0" or "rgb (255, 0, 0)"
* "rgb 1.0 0 0" or "rgb (1, 0, 0)"
* "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
* "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
* "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
* "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
* "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
* "cmyk(0, 20, 0, 0)" or "cmyk 0 20 0 0"
* ```
*/
function inputToRGB(color) {
	let rgb = {
		r: 0,
		g: 0,
		b: 0
	};
	let a = 1;
	let s = null;
	let v = null;
	let l = null;
	let ok = false;
	let format = false;
	if (typeof color === "string") color = stringInputToObject(color);
	if (typeof color === "object") {
		if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
			rgb = rgbToRgb(color.r, color.g, color.b);
			ok = true;
			format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
		} else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
			s = convertToPercentage(color.s);
			v = convertToPercentage(color.v);
			rgb = hsvToRgb(color.h, s, v);
			ok = true;
			format = "hsv";
		} else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
			s = convertToPercentage(color.s);
			l = convertToPercentage(color.l);
			rgb = hslToRgb(color.h, s, l);
			ok = true;
			format = "hsl";
		} else if (isValidCSSUnit(color.c) && isValidCSSUnit(color.m) && isValidCSSUnit(color.y) && isValidCSSUnit(color.k)) {
			rgb = cmykToRgb(color.c, color.m, color.y, color.k);
			ok = true;
			format = "cmyk";
		}
		if (Object.prototype.hasOwnProperty.call(color, "a")) a = color.a;
	}
	a = boundAlpha(a);
	return {
		ok,
		format: color.format || format,
		r: Math.min(255, Math.max(rgb.r, 0)),
		g: Math.min(255, Math.max(rgb.g, 0)),
		b: Math.min(255, Math.max(rgb.b, 0)),
		a
	};
}
var matchers = {
	CSS_UNIT: /* @__PURE__ */ new RegExp("(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)"),
	rgb: /* @__PURE__ */ new RegExp("rgb[\\s|\\(]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))[,|\\s]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))[,|\\s]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))\\s*\\)?"),
	rgba: /* @__PURE__ */ new RegExp("rgba[\\s|\\(]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))[,|\\s]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))[,|\\s]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))[,|\\s]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))\\s*\\)?"),
	hsl: /* @__PURE__ */ new RegExp("hsl[\\s|\\(]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))[,|\\s]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))[,|\\s]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))\\s*\\)?"),
	hsla: /* @__PURE__ */ new RegExp("hsla[\\s|\\(]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))[,|\\s]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))[,|\\s]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))[,|\\s]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))\\s*\\)?"),
	hsv: /* @__PURE__ */ new RegExp("hsv[\\s|\\(]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))[,|\\s]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))[,|\\s]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))\\s*\\)?"),
	hsva: /* @__PURE__ */ new RegExp("hsva[\\s|\\(]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))[,|\\s]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))[,|\\s]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))[,|\\s]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))\\s*\\)?"),
	cmyk: /* @__PURE__ */ new RegExp("cmyk[\\s|\\(]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))[,|\\s]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))[,|\\s]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))[,|\\s]+((?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?))\\s*\\)?"),
	hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
	hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
	hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
	hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
};
/**
* Permissive string parsing.  Take in a number of formats, and output an object
* based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}` or `{c, m, y, k}` or `{c, m, y, k, a}`
*/
function stringInputToObject(color) {
	color = color.trim().toLowerCase();
	if (color.length === 0) return false;
	let named = false;
	if (names[color]) {
		color = names[color];
		named = true;
	} else if (color === "transparent") return {
		r: 0,
		g: 0,
		b: 0,
		a: 0,
		format: "name"
	};
	let match = matchers.rgb.exec(color);
	if (match) return {
		r: match[1],
		g: match[2],
		b: match[3]
	};
	match = matchers.rgba.exec(color);
	if (match) return {
		r: match[1],
		g: match[2],
		b: match[3],
		a: match[4]
	};
	match = matchers.hsl.exec(color);
	if (match) return {
		h: match[1],
		s: match[2],
		l: match[3]
	};
	match = matchers.hsla.exec(color);
	if (match) return {
		h: match[1],
		s: match[2],
		l: match[3],
		a: match[4]
	};
	match = matchers.hsv.exec(color);
	if (match) return {
		h: match[1],
		s: match[2],
		v: match[3]
	};
	match = matchers.hsva.exec(color);
	if (match) return {
		h: match[1],
		s: match[2],
		v: match[3],
		a: match[4]
	};
	match = matchers.cmyk.exec(color);
	if (match) return {
		c: match[1],
		m: match[2],
		y: match[3],
		k: match[4]
	};
	match = matchers.hex8.exec(color);
	if (match) return {
		r: parseIntFromHex(match[1]),
		g: parseIntFromHex(match[2]),
		b: parseIntFromHex(match[3]),
		a: convertHexToDecimal(match[4]),
		format: named ? "name" : "hex8"
	};
	match = matchers.hex6.exec(color);
	if (match) return {
		r: parseIntFromHex(match[1]),
		g: parseIntFromHex(match[2]),
		b: parseIntFromHex(match[3]),
		format: named ? "name" : "hex"
	};
	match = matchers.hex4.exec(color);
	if (match) return {
		r: parseIntFromHex(match[1] + match[1]),
		g: parseIntFromHex(match[2] + match[2]),
		b: parseIntFromHex(match[3] + match[3]),
		a: convertHexToDecimal(match[4] + match[4]),
		format: named ? "name" : "hex8"
	};
	match = matchers.hex3.exec(color);
	if (match) return {
		r: parseIntFromHex(match[1] + match[1]),
		g: parseIntFromHex(match[2] + match[2]),
		b: parseIntFromHex(match[3] + match[3]),
		format: named ? "name" : "hex"
	};
	return false;
}
/**
* Check to see if it looks like a CSS unit
* (see `matchers` above for definition).
*/
function isValidCSSUnit(color) {
	if (typeof color === "number") return !Number.isNaN(color);
	return matchers.CSS_UNIT.test(color);
}
//#endregion
//#region node_modules/@ctrl/tinycolor/dist/module/index.js
var TinyColor = class TinyColor {
	constructor(color = "", opts = {}) {
		if (color instanceof TinyColor) return color;
		if (typeof color === "number") color = numberInputToObject(color);
		this.originalInput = color;
		const rgb = inputToRGB(color);
		this.originalInput = color;
		this.r = rgb.r;
		this.g = rgb.g;
		this.b = rgb.b;
		this.a = rgb.a;
		this.roundA = Math.round(100 * this.a) / 100;
		this.format = opts.format ?? rgb.format;
		this.gradientType = opts.gradientType;
		if (this.r < 1) this.r = Math.round(this.r);
		if (this.g < 1) this.g = Math.round(this.g);
		if (this.b < 1) this.b = Math.round(this.b);
		this.isValid = rgb.ok;
	}
	isDark() {
		return this.getBrightness() < 128;
	}
	isLight() {
		return !this.isDark();
	}
	/**
	* Returns the perceived brightness of the color, from 0-255.
	*/
	getBrightness() {
		const rgb = this.toRgb();
		return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1e3;
	}
	/**
	* Returns the perceived luminance of a color, from 0-1.
	*/
	getLuminance() {
		const rgb = this.toRgb();
		let R;
		let G;
		let B;
		const RsRGB = rgb.r / 255;
		const GsRGB = rgb.g / 255;
		const BsRGB = rgb.b / 255;
		if (RsRGB <= .03928) R = RsRGB / 12.92;
		else R = Math.pow((RsRGB + .055) / 1.055, 2.4);
		if (GsRGB <= .03928) G = GsRGB / 12.92;
		else G = Math.pow((GsRGB + .055) / 1.055, 2.4);
		if (BsRGB <= .03928) B = BsRGB / 12.92;
		else B = Math.pow((BsRGB + .055) / 1.055, 2.4);
		return .2126 * R + .7152 * G + .0722 * B;
	}
	/**
	* Returns the alpha value of a color, from 0-1.
	*/
	getAlpha() {
		return this.a;
	}
	/**
	* Sets the alpha value on the current color.
	*
	* @param alpha - The new alpha value. The accepted range is 0-1.
	*/
	setAlpha(alpha) {
		this.a = boundAlpha(alpha);
		this.roundA = Math.round(100 * this.a) / 100;
		return this;
	}
	/**
	* Returns whether the color is monochrome.
	*/
	isMonochrome() {
		const { s } = this.toHsl();
		return s === 0;
	}
	/**
	* Returns the object as a HSVA object.
	*/
	toHsv() {
		const hsv = rgbToHsv(this.r, this.g, this.b);
		return {
			h: hsv.h * 360,
			s: hsv.s,
			v: hsv.v,
			a: this.a
		};
	}
	/**
	* Returns the hsva values interpolated into a string with the following format:
	* "hsva(xxx, xxx, xxx, xx)".
	*/
	toHsvString() {
		const hsv = rgbToHsv(this.r, this.g, this.b);
		const h = Math.round(hsv.h * 360);
		const s = Math.round(hsv.s * 100);
		const v = Math.round(hsv.v * 100);
		return this.a === 1 ? `hsv(${h}, ${s}%, ${v}%)` : `hsva(${h}, ${s}%, ${v}%, ${this.roundA})`;
	}
	/**
	* Returns the object as a HSLA object.
	*/
	toHsl() {
		const hsl = rgbToHsl(this.r, this.g, this.b);
		return {
			h: hsl.h * 360,
			s: hsl.s,
			l: hsl.l,
			a: this.a
		};
	}
	/**
	* Returns the hsla values interpolated into a string with the following format:
	* "hsla(xxx, xxx, xxx, xx)".
	*/
	toHslString() {
		const hsl = rgbToHsl(this.r, this.g, this.b);
		const h = Math.round(hsl.h * 360);
		const s = Math.round(hsl.s * 100);
		const l = Math.round(hsl.l * 100);
		return this.a === 1 ? `hsl(${h}, ${s}%, ${l}%)` : `hsla(${h}, ${s}%, ${l}%, ${this.roundA})`;
	}
	/**
	* Returns the hex value of the color.
	* @param allow3Char will shorten hex value to 3 char if possible
	*/
	toHex(allow3Char = false) {
		return rgbToHex(this.r, this.g, this.b, allow3Char);
	}
	/**
	* Returns the hex value of the color -with a # prefixed.
	* @param allow3Char will shorten hex value to 3 char if possible
	*/
	toHexString(allow3Char = false) {
		return "#" + this.toHex(allow3Char);
	}
	/**
	* Returns the hex 8 value of the color.
	* @param allow4Char will shorten hex value to 4 char if possible
	*/
	toHex8(allow4Char = false) {
		return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
	}
	/**
	* Returns the hex 8 value of the color -with a # prefixed.
	* @param allow4Char will shorten hex value to 4 char if possible
	*/
	toHex8String(allow4Char = false) {
		return "#" + this.toHex8(allow4Char);
	}
	/**
	* Returns the shorter hex value of the color depends on its alpha -with a # prefixed.
	* @param allowShortChar will shorten hex value to 3 or 4 char if possible
	*/
	toHexShortString(allowShortChar = false) {
		return this.a === 1 ? this.toHexString(allowShortChar) : this.toHex8String(allowShortChar);
	}
	/**
	* Returns the object as a RGBA object.
	*/
	toRgb() {
		return {
			r: Math.round(this.r),
			g: Math.round(this.g),
			b: Math.round(this.b),
			a: this.a
		};
	}
	/**
	* Returns the RGBA values interpolated into a string with the following format:
	* "RGBA(xxx, xxx, xxx, xx)".
	*/
	toRgbString() {
		const r = Math.round(this.r);
		const g = Math.round(this.g);
		const b = Math.round(this.b);
		return this.a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${this.roundA})`;
	}
	/**
	* Returns the object as a RGBA object.
	*/
	toPercentageRgb() {
		const fmt = (x) => `${Math.round(bound01(x, 255) * 100)}%`;
		return {
			r: fmt(this.r),
			g: fmt(this.g),
			b: fmt(this.b),
			a: this.a
		};
	}
	/**
	* Returns the RGBA relative values interpolated into a string
	*/
	toPercentageRgbString() {
		const rnd = (x) => Math.round(bound01(x, 255) * 100);
		return this.a === 1 ? `rgb(${rnd(this.r)}%, ${rnd(this.g)}%, ${rnd(this.b)}%)` : `rgba(${rnd(this.r)}%, ${rnd(this.g)}%, ${rnd(this.b)}%, ${this.roundA})`;
	}
	toCmyk() {
		return { ...rgbToCmyk(this.r, this.g, this.b) };
	}
	toCmykString() {
		const { c, m, y, k } = rgbToCmyk(this.r, this.g, this.b);
		return `cmyk(${c}, ${m}, ${y}, ${k})`;
	}
	/**
	* The 'real' name of the color -if there is one.
	*/
	toName() {
		if (this.a === 0) return "transparent";
		if (this.a < 1) return false;
		const hex = "#" + rgbToHex(this.r, this.g, this.b, false);
		for (const [key, value] of Object.entries(names)) if (hex === value) return key;
		return false;
	}
	toString(format) {
		const formatSet = Boolean(format);
		format = format ?? this.format;
		let formattedString = false;
		const hasAlpha = this.a < 1 && this.a >= 0;
		if (!formatSet && hasAlpha && (format.startsWith("hex") || format === "name")) {
			if (format === "name" && this.a === 0) return this.toName();
			return this.toRgbString();
		}
		if (format === "rgb") formattedString = this.toRgbString();
		if (format === "prgb") formattedString = this.toPercentageRgbString();
		if (format === "hex" || format === "hex6") formattedString = this.toHexString();
		if (format === "hex3") formattedString = this.toHexString(true);
		if (format === "hex4") formattedString = this.toHex8String(true);
		if (format === "hex8") formattedString = this.toHex8String();
		if (format === "name") formattedString = this.toName();
		if (format === "hsl") formattedString = this.toHslString();
		if (format === "hsv") formattedString = this.toHsvString();
		if (format === "cmyk") formattedString = this.toCmykString();
		return formattedString || this.toHexString();
	}
	toNumber() {
		return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
	}
	clone() {
		return new TinyColor(this.toString());
	}
	/**
	* Lighten the color a given amount. Providing 100 will always return white.
	* @param amount - valid between 1-100
	*/
	lighten(amount = 10) {
		const hsl = this.toHsl();
		hsl.l += amount / 100;
		hsl.l = clamp01(hsl.l);
		return new TinyColor(hsl);
	}
	/**
	* Brighten the color a given amount, from 0 to 100.
	* @param amount - valid between 1-100
	*/
	brighten(amount = 10) {
		const rgb = this.toRgb();
		rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
		rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
		rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
		return new TinyColor(rgb);
	}
	/**
	* Darken the color a given amount, from 0 to 100.
	* Providing 100 will always return black.
	* @param amount - valid between 1-100
	*/
	darken(amount = 10) {
		const hsl = this.toHsl();
		hsl.l -= amount / 100;
		hsl.l = clamp01(hsl.l);
		return new TinyColor(hsl);
	}
	/**
	* Mix the color with pure white, from 0 to 100.
	* Providing 0 will do nothing, providing 100 will always return white.
	* @param amount - valid between 1-100
	*/
	tint(amount = 10) {
		return this.mix("white", amount);
	}
	/**
	* Mix the color with pure black, from 0 to 100.
	* Providing 0 will do nothing, providing 100 will always return black.
	* @param amount - valid between 1-100
	*/
	shade(amount = 10) {
		return this.mix("black", amount);
	}
	/**
	* Desaturate the color a given amount, from 0 to 100.
	* Providing 100 will is the same as calling greyscale
	* @param amount - valid between 1-100
	*/
	desaturate(amount = 10) {
		const hsl = this.toHsl();
		hsl.s -= amount / 100;
		hsl.s = clamp01(hsl.s);
		return new TinyColor(hsl);
	}
	/**
	* Saturate the color a given amount, from 0 to 100.
	* @param amount - valid between 1-100
	*/
	saturate(amount = 10) {
		const hsl = this.toHsl();
		hsl.s += amount / 100;
		hsl.s = clamp01(hsl.s);
		return new TinyColor(hsl);
	}
	/**
	* Completely desaturates a color into greyscale.
	* Same as calling `desaturate(100)`
	*/
	greyscale() {
		return this.desaturate(100);
	}
	/**
	* Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
	* Values outside of this range will be wrapped into this range.
	*/
	spin(amount) {
		const hsl = this.toHsl();
		const hue = (hsl.h + amount) % 360;
		hsl.h = hue < 0 ? 360 + hue : hue;
		return new TinyColor(hsl);
	}
	/**
	* Mix the current color a given amount with another color, from 0 to 100.
	* 0 means no mixing (return current color).
	*/
	mix(color, amount = 50) {
		const rgb1 = this.toRgb();
		const rgb2 = new TinyColor(color).toRgb();
		const p = amount / 100;
		const rgba = {
			r: (rgb2.r - rgb1.r) * p + rgb1.r,
			g: (rgb2.g - rgb1.g) * p + rgb1.g,
			b: (rgb2.b - rgb1.b) * p + rgb1.b,
			a: (rgb2.a - rgb1.a) * p + rgb1.a
		};
		return new TinyColor(rgba);
	}
	analogous(results = 6, slices = 30) {
		const hsl = this.toHsl();
		const part = 360 / slices;
		const ret = [this];
		for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results;) {
			hsl.h = (hsl.h + part) % 360;
			ret.push(new TinyColor(hsl));
		}
		return ret;
	}
	/**
	* taken from https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js
	*/
	complement() {
		const hsl = this.toHsl();
		hsl.h = (hsl.h + 180) % 360;
		return new TinyColor(hsl);
	}
	monochromatic(results = 6) {
		const hsv = this.toHsv();
		const { h } = hsv;
		const { s } = hsv;
		let { v } = hsv;
		const res = [];
		const modification = 1 / results;
		while (results--) {
			res.push(new TinyColor({
				h,
				s,
				v
			}));
			v = (v + modification) % 1;
		}
		return res;
	}
	splitcomplement() {
		const hsl = this.toHsl();
		const { h } = hsl;
		return [
			this,
			new TinyColor({
				h: (h + 72) % 360,
				s: hsl.s,
				l: hsl.l
			}),
			new TinyColor({
				h: (h + 216) % 360,
				s: hsl.s,
				l: hsl.l
			})
		];
	}
	/**
	* Compute how the color would appear on a background
	*/
	onBackground(background) {
		const fg = this.toRgb();
		const bg = new TinyColor(background).toRgb();
		const alpha = fg.a + bg.a * (1 - fg.a);
		return new TinyColor({
			r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / alpha,
			g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / alpha,
			b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / alpha,
			a: alpha
		});
	}
	/**
	* Alias for `polyad(3)`
	*/
	triad() {
		return this.polyad(3);
	}
	/**
	* Alias for `polyad(4)`
	*/
	tetrad() {
		return this.polyad(4);
	}
	/**
	* Get polyad colors, like (for 1, 2, 3, 4, 5, 6, 7, 8, etc...)
	* monad, dyad, triad, tetrad, pentad, hexad, heptad, octad, etc...
	*/
	polyad(n) {
		const hsl = this.toHsl();
		const { h } = hsl;
		const result = [this];
		const increment = 360 / n;
		for (let i = 1; i < n; i++) result.push(new TinyColor({
			h: (h + i * increment) % 360,
			s: hsl.s,
			l: hsl.l
		}));
		return result;
	}
	/**
	* compare color vs current color
	*/
	equals(color) {
		const comparedColor = new TinyColor(color);
		/**
		* RGB and CMYK do not have the same color gamut, so a CMYK conversion will never be 100%.
		* This means we need to compare CMYK to CMYK to ensure accuracy of the equals function.
		*/
		if (this.format === "cmyk" || comparedColor.format === "cmyk") return this.toCmykString() === comparedColor.toCmykString();
		return this.toRgbString() === comparedColor.toRgbString();
	}
};
//#endregion
//#region node_modules/element-plus/es/components/button/src/button-custom.mjs
function darken(color, amount = 20) {
	return color.mix("#141414", amount).toString();
}
function useButtonCustomStyle(props) {
	const _disabled = useFormDisabled();
	const ns = useNamespace("button");
	return computed(() => {
		let styles = {};
		let buttonColor = props.color;
		if (buttonColor) {
			const match = buttonColor.match(/var\((.*?)\)/);
			if (match) buttonColor = window.getComputedStyle(window.document.documentElement).getPropertyValue(match[1]);
			const color = new TinyColor(buttonColor);
			const activeBgColor = props.dark ? color.tint(20).toString() : darken(color, 20);
			if (props.plain) {
				styles = ns.cssVarBlock({
					"bg-color": props.dark ? darken(color, 90) : color.tint(90).toString(),
					"text-color": buttonColor,
					"border-color": props.dark ? darken(color, 50) : color.tint(50).toString(),
					"hover-text-color": `var(${ns.cssVarName("color-white")})`,
					"hover-bg-color": buttonColor,
					"hover-border-color": buttonColor,
					"active-bg-color": activeBgColor,
					"active-text-color": `var(${ns.cssVarName("color-white")})`,
					"active-border-color": activeBgColor
				});
				if (_disabled.value) {
					styles[ns.cssVarBlockName("disabled-bg-color")] = props.dark ? darken(color, 90) : color.tint(90).toString();
					styles[ns.cssVarBlockName("disabled-text-color")] = props.dark ? darken(color, 50) : color.tint(50).toString();
					styles[ns.cssVarBlockName("disabled-border-color")] = props.dark ? darken(color, 80) : color.tint(80).toString();
				}
			} else if (props.link || props.text) {
				const hoverColor = props.dark ? darken(color, 30) : color.tint(30).toString();
				styles = ns.cssVarBlock({
					"text-color": buttonColor,
					"hover-text-color": hoverColor,
					"active-text-color": activeBgColor
				});
				if (props.link) {
					styles[ns.cssVarBlockName("hover-link-text-color")] = hoverColor;
					styles[ns.cssVarBlockName("active-color")] = activeBgColor;
				}
				if (_disabled.value) {
					const disabledColor = props.dark ? darken(color, 50) : color.tint(50).toString();
					styles[ns.cssVarBlockName("disabled-bg-color")] = "transparent";
					styles[ns.cssVarBlockName("disabled-text-color")] = disabledColor;
					styles[ns.cssVarBlockName("disabled-border-color")] = "transparent";
				}
			} else {
				const hoverBgColor = props.dark ? darken(color, 30) : color.tint(30).toString();
				const textColor = color.isDark() ? `var(${ns.cssVarName("color-white")})` : `var(${ns.cssVarName("color-black")})`;
				styles = ns.cssVarBlock({
					"bg-color": buttonColor,
					"text-color": textColor,
					"border-color": buttonColor,
					"hover-bg-color": hoverBgColor,
					"hover-text-color": textColor,
					"hover-border-color": hoverBgColor,
					"active-bg-color": activeBgColor,
					"active-border-color": activeBgColor
				});
				if (_disabled.value) {
					const disabledButtonColor = props.dark ? darken(color, 50) : color.tint(50).toString();
					styles[ns.cssVarBlockName("disabled-bg-color")] = disabledButtonColor;
					styles[ns.cssVarBlockName("disabled-text-color")] = props.dark ? "rgba(255, 255, 255, 0.5)" : `var(${ns.cssVarName("color-white")})`;
					styles[ns.cssVarBlockName("disabled-border-color")] = disabledButtonColor;
				}
			}
		}
		return styles;
	});
}
//#endregion
//#region node_modules/element-plus/es/components/button/src/button2.mjs
var button_default = /* @__PURE__ */ defineComponent({
	name: "ElButton",
	__name: "button",
	props: buttonProps,
	emits: buttonEmits,
	setup(__props, { expose: __expose, emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const buttonStyle = useButtonCustomStyle(props);
		const ns = useNamespace("button");
		const { _ref, _size, _type, _disabled, _props, _plain, _round, _text, _dashed, shouldAddSpace, handleClick } = useButton(props, emit);
		const buttonKls = computed(() => [
			ns.b(),
			ns.m(_type.value),
			ns.m(_size.value),
			ns.is("disabled", _disabled.value),
			ns.is("loading", props.loading),
			ns.is("plain", _plain.value),
			ns.is("round", _round.value),
			ns.is("circle", props.circle),
			ns.is("text", _text.value),
			ns.is("dashed", _dashed.value),
			ns.is("link", props.link),
			ns.is("has-bg", props.bg)
		]);
		__expose({
			/** @description button html element */
			ref: _ref,
			/** @description button size */
			size: _size,
			/** @description button type */
			type: _type,
			/** @description button disabled */
			disabled: _disabled,
			/** @description whether adding space */
			shouldAddSpace
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(__props.tag), mergeProps({
				ref_key: "_ref",
				ref: _ref
			}, unref(_props), {
				class: buttonKls.value,
				style: unref(buttonStyle),
				onClick: unref(handleClick)
			}), {
				default: withCtx(() => [__props.loading ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [_ctx.$slots.loading ? renderSlot(_ctx.$slots, "loading", { key: 0 }) : (openBlock(), createBlock(unref(ElIcon), {
					key: 1,
					class: normalizeClass(unref(ns).is("loading"))
				}, {
					default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(__props.loadingIcon)))]),
					_: 1
				}, 8, ["class"]))], 64)) : __props.icon || _ctx.$slots.icon ? (openBlock(), createBlock(unref(ElIcon), { key: 1 }, {
					default: withCtx(() => [__props.icon ? (openBlock(), createBlock(resolveDynamicComponent(__props.icon), { key: 0 })) : renderSlot(_ctx.$slots, "icon", { key: 1 })]),
					_: 3
				})) : createCommentVNode("v-if", true), _ctx.$slots.default ? (openBlock(), createElementBlock("span", {
					key: 2,
					class: normalizeClass({ [unref(ns).em("text", "expand")]: unref(shouldAddSpace) })
				}, [renderSlot(_ctx.$slots, "default")], 2)) : createCommentVNode("v-if", true)]),
				_: 3
			}, 16, [
				"class",
				"style",
				"onClick"
			]);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/button/src/button-group2.mjs
var button_group_default = /* @__PURE__ */ defineComponent({
	name: "ElButtonGroup",
	__name: "button-group",
	props: {
		/**
		* @description control the size of buttons in this button-group
		*/
		size: buttonProps.size,
		/**
		* @description control the type of buttons in this button-group
		*/
		type: buttonProps.type,
		/**
		* @description display direction
		*/
		direction: {
			type: definePropType(String),
			values: ["horizontal", "vertical"],
			default: "horizontal"
		}
	},
	setup(__props) {
		const props = __props;
		provide(buttonGroupContextKey, /* @__PURE__ */ reactive({
			size: /* @__PURE__ */ toRef(props, "size"),
			type: /* @__PURE__ */ toRef(props, "type")
		}));
		const ns = useNamespace("button");
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", { class: normalizeClass([unref(ns).b("group"), unref(ns).bm("group", props.direction)]) }, [renderSlot(_ctx.$slots, "default")], 2);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/button/index.mjs
var ElButton = withInstall(button_default, { ButtonGroup: button_group_default });
var ElButtonGroup = withNoopInstall(button_group_default);
//#endregion
//#region node_modules/element-plus/es/directives/click-outside/index.mjs
var nodeList = /* @__PURE__ */ new Map();
if (isClient) {
	let startClick;
	document.addEventListener("mousedown", (e) => startClick = e);
	document.addEventListener("mouseup", (e) => {
		if (startClick) {
			for (const handlers of nodeList.values()) for (const { documentHandler } of handlers) documentHandler(e, startClick);
			startClick = void 0;
		}
	});
}
function createDocumentHandler(el, binding) {
	let excludes = [];
	if (isArray$1(binding.arg)) excludes = binding.arg;
	else if (isElement(binding.arg)) excludes.push(binding.arg);
	return function(mouseup, mousedown) {
		const popperRef = binding.instance.popperRef;
		const mouseUpTarget = mouseup.target;
		const mouseDownTarget = mousedown?.target;
		const isBound = !binding || !binding.instance;
		const isTargetExists = !mouseUpTarget || !mouseDownTarget;
		const isContainedByEl = el.contains(mouseUpTarget) || el.contains(mouseDownTarget);
		const isSelf = el === mouseUpTarget;
		const isTargetExcluded = excludes.length && excludes.some((item) => item?.contains(mouseUpTarget)) || excludes.length && excludes.includes(mouseDownTarget);
		const isContainedByPopper = popperRef && (popperRef.contains(mouseUpTarget) || popperRef.contains(mouseDownTarget));
		if (isBound || isTargetExists || isContainedByEl || isSelf || isTargetExcluded || isContainedByPopper) return;
		binding.value(mouseup, mousedown);
	};
}
var ClickOutside = {
	beforeMount(el, binding) {
		if (!nodeList.has(el)) nodeList.set(el, []);
		nodeList.get(el).push({
			documentHandler: createDocumentHandler(el, binding),
			bindingFn: binding.value
		});
	},
	updated(el, binding) {
		if (!nodeList.has(el)) nodeList.set(el, []);
		const handlers = nodeList.get(el);
		const oldHandlerIndex = handlers.findIndex((item) => item.bindingFn === binding.oldValue);
		const newHandler = {
			documentHandler: createDocumentHandler(el, binding),
			bindingFn: binding.value
		};
		if (oldHandlerIndex >= 0) handlers.splice(oldHandlerIndex, 1, newHandler);
		else handlers.push(newHandler);
	},
	unmounted(el) {
		nodeList.delete(el);
	}
};
//#endregion
//#region node_modules/element-plus/es/directives/trap-focus/index.mjs
var FOCUSABLE_CHILDREN = "_trap-focus-children";
var FOCUS_STACK = [];
var FOCUS_HANDLER = (e) => {
	if (FOCUS_STACK.length === 0) return;
	const code = getEventCode(e);
	const focusableElement = FOCUS_STACK[FOCUS_STACK.length - 1][FOCUSABLE_CHILDREN];
	if (focusableElement.length > 0 && code === EVENT_CODE.tab) {
		if (focusableElement.length === 1) {
			e.preventDefault();
			if (document.activeElement !== focusableElement[0]) focusableElement[0].focus();
			return;
		}
		const goingBackward = e.shiftKey;
		const isFirst = e.target === focusableElement[0];
		const isLast = e.target === focusableElement[focusableElement.length - 1];
		if (isFirst && goingBackward) {
			e.preventDefault();
			focusableElement[focusableElement.length - 1].focus();
		}
		if (isLast && !goingBackward) {
			e.preventDefault();
			focusableElement[0].focus();
		}
	}
};
var TrapFocus = {
	beforeMount(el) {
		el[FOCUSABLE_CHILDREN] = obtainAllFocusableElements$1(el);
		FOCUS_STACK.push(el);
		if (FOCUS_STACK.length <= 1) document.addEventListener("keydown", FOCUS_HANDLER);
	},
	updated(el) {
		nextTick(() => {
			el[FOCUSABLE_CHILDREN] = obtainAllFocusableElements$1(el);
		});
	},
	unmounted() {
		FOCUS_STACK.shift();
		if (FOCUS_STACK.length === 0) document.removeEventListener("keydown", FOCUS_HANDLER);
	}
};
//#endregion
//#region node_modules/normalize-wheel-es/dist/index.mjs
var v = !1;
var o;
var f;
var s;
var u;
var d;
var N;
var l;
var p;
var m;
var w;
var D;
var x;
var E;
var M;
var F;
function a() {
	if (!v) {
		v = !0;
		var e = navigator.userAgent, n = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera(?:.+Version.|.)(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))|(?:Trident\/\d+\.\d+.*rv:(\d+\.\d+))/.exec(e), i = /(Mac OS X)|(Windows)|(Linux)/.exec(e);
		if (x = /\b(iPhone|iP[ao]d)/.exec(e), E = /\b(iP[ao]d)/.exec(e), w = /Android/i.exec(e), M = /FBAN\/\w+;/i.exec(e), F = /Mobile/i.exec(e), D = !!/Win64/.exec(e), n) {
			o = n[1] ? parseFloat(n[1]) : n[5] ? parseFloat(n[5]) : NaN, o && document && document.documentMode && (o = document.documentMode);
			var r = /(?:Trident\/(\d+.\d+))/.exec(e);
			N = r ? parseFloat(r[1]) + 4 : o, f = n[2] ? parseFloat(n[2]) : NaN, s = n[3] ? parseFloat(n[3]) : NaN, u = n[4] ? parseFloat(n[4]) : NaN, u ? (n = /(?:Chrome\/(\d+\.\d+))/.exec(e), d = n && n[1] ? parseFloat(n[1]) : NaN) : d = NaN;
		} else o = f = s = d = u = NaN;
		if (i) {
			if (i[1]) {
				var t = /(?:Mac OS X (\d+(?:[._]\d+)?))/.exec(e);
				l = t ? parseFloat(t[1].replace("_", ".")) : !0;
			} else l = !1;
			p = !!i[2], m = !!i[3];
		} else l = p = m = !1;
	}
}
var _ = {
	ie: function() {
		return a() || o;
	},
	ieCompatibilityMode: function() {
		return a() || N > o;
	},
	ie64: function() {
		return _.ie() && D;
	},
	firefox: function() {
		return a() || f;
	},
	opera: function() {
		return a() || s;
	},
	webkit: function() {
		return a() || u;
	},
	safari: function() {
		return _.webkit();
	},
	chrome: function() {
		return a() || d;
	},
	windows: function() {
		return a() || p;
	},
	osx: function() {
		return a() || l;
	},
	linux: function() {
		return a() || m;
	},
	iphone: function() {
		return a() || x;
	},
	mobile: function() {
		return a() || x || E || w || F;
	},
	nativeApp: function() {
		return a() || M;
	},
	android: function() {
		return a() || w;
	},
	ipad: function() {
		return a() || E;
	}
};
var A = _;
var c = !!(typeof window < "u" && window.document && window.document.createElement);
var h = {
	canUseDOM: c,
	canUseWorkers: typeof Worker < "u",
	canUseEventListeners: c && !!(window.addEventListener || window.attachEvent),
	canUseViewport: c && !!window.screen,
	isInWorker: !c
};
var X;
h.canUseDOM && (X = document.implementation && document.implementation.hasFeature && document.implementation.hasFeature("", "") !== !0);
function S(e, n) {
	if (!h.canUseDOM || n && !("addEventListener" in document)) return !1;
	var i = "on" + e, r = i in document;
	if (!r) {
		var t = document.createElement("div");
		t.setAttribute(i, "return;"), r = typeof t[i] == "function";
	}
	return !r && X && e === "wheel" && (r = document.implementation.hasFeature("Events.wheel", "3.0")), r;
}
var b = S;
var O = 10;
var I = 40;
var P = 800;
function T(e) {
	var n = 0, i = 0, r = 0, t = 0;
	return "detail" in e && (i = e.detail), "wheelDelta" in e && (i = -e.wheelDelta / 120), "wheelDeltaY" in e && (i = -e.wheelDeltaY / 120), "wheelDeltaX" in e && (n = -e.wheelDeltaX / 120), "axis" in e && e.axis === e.HORIZONTAL_AXIS && (n = i, i = 0), r = n * O, t = i * O, "deltaY" in e && (t = e.deltaY), "deltaX" in e && (r = e.deltaX), (r || t) && e.deltaMode && (e.deltaMode == 1 ? (r *= I, t *= I) : (r *= P, t *= P)), r && !n && (n = r < 1 ? -1 : 1), t && !i && (i = t < 1 ? -1 : 1), {
		spinX: n,
		spinY: i,
		pixelX: r,
		pixelY: t
	};
}
T.getEventType = function() {
	return A.firefox() ? "DOMMouseScroll" : b("wheel") ? "wheel" : "mousewheel";
};
var Y = T;
/**
* Checks if an event is supported in the current execution environment.
*
* NOTE: This will not work correctly for non-generic events such as `change`,
* `reset`, `load`, `error`, and `select`.
*
* Borrows from Modernizr.
*
* @param {string} eventNameSuffix Event name, e.g. "click".
* @param {?boolean} capture Check if the capture phase is supported.
* @return {boolean} True if the event is supported.
* @internal
* @license Modernizr 3.0.0pre (Custom Build) | MIT
*/
//#endregion
//#region node_modules/element-plus/es/directives/mousewheel/index.mjs
var SCOPE = "_Mousewheel";
var mousewheel = function(element, callback) {
	if (element && element.addEventListener) {
		removeWheelHandler(element);
		const fn = function(event) {
			const normalized = Y(event);
			callback && Reflect.apply(callback, this, [event, normalized]);
		};
		element[SCOPE] = { wheelHandler: fn };
		element.addEventListener("wheel", fn, { passive: true });
	}
};
var removeWheelHandler = (element) => {
	if (element["_Mousewheel"]?.wheelHandler) {
		element.removeEventListener("wheel", element[SCOPE].wheelHandler);
		element[SCOPE] = null;
	}
};
var Mousewheel = {
	beforeMount(el, binding) {
		mousewheel(el, binding.value);
	},
	unmounted(el) {
		removeWheelHandler(el);
	},
	updated(el, binding) {
		if (binding.value !== binding.oldValue) mousewheel(el, binding.value);
	}
};
//#endregion
//#region node_modules/element-plus/es/components/tag/src/tag.mjs
/**
* @deprecated Removed after 3.0.0, Use `TagProps` instead.
*/
var tagProps = buildProps({
	/**
	* @description type of Tag
	*/
	type: {
		type: String,
		values: [
			"primary",
			"success",
			"info",
			"warning",
			"danger"
		],
		default: "primary"
	},
	/**
	* @description whether Tag can be removed
	*/
	closable: Boolean,
	/**
	* @description whether to disable animations
	*/
	disableTransitions: Boolean,
	/**
	* @description whether Tag has a highlighted border
	*/
	hit: Boolean,
	/**
	* @description background color of the Tag
	*/
	color: String,
	/**
	* @description size of Tag
	*/
	size: {
		type: String,
		values: componentSizes
	},
	/**
	* @description theme of Tag
	*/
	effect: {
		type: String,
		values: [
			"dark",
			"light",
			"plain"
		],
		default: "light"
	},
	/**
	* @description whether Tag is rounded
	*/
	round: Boolean
});
var tagEmits = {
	close: (evt) => evt instanceof MouseEvent,
	click: (evt) => evt instanceof MouseEvent
};
//#endregion
//#region node_modules/element-plus/es/components/tag/src/tag.vue_vue_type_script_setup_true_lang.mjs
var _hoisted_1$17 = ["aria-label"];
var _hoisted_2$9 = ["aria-label"];
//#endregion
//#region node_modules/element-plus/es/components/tag/index.mjs
var ElTag = withInstall(/* @__PURE__ */ defineComponent({
	name: "ElTag",
	__name: "tag",
	props: tagProps,
	emits: tagEmits,
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const tagSize = useFormSize();
		const { t } = useLocale();
		const ns = useNamespace("tag");
		const containerKls = computed(() => {
			const { type, hit, effect, closable, round } = props;
			return [
				ns.b(),
				ns.is("closable", closable),
				ns.m(type || "primary"),
				ns.m(tagSize.value),
				ns.m(effect),
				ns.is("hit", hit),
				ns.is("round", round)
			];
		});
		const handleClose = (event) => {
			emit("close", event);
		};
		const handleClick = (event) => {
			emit("click", event);
		};
		const handleVNodeMounted = (vnode) => {
			if (vnode?.component?.subTree?.component?.bum) vnode.component.subTree.component.bum = null;
		};
		return (_ctx, _cache) => {
			return __props.disableTransitions ? (openBlock(), createElementBlock("span", {
				key: 0,
				class: normalizeClass(containerKls.value),
				style: normalizeStyle({ backgroundColor: __props.color }),
				onClick: handleClick
			}, [createBaseVNode("span", { class: normalizeClass(unref(ns).e("content")) }, [renderSlot(_ctx.$slots, "default")], 2), __props.closable ? (openBlock(), createElementBlock("button", {
				key: 0,
				"aria-label": unref(t)("el.tag.close"),
				class: normalizeClass(unref(ns).e("close")),
				type: "button",
				onClick: withModifiers(handleClose, ["stop"])
			}, [createVNode(unref(ElIcon), null, {
				default: withCtx(() => [createVNode(unref(close_default))]),
				_: 1
			})], 10, _hoisted_1$17)) : createCommentVNode("v-if", true)], 6)) : (openBlock(), createBlock(Transition, {
				key: 1,
				name: `${unref(ns).namespace.value}-zoom-in-center`,
				appear: "",
				onVnodeMounted: handleVNodeMounted
			}, {
				default: withCtx(() => [createBaseVNode("span", {
					class: normalizeClass(containerKls.value),
					style: normalizeStyle({ backgroundColor: __props.color }),
					onClick: handleClick
				}, [createBaseVNode("span", { class: normalizeClass(unref(ns).e("content")) }, [renderSlot(_ctx.$slots, "default")], 2), __props.closable ? (openBlock(), createElementBlock("button", {
					key: 0,
					"aria-label": unref(t)("el.tag.close"),
					class: normalizeClass(unref(ns).e("close")),
					type: "button",
					onClick: withModifiers(handleClose, ["stop"])
				}, [createVNode(unref(ElIcon), null, {
					default: withCtx(() => [createVNode(unref(close_default))]),
					_: 1
				})], 10, _hoisted_2$9)) : createCommentVNode("v-if", true)], 6)]),
				_: 3
			}, 8, ["name"]));
		};
	}
}));
//#endregion
//#region node_modules/element-plus/es/components/select/src/token.mjs
var selectGroupKey = Symbol("ElSelectGroup");
var selectKey = Symbol("ElSelect");
//#endregion
//#region node_modules/element-plus/es/components/select-v2/src/useProps.mjs
var defaultProps$1 = {
	label: "label",
	value: "value",
	disabled: "disabled",
	options: "options"
};
function useProps(props) {
	const aliasProps = /* @__PURE__ */ ref({
		...defaultProps$1,
		...props.props
	});
	let cache = { ...props.props };
	watch(() => props.props, (val) => {
		if (!isEqual(val, cache)) {
			aliasProps.value = {
				...defaultProps$1,
				...val
			};
			cache = { ...val };
		}
	}, { deep: true });
	const getLabel = (option) => get(option, aliasProps.value.label);
	const getValue = (option) => get(option, aliasProps.value.value);
	const getDisabled = (option) => get(option, aliasProps.value.disabled);
	const getOptions = (option) => get(option, aliasProps.value.options);
	return {
		aliasProps,
		getLabel,
		getValue,
		getDisabled,
		getOptions
	};
}
//#endregion
//#region node_modules/element-plus/es/components/select/src/select.mjs
var selectProps = buildProps({
	/**
	* @description the name attribute of select input
	*/
	name: String,
	/**
	* @description native input id
	*/
	id: String,
	/**
	* @description binding value
	*/
	modelValue: {
		type: definePropType([
			Array,
			String,
			Number,
			Boolean,
			Object
		]),
		default: void 0
	},
	/**
	* @description the autocomplete attribute of select input
	*/
	autocomplete: {
		type: String,
		default: "off"
	},
	/**
	* @description for non-filterable Select, this prop decides if the option menu pops up when the input is focused
	*/
	automaticDropdown: Boolean,
	/**
	* @description size of Input
	*/
	size: useSizeProp,
	/**
	* @description tooltip theme, built-in theme: `dark` / `light`
	*/
	effect: {
		type: definePropType(String),
		default: "light"
	},
	/**
	* @description whether Select is disabled
	*/
	disabled: {
		type: Boolean,
		default: void 0
	},
	/**
	* @description whether select can be cleared
	*/
	clearable: Boolean,
	/**
	* @description whether Select is filterable
	*/
	filterable: Boolean,
	/**
	* @description whether creating new items is allowed. To use this, `filterable` must be true
	*/
	allowCreate: Boolean,
	/**
	* @description whether Select is loading data from server
	*/
	loading: Boolean,
	/**
	* @description custom class name for Select's dropdown
	*/
	popperClass: {
		type: String,
		default: ""
	},
	/**
	* @description custom style for Select's dropdown
	*/
	popperStyle: { type: definePropType([String, Object]) },
	/**
	* @description [popper.js](https://popper.js.org/docs/v2/) parameters
	*/
	popperOptions: {
		type: definePropType(Object),
		default: () => ({})
	},
	/**
	* @description whether options are loaded from server
	*/
	remote: Boolean,
	/**
	* @description debounce delay during remote search, in milliseconds
	*/
	debounce: {
		type: Number,
		default: 300
	},
	/**
	* @description displayed text while loading data from server, default is 'Loading'
	*/
	loadingText: String,
	/**
	* @description displayed text when no data matches the filtering query, you can also use slot `empty`, default is 'No matching data'
	*/
	noMatchText: String,
	/**
	* @description displayed text when there is no options, you can also use slot `empty`, default is 'No data'
	*/
	noDataText: String,
	/**
	* @description function that gets called when the input value changes. Its parameter is the current input value. To use this, `filterable` must be true
	*/
	remoteMethod: { type: definePropType(Function) },
	/**
	* @description custom filter method, the first parameter is the current input value. To use this, `filterable` must be true
	*/
	filterMethod: { type: definePropType(Function) },
	/**
	* @description whether multiple-select is activated
	*/
	multiple: Boolean,
	/**
	* @description maximum number of options user can select when `multiple` is `true`. No limit when set to 0
	*/
	multipleLimit: {
		type: Number,
		default: 0
	},
	/**
	* @description placeholder, default is 'Select'
	*/
	placeholder: { type: String },
	/**
	* @description select first matching option on enter key. Use with `filterable` or `remote`
	*/
	defaultFirstOption: Boolean,
	/**
	* @description when `multiple` and `filter` is true, whether to reserve current keyword after selecting an option
	*/
	reserveKeyword: {
		type: Boolean,
		default: true
	},
	/**
	* @description unique identity key name for value, required when value is an object
	*/
	valueKey: {
		type: String,
		default: "value"
	},
	/**
	* @description whether to collapse tags to a text when multiple selecting
	*/
	collapseTags: Boolean,
	/**
	* @description whether show all selected tags when mouse hover text of collapse-tags. To use this, `collapse-tags` must be true
	*/
	collapseTagsTooltip: Boolean,
	/**
	* @description configuration object for the collapse-tags tooltip. To use this, `collapse-tags` and `collapse-tags-tooltip` must be true
	*/
	tagTooltip: {
		type: definePropType(Object),
		default: () => ({})
	},
	/**
	* @description the max tags number to be shown. To use this, `collapse-tags` must be true
	*/
	maxCollapseTags: {
		type: Number,
		default: 1
	},
	/**
	* @description whether select dropdown is teleported, if `true` it will be teleported to where `append-to` sets
	*/
	teleported: useTooltipContentProps.teleported,
	/**
	* @description when select dropdown is inactive and `persistent` is `false`, select dropdown will be destroyed
	*/
	persistent: {
		type: Boolean,
		default: true
	},
	/**
	* @description custom clear icon component
	*/
	clearIcon: {
		type: iconPropType,
		default: circle_close_default
	},
	/**
	* @description whether the width of the dropdown is the same as the input
	*/
	fitInputWidth: Boolean,
	/**
	* @description custom suffix icon component
	*/
	suffixIcon: {
		type: iconPropType,
		default: arrow_down_default
	},
	/**
	* @description tag type
	*/
	tagType: {
		...tagProps.type,
		default: "info"
	},
	/**
	* @description tag effect
	*/
	tagEffect: {
		...tagProps.effect,
		default: "light"
	},
	/**
	* @description whether to trigger form validation
	*/
	validateEvent: {
		type: Boolean,
		default: true
	},
	/**
	* @description in remote search method show suffix icon
	*/
	remoteShowSuffix: Boolean,
	/**
	* @description determines whether the arrow is displayed
	*/
	showArrow: {
		type: Boolean,
		default: true
	},
	/**
	* @description offset of the dropdown
	*/
	offset: {
		type: Number,
		default: 12
	},
	/**
	* @description position of dropdown
	*/
	placement: {
		type: definePropType(String),
		values: Ee,
		default: "bottom-start"
	},
	/**
	* @description list of possible positions for dropdown
	*/
	fallbackPlacements: {
		type: definePropType(Array),
		default: [
			"bottom-start",
			"top-start",
			"right",
			"left"
		]
	},
	/**
	* @description tabindex for input
	*/
	tabindex: {
		type: [String, Number],
		default: 0
	},
	/**
	* @description which element the selection dropdown appends to
	*/
	appendTo: useTooltipContentProps.appendTo,
	options: { type: definePropType(Array) },
	props: {
		type: definePropType(Object),
		default: () => defaultProps$1
	},
	...useEmptyValuesProps,
	...useAriaProps(["ariaLabel"])
});
var selectEmits = {
	[UPDATE_MODEL_EVENT]: (val) => true,
	[CHANGE_EVENT]: (val) => true,
	"popup-scroll": scrollbarEmits.scroll,
	"end-reached": scrollbarEmits["end-reached"],
	"remove-tag": (val) => true,
	"visible-change": (visible) => true,
	focus: (evt) => evt instanceof FocusEvent,
	blur: (evt) => evt instanceof FocusEvent,
	clear: () => true
};
//#endregion
//#region node_modules/element-plus/es/components/select/src/option.mjs
var COMPONENT_NAME$3 = "ElOption";
var optionProps = buildProps({
	/**
	* @description value of option
	*/
	value: {
		type: [
			String,
			Number,
			Boolean,
			Object
		],
		required: true
	},
	/**
	* @description label of option, same as `value` if omitted
	*/
	label: { type: [String, Number] },
	created: Boolean,
	/**
	* @description whether option is disabled
	*/
	disabled: Boolean
});
//#endregion
//#region node_modules/element-plus/es/components/select/src/useOption.mjs
function useOption(props, states) {
	const select = inject(selectKey);
	if (!select) throwError(COMPONENT_NAME$3, "usage: <el-select><el-option /></el-select/>");
	const selectGroup = inject(selectGroupKey, { disabled: false });
	const itemSelected = computed(() => {
		return contains(castArray$1(select.props.modelValue), props.value);
	});
	const limitReached = computed(() => {
		if (select.props.multiple) {
			const modelValue = castArray$1(select.props.modelValue ?? []);
			return !itemSelected.value && modelValue.length >= select.props.multipleLimit && select.props.multipleLimit > 0;
		} else return false;
	});
	const currentLabel = computed(() => {
		return props.label ?? (isObject$2(props.value) ? "" : props.value);
	});
	const currentValue = computed(() => {
		return props.value || props.label || "";
	});
	const isDisabled = computed(() => {
		return props.disabled || states.groupDisabled || limitReached.value;
	});
	const instance = getCurrentInstance();
	const contains = (arr = [], target) => {
		if (!isObject$2(props.value)) return arr && arr.includes(target);
		else {
			const valueKey = select.props.valueKey;
			return arr && arr.some((item) => {
				return /* @__PURE__ */ toRaw(get(item, valueKey)) === get(target, valueKey);
			});
		}
	};
	const hoverItem = () => {
		if (!isDisabled.value) select.states.hoveringIndex = select.optionsArray.indexOf(instance.proxy);
	};
	const updateOption = (query) => {
		states.visible = new RegExp(escapeStringRegexp(query), "i").test(String(currentLabel.value)) || props.created;
	};
	watch(() => currentLabel.value, () => {
		if (!props.created && !select.props.remote) select.setSelected();
	});
	watch(() => props.value, (val, oldVal) => {
		const { remote, valueKey } = select.props;
		if (remote ? val !== oldVal : !isEqual(val, oldVal)) {
			select.onOptionDestroy(oldVal, instance.proxy);
			select.onOptionCreate(instance.proxy);
		}
		if (!props.created && !remote) {
			if (valueKey && isObject$2(val) && isObject$2(oldVal) && val[valueKey] === oldVal[valueKey]) return;
			select.setSelected();
		}
	});
	watch(() => selectGroup.disabled, () => {
		states.groupDisabled = selectGroup.disabled;
	}, { immediate: true });
	return {
		select,
		currentLabel,
		currentValue,
		itemSelected,
		isDisabled,
		hoverItem,
		updateOption
	};
}
//#endregion
//#region node_modules/element-plus/es/components/select/src/option.vue_vue_type_script_lang.mjs
var option_vue_vue_type_script_lang_default = /* @__PURE__ */ defineComponent({
	name: COMPONENT_NAME$3,
	componentName: COMPONENT_NAME$3,
	props: optionProps,
	setup(props) {
		const ns = useNamespace("select");
		const id = useId();
		const containerKls = computed(() => [
			ns.be("dropdown", "item"),
			ns.is("disabled", unref(isDisabled)),
			ns.is("selected", unref(itemSelected)),
			ns.is("hovering", unref(hover))
		]);
		const states = /* @__PURE__ */ reactive({
			index: -1,
			groupDisabled: false,
			visible: true,
			hover: false
		});
		const mouseMoveEventName = isIOS ? null : "mousemove";
		const { currentLabel, itemSelected, isDisabled, select, hoverItem, updateOption } = useOption(props, states);
		const { visible, hover } = /* @__PURE__ */ toRefs(states);
		const vm = getCurrentInstance().proxy;
		select.onOptionCreate(vm);
		onBeforeUnmount(() => {
			const key = vm.value;
			nextTick(() => {
				const { selected: selectedOptions } = select.states;
				const doesSelected = selectedOptions.some((item) => {
					return item.value === vm.value;
				});
				if (select.states.cachedOptions.get(key) === vm && !doesSelected) select.states.cachedOptions.delete(key);
			});
			select.onOptionDestroy(key, vm);
		});
		function selectOptionClick() {
			if (!isDisabled.value) select.handleOptionSelect(vm);
		}
		const handleMousedown = (event) => {
			let target = event.target;
			const currentTarget = event.currentTarget;
			while (target && target !== currentTarget) {
				if (isFocusable(target)) return;
				target = target.parentElement;
			}
			event.preventDefault();
		};
		return {
			ns,
			id,
			containerKls,
			currentLabel,
			itemSelected,
			isDisabled,
			select,
			visible,
			hover,
			states,
			mouseMoveEventName,
			hoverItem,
			handleMousedown,
			updateOption,
			selectOptionClick
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/select/src/option2.mjs
var _hoisted_1$16 = [
	"id",
	"aria-disabled",
	"aria-selected"
];
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
	return withDirectives((openBlock(), createElementBlock("li", mergeProps({
		id: _ctx.id,
		class: _ctx.containerKls,
		role: "option",
		"aria-disabled": _ctx.isDisabled || void 0,
		"aria-selected": _ctx.itemSelected
	}, { [toHandlerKey(_ctx.mouseMoveEventName)]: _cache[0] || (_cache[0] = (...args) => _ctx.hoverItem && _ctx.hoverItem(...args)) }, {
		onMousedown: _cache[1] || (_cache[1] = (...args) => _ctx.handleMousedown && _ctx.handleMousedown(...args)),
		onClick: _cache[2] || (_cache[2] = withModifiers((...args) => _ctx.selectOptionClick && _ctx.selectOptionClick(...args), ["stop"]))
	}), [renderSlot(_ctx.$slots, "default", {}, () => [createBaseVNode("span", null, toDisplayString(_ctx.currentLabel), 1)])], 16, _hoisted_1$16)), [[vShow, _ctx.visible]]);
}
var option_default = /* @__PURE__ */ _plugin_vue_export_helper_default$1(option_vue_vue_type_script_lang_default, [["render", _sfc_render$5]]);
//#endregion
//#region node_modules/element-plus/es/components/select/src/option-group.vue_vue_type_script_lang.mjs
var option_group_vue_vue_type_script_lang_default = /* @__PURE__ */ defineComponent({
	name: "ElOptionGroup",
	componentName: "ElOptionGroup",
	props: {
		/**
		* @description name of the group
		*/
		label: String,
		/**
		* @description whether to disable all options in this group
		*/
		disabled: Boolean
	},
	setup(props) {
		const ns = useNamespace("select");
		const groupRef = /* @__PURE__ */ ref();
		const instance = getCurrentInstance();
		const children = /* @__PURE__ */ ref([]);
		provide(selectGroupKey, /* @__PURE__ */ reactive({ .../* @__PURE__ */ toRefs(props) }));
		const visible = computed(() => children.value.some((option) => option.visible === true));
		const isOption = (node) => node.type.name === "ElOption" && !!node.component?.proxy;
		const flattedChildren = (node) => {
			const nodes = castArray$1(node);
			const children = [];
			nodes.forEach((child) => {
				if (!isVNode(child)) return;
				if (isOption(child)) children.push(child.component.proxy);
				else if (isArray$1(child.children) && child.children.length) children.push(...flattedChildren(child.children));
				else if (child.component?.subTree) children.push(...flattedChildren(child.component.subTree));
			});
			return children;
		};
		const updateChildren = () => {
			children.value = flattedChildren(instance.subTree);
		};
		onMounted(() => {
			updateChildren();
		});
		useMutationObserver(groupRef, updateChildren, {
			attributes: true,
			subtree: true,
			childList: true
		});
		return {
			groupRef,
			visible,
			ns
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/select/src/option-group.mjs
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
	return withDirectives((openBlock(), createElementBlock("ul", {
		ref: "groupRef",
		class: normalizeClass(_ctx.ns.be("group", "wrap"))
	}, [createBaseVNode("li", { class: normalizeClass(_ctx.ns.be("group", "title")) }, toDisplayString(_ctx.label), 3), createBaseVNode("li", null, [createBaseVNode("ul", { class: normalizeClass(_ctx.ns.b("group")) }, [renderSlot(_ctx.$slots, "default")], 2)])], 2)), [[vShow, _ctx.visible]]);
}
var option_group_default = /* @__PURE__ */ _plugin_vue_export_helper_default$1(option_group_vue_vue_type_script_lang_default, [["render", _sfc_render$4]]);
//#endregion
//#region node_modules/element-plus/es/components/select/src/select-dropdown.vue_vue_type_script_lang.mjs
var select_dropdown_vue_vue_type_script_lang_default = /* @__PURE__ */ defineComponent({
	name: "ElSelectDropdown",
	componentName: "ElSelectDropdown",
	setup() {
		const select = inject(selectKey);
		const ns = useNamespace("select");
		const popperClass = computed(() => select.props.popperClass);
		const isMultiple = computed(() => select.props.multiple);
		const isFitInputWidth = computed(() => select.props.fitInputWidth);
		const minWidth = /* @__PURE__ */ ref("");
		function updateMinWidth() {
			const offsetWidth = select.selectRef?.offsetWidth;
			if (offsetWidth) minWidth.value = `${offsetWidth - 2}px`;
			else minWidth.value = "";
		}
		onMounted(() => {
			updateMinWidth();
			useResizeObserver(select.selectRef, updateMinWidth);
		});
		return {
			ns,
			minWidth,
			popperClass,
			isMultiple,
			isFitInputWidth
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/select/src/select-dropdown.mjs
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
	return openBlock(), createElementBlock("div", {
		class: normalizeClass([
			_ctx.ns.b("dropdown"),
			_ctx.ns.is("multiple", _ctx.isMultiple),
			_ctx.popperClass
		]),
		style: normalizeStyle({ [_ctx.isFitInputWidth ? "width" : "minWidth"]: _ctx.minWidth })
	}, [
		_ctx.$slots.header ? (openBlock(), createElementBlock("div", {
			key: 0,
			class: normalizeClass(_ctx.ns.be("dropdown", "header"))
		}, [renderSlot(_ctx.$slots, "header")], 2)) : createCommentVNode("v-if", true),
		renderSlot(_ctx.$slots, "default"),
		_ctx.$slots.footer ? (openBlock(), createElementBlock("div", {
			key: 1,
			class: normalizeClass(_ctx.ns.be("dropdown", "footer"))
		}, [renderSlot(_ctx.$slots, "footer")], 2)) : createCommentVNode("v-if", true)
	], 6);
}
var select_dropdown_default = /* @__PURE__ */ _plugin_vue_export_helper_default$1(select_dropdown_vue_vue_type_script_lang_default, [["render", _sfc_render$3]]);
//#endregion
//#region node_modules/element-plus/es/components/select/src/useSelect.mjs
var useSelect = (props, emit) => {
	const { t } = useLocale();
	const slots = useSlots();
	const contentId = useId();
	const nsSelect = useNamespace("select");
	const nsInput = useNamespace("input");
	const states = /* @__PURE__ */ reactive({
		inputValue: "",
		options: /* @__PURE__ */ new Map(),
		cachedOptions: /* @__PURE__ */ new Map(),
		optionValues: [],
		selected: [],
		selectionWidth: 0,
		collapseItemWidth: 0,
		selectedLabel: "",
		hoveringIndex: -1,
		previousQuery: null,
		inputHovering: false,
		menuVisibleOnFocus: false,
		isBeforeHide: false
	});
	const selectRef = /* @__PURE__ */ ref();
	const selectionRef = /* @__PURE__ */ ref();
	const tooltipRef = /* @__PURE__ */ ref();
	const tagTooltipRef = /* @__PURE__ */ ref();
	const inputRef = /* @__PURE__ */ ref();
	const prefixRef = /* @__PURE__ */ ref();
	const suffixRef = /* @__PURE__ */ ref();
	const menuRef = /* @__PURE__ */ ref();
	const tagMenuRef = /* @__PURE__ */ ref();
	const collapseItemRef = /* @__PURE__ */ ref();
	const scrollbarRef = /* @__PURE__ */ ref();
	const expanded = /* @__PURE__ */ ref(false);
	const hoverOption = /* @__PURE__ */ ref();
	const debouncing = /* @__PURE__ */ ref(false);
	const { form, formItem } = useFormItem();
	const { inputId } = useFormItemInputId(props, { formItemContext: formItem });
	const { valueOnClear, isEmptyValue } = useEmptyValues(props);
	const { isComposing, handleCompositionStart, handleCompositionUpdate, handleCompositionEnd } = useComposition({ afterComposition: (e) => onInput(e) });
	const selectDisabled = useFormDisabled();
	const { wrapperRef, isFocused, handleBlur } = useFocusController(inputRef, {
		disabled: selectDisabled,
		afterFocus() {
			if (props.automaticDropdown && !expanded.value) {
				expanded.value = true;
				states.menuVisibleOnFocus = true;
			}
		},
		beforeBlur(event) {
			return tooltipRef.value?.isFocusInsideContent(event) || tagTooltipRef.value?.isFocusInsideContent(event);
		},
		afterBlur() {
			expanded.value = false;
			states.menuVisibleOnFocus = false;
			if (props.validateEvent) formItem?.validate?.("blur").catch(NOOP);
		}
	});
	const hasModelValue = computed(() => {
		return isArray$1(props.modelValue) ? props.modelValue.length > 0 : !isEmptyValue(props.modelValue);
	});
	const needStatusIcon = computed(() => form?.statusIcon ?? false);
	const showClearBtn = computed(() => {
		return props.clearable && !selectDisabled.value && hasModelValue.value && (isFocused.value || states.inputHovering);
	});
	const iconComponent = computed(() => props.remote && props.filterable && !props.remoteShowSuffix ? "" : props.suffixIcon);
	const iconReverse = computed(() => nsSelect.is("reverse", !!(iconComponent.value && expanded.value)));
	const validateState = computed(() => formItem?.validateState || "");
	const validateIcon = computed(() => validateState.value && ValidateComponentsMap[validateState.value]);
	const debounce = computed(() => props.remote ? props.debounce : 0);
	const isRemoteSearchEmpty = computed(() => props.remote && !states.inputValue && states.options.size === 0);
	const emptyText = computed(() => {
		if (props.loading) return props.loadingText || t("el.select.loading");
		else {
			if (props.filterable && states.inputValue && states.options.size > 0 && filteredOptionsCount.value === 0) return props.noMatchText || t("el.select.noMatch");
			if (states.options.size === 0) return props.noDataText || t("el.select.noData");
		}
		return null;
	});
	const filteredOptionsCount = computed(() => optionsArray.value.filter((option) => option.visible).length);
	const optionsArray = computed(() => {
		const list = Array.from(states.options.values());
		const newList = [];
		states.optionValues.forEach((item) => {
			const index = list.findIndex((i) => i.value === item);
			if (index > -1) newList.push(list[index]);
		});
		return newList.length >= list.length ? newList : list;
	});
	const cachedOptionsArray = computed(() => Array.from(states.cachedOptions.values()));
	const showNewOption = computed(() => {
		const hasExistingOption = optionsArray.value.filter((option) => {
			return !option.created;
		}).some((option) => {
			return option.currentLabel === states.inputValue;
		});
		return props.filterable && props.allowCreate && states.inputValue !== "" && !hasExistingOption;
	});
	const updateOptions = () => {
		if (props.filterable && isFunction$1(props.filterMethod)) return;
		if (props.filterable && props.remote && isFunction$1(props.remoteMethod)) return;
		optionsArray.value.forEach((option) => {
			option.updateOption?.(states.inputValue);
		});
	};
	const selectSize = useFormSize();
	const collapseTagSize = computed(() => ["small"].includes(selectSize.value) ? "small" : "default");
	const dropdownMenuVisible = computed({
		get() {
			return expanded.value && (props.loading || !isRemoteSearchEmpty.value || props.remote && !!slots.empty) && (!debouncing.value || !isEmpty(states.previousQuery) || states.options.size > 0);
		},
		set(val) {
			expanded.value = val;
		}
	});
	const shouldShowPlaceholder = computed(() => {
		if (props.multiple && !isUndefined(props.modelValue)) return castArray$1(props.modelValue).length === 0 && !states.inputValue;
		const value = isArray$1(props.modelValue) ? props.modelValue[0] : props.modelValue;
		return props.filterable || isUndefined(value) ? !states.inputValue : true;
	});
	const currentPlaceholder = computed(() => {
		const _placeholder = props.placeholder ?? t("el.select.placeholder");
		return props.multiple || !hasModelValue.value ? _placeholder : states.selectedLabel;
	});
	const mouseEnterEventName = isIOS ? null : "mouseenter";
	watch(() => props.modelValue, (val, oldVal) => {
		if (props.multiple) {
			if (props.filterable && !props.reserveKeyword) {
				states.inputValue = "";
				handleQueryChange("");
			}
		}
		setSelected();
		if (!isEqual(val, oldVal) && props.validateEvent) formItem?.validate("change").catch(NOOP);
	}, {
		flush: "post",
		deep: true
	});
	watch(() => expanded.value, (val) => {
		if (val) handleQueryChange(states.inputValue);
		else {
			states.inputValue = "";
			states.previousQuery = null;
			states.isBeforeHide = true;
			states.menuVisibleOnFocus = false;
		}
	});
	watch(() => states.options.entries(), () => {
		if (!isClient) return;
		setSelected();
		if (props.defaultFirstOption && (props.filterable || props.remote) && filteredOptionsCount.value) checkDefaultFirstOption();
	}, { flush: "post" });
	watch([() => states.hoveringIndex, optionsArray], ([val]) => {
		if (isNumber(val) && val > -1) hoverOption.value = optionsArray.value[val] || {};
		else hoverOption.value = {};
		optionsArray.value.forEach((option) => {
			option.hover = hoverOption.value === option;
		});
	});
	watchEffect(() => {
		if (states.isBeforeHide) return;
		updateOptions();
	});
	const handleQueryChange = (val) => {
		if (states.previousQuery === val || isComposing.value) return;
		states.previousQuery = val;
		if (props.filterable && isFunction$1(props.filterMethod)) props.filterMethod(val);
		else if (props.filterable && props.remote && isFunction$1(props.remoteMethod)) props.remoteMethod(val);
		if (props.defaultFirstOption && (props.filterable || props.remote) && filteredOptionsCount.value) nextTick(checkDefaultFirstOption);
		else nextTick(updateHoveringIndex);
	};
	/**
	* find and highlight first option as default selected
	* @remark
	* - if the first option in dropdown list is user-created,
	*   it would be at the end of the optionsArray
	*   so find it and set hover.
	*   (NOTE: there must be only one user-created option in dropdown list with query)
	* - if there's no user-created option in list, just find the first one as usual
	*   (NOTE: exclude options that are disabled or in disabled-group)
	*/
	const checkDefaultFirstOption = () => {
		const optionsInDropdown = optionsArray.value.filter((n) => n.visible && !n.disabled && !n.states.groupDisabled);
		const userCreatedOption = optionsInDropdown.find((n) => n.created);
		const firstOriginOption = optionsInDropdown[0];
		states.hoveringIndex = getValueIndex(optionsArray.value.map((item) => item.value), userCreatedOption || firstOriginOption);
	};
	const setSelected = () => {
		if (!props.multiple) {
			const option = getOption(isArray$1(props.modelValue) ? props.modelValue[0] : props.modelValue);
			states.selectedLabel = option.currentLabel;
			states.selected = [option];
			return;
		} else states.selectedLabel = "";
		const result = [];
		if (!isUndefined(props.modelValue)) castArray$1(props.modelValue).forEach((value) => {
			result.push(getOption(value));
		});
		states.selected = result;
	};
	const getOption = (value) => {
		let option;
		const isObjectValue = isPlainObject$1(value);
		for (let i = states.cachedOptions.size - 1; i >= 0; i--) {
			const cachedOption = cachedOptionsArray.value[i];
			if (isObjectValue ? get(cachedOption.value, props.valueKey) === get(value, props.valueKey) : cachedOption.value === value) {
				option = {
					index: optionsArray.value.filter((opt) => !opt.created).indexOf(cachedOption),
					value,
					currentLabel: cachedOption.currentLabel,
					get isDisabled() {
						return cachedOption.isDisabled;
					}
				};
				break;
			}
		}
		if (option) return option;
		const existingSelected = states.selected.find((item) => isObjectValue ? get(item.value, props.valueKey) === get(value, props.valueKey) : item.value === value);
		return {
			index: -1,
			value,
			currentLabel: isObjectValue ? value.label : existingSelected ? existingSelected.currentLabel : value ?? ""
		};
	};
	const updateHoveringIndex = () => {
		const length = states.selected.length;
		if (length > 0) {
			const lastOption = states.selected[length - 1];
			states.hoveringIndex = optionsArray.value.findIndex((item) => getValueKey(lastOption) === getValueKey(item));
		} else states.hoveringIndex = -1;
	};
	const resetSelectionWidth = () => {
		states.selectionWidth = Number.parseFloat(window.getComputedStyle(selectionRef.value).width);
	};
	const resetCollapseItemWidth = () => {
		states.collapseItemWidth = collapseItemRef.value.getBoundingClientRect().width;
	};
	const updateTooltip = () => {
		tooltipRef.value?.updatePopper?.();
	};
	const updateTagTooltip = () => {
		tagTooltipRef.value?.updatePopper?.();
	};
	const onInputChange = () => {
		if (states.inputValue.length > 0 && !expanded.value) expanded.value = true;
		handleQueryChange(states.inputValue);
	};
	const onInput = (event) => {
		states.inputValue = event.target.value;
		if (props.remote) {
			debouncing.value = true;
			debouncedOnInputChange();
		} else return onInputChange();
	};
	const debouncedOnInputChange = useDebounceFn(() => {
		onInputChange();
		debouncing.value = false;
	}, debounce);
	const emitChange = (val) => {
		if (!isEqual(props.modelValue, val)) emit(CHANGE_EVENT, val);
	};
	const getLastNotDisabledIndex = (value) => findLastIndex(value, (it) => {
		const option = states.cachedOptions.get(it);
		return !option?.disabled && !option?.states.groupDisabled;
	});
	const deletePrevTag = (e) => {
		const code = getEventCode(e);
		if (!props.multiple) return;
		if (code === EVENT_CODE.delete) return;
		if (e.target.value.length <= 0) {
			const value = castArray$1(props.modelValue).slice();
			const lastNotDisabledIndex = getLastNotDisabledIndex(value);
			if (lastNotDisabledIndex < 0) return;
			const removeTagValue = value[lastNotDisabledIndex];
			value.splice(lastNotDisabledIndex, 1);
			emit(UPDATE_MODEL_EVENT, value);
			emitChange(value);
			emit("remove-tag", removeTagValue);
		}
	};
	const deleteTag = (event, tag) => {
		const index = states.selected.indexOf(tag);
		if (index > -1 && !selectDisabled.value) {
			const value = castArray$1(props.modelValue).slice();
			value.splice(index, 1);
			emit(UPDATE_MODEL_EVENT, value);
			emitChange(value);
			emit("remove-tag", tag.value);
		}
		event.stopPropagation();
		focus();
	};
	const deleteSelected = (event) => {
		event.stopPropagation();
		const value = props.multiple ? [] : valueOnClear.value;
		if (props.multiple) {
			for (const item of states.selected) if (item.isDisabled) value.push(item.value);
		}
		emit(UPDATE_MODEL_EVENT, value);
		emitChange(value);
		states.hoveringIndex = -1;
		expanded.value = false;
		emit("clear");
		focus();
	};
	const handleOptionSelect = (option) => {
		if (props.multiple) {
			const value = castArray$1(props.modelValue ?? []).slice();
			const optionIndex = getValueIndex(value, option);
			if (optionIndex > -1) value.splice(optionIndex, 1);
			else if (props.multipleLimit <= 0 || value.length < props.multipleLimit) value.push(option.value);
			emit(UPDATE_MODEL_EVENT, value);
			emitChange(value);
			if (option.created) handleQueryChange("");
			if (props.filterable && (option.created || !props.reserveKeyword)) states.inputValue = "";
		} else {
			!isEqual(props.modelValue, option.value) && emit("update:modelValue", option.value);
			emitChange(option.value);
			expanded.value = false;
		}
		focus();
		if (expanded.value) return;
		nextTick(() => {
			scrollToOption(option);
		});
	};
	const getValueIndex = (arr, option) => {
		if (isUndefined(option)) return -1;
		if (!isObject$2(option.value)) return arr.indexOf(option.value);
		return arr.findIndex((item) => {
			return isEqual(get(item, props.valueKey), getValueKey(option));
		});
	};
	const scrollToOption = (option) => {
		const targetOption = isArray$1(option) ? option[option.length - 1] : option;
		let target = null;
		if (!isNil(targetOption?.value)) {
			const options = optionsArray.value.filter((item) => item.value === targetOption.value);
			if (options.length > 0) target = options[0].$el;
		}
		if (tooltipRef.value && target) {
			const menu = tooltipRef.value?.popperRef?.contentRef?.querySelector?.(`.${nsSelect.be("dropdown", "wrap")}`);
			if (menu) scrollIntoView(menu, target);
		}
		scrollbarRef.value?.handleScroll();
	};
	const onOptionCreate = (vm) => {
		states.options.set(vm.value, vm);
		states.cachedOptions.set(vm.value, vm);
	};
	const onOptionDestroy = (key, vm) => {
		if (states.options.get(key) === vm) states.options.delete(key);
	};
	const popperRef = computed(() => {
		return tooltipRef.value?.popperRef?.contentRef;
	});
	const handleMenuEnter = () => {
		states.isBeforeHide = false;
		nextTick(() => {
			scrollbarRef.value?.update();
			scrollToOption(states.selected);
		});
	};
	const focus = () => {
		inputRef.value?.focus();
	};
	const blur = () => {
		if (expanded.value) {
			expanded.value = false;
			nextTick(() => inputRef.value?.blur());
			return;
		}
		inputRef.value?.blur();
	};
	const handleClearClick = (event) => {
		deleteSelected(event);
	};
	const handleClickOutside = (event) => {
		expanded.value = false;
		if (isFocused.value) {
			const _event = new FocusEvent("blur", event);
			nextTick(() => handleBlur(_event));
		}
	};
	const handleEsc = () => {
		if (states.inputValue.length > 0) states.inputValue = "";
		else expanded.value = false;
	};
	const toggleMenu = (event) => {
		if (selectDisabled.value || props.filterable && expanded.value && event && !suffixRef.value?.contains(event.target)) return;
		if (isIOS) states.inputHovering = true;
		if (states.menuVisibleOnFocus) states.menuVisibleOnFocus = false;
		else expanded.value = !expanded.value;
	};
	const selectOption = () => {
		if (!expanded.value) toggleMenu();
		else {
			const option = optionsArray.value[states.hoveringIndex];
			if (option && !option.isDisabled) handleOptionSelect(option);
		}
	};
	const getValueKey = (item) => {
		return isObject$2(item.value) ? get(item.value, props.valueKey) : item.value;
	};
	const optionsAllDisabled = computed(() => optionsArray.value.filter((option) => option.visible).every((option) => option.isDisabled));
	const showTagList = computed(() => {
		if (!props.multiple) return [];
		return props.collapseTags ? states.selected.slice(0, props.maxCollapseTags) : states.selected;
	});
	const collapseTagList = computed(() => {
		if (!props.multiple) return [];
		return props.collapseTags ? states.selected.slice(props.maxCollapseTags) : [];
	});
	const navigateOptions = (direction) => {
		if (!expanded.value) {
			expanded.value = true;
			return;
		}
		if (states.options.size === 0 || filteredOptionsCount.value === 0 || isComposing.value) return;
		if (!optionsAllDisabled.value) {
			if (direction === "next") {
				states.hoveringIndex++;
				if (states.hoveringIndex === states.options.size) states.hoveringIndex = 0;
			} else if (direction === "prev") {
				states.hoveringIndex--;
				if (states.hoveringIndex < 0) states.hoveringIndex = states.options.size - 1;
			}
			const option = optionsArray.value[states.hoveringIndex];
			if (option.isDisabled || !option.visible) navigateOptions(direction);
			nextTick(() => scrollToOption(hoverOption.value));
		}
	};
	const findFocusableIndex = (arr, start, step, len) => {
		for (let i = start; i >= 0 && i < len; i += step) {
			const obj = arr[i];
			if (!obj?.isDisabled && obj?.visible) return i;
		}
		return null;
	};
	const focusOption = (targetIndex, mode) => {
		const len = states.options.size;
		if (len === 0) return;
		const start = clamp$1(targetIndex, 0, len - 1);
		const options = optionsArray.value;
		const direction = mode === "up" ? -1 : 1;
		const newIndex = findFocusableIndex(options, start, direction, len) ?? findFocusableIndex(options, start - direction, -direction, len);
		if (newIndex != null) {
			states.hoveringIndex = newIndex;
			nextTick(() => scrollToOption(hoverOption.value));
		}
	};
	const handleKeydown = (e) => {
		const code = getEventCode(e);
		let isPreventDefault = true;
		switch (code) {
			case EVENT_CODE.up:
				navigateOptions("prev");
				break;
			case EVENT_CODE.down:
				navigateOptions("next");
				break;
			case EVENT_CODE.enter:
			case EVENT_CODE.numpadEnter:
				if (!isComposing.value) selectOption();
				break;
			case EVENT_CODE.esc:
				handleEsc();
				break;
			case EVENT_CODE.backspace:
				isPreventDefault = false;
				deletePrevTag(e);
				return;
			case EVENT_CODE.home:
				if (!expanded.value) return;
				focusOption(0, "down");
				break;
			case EVENT_CODE.end:
				if (!expanded.value) return;
				focusOption(states.options.size - 1, "up");
				break;
			case EVENT_CODE.pageUp:
				if (!expanded.value) return;
				focusOption(states.hoveringIndex - 10, "up");
				break;
			case EVENT_CODE.pageDown:
				if (!expanded.value) return;
				focusOption(states.hoveringIndex + 10, "down");
				break;
			default:
				isPreventDefault = false;
				break;
		}
		if (isPreventDefault) {
			e.preventDefault();
			e.stopPropagation();
		}
	};
	const getGapWidth = () => {
		if (!selectionRef.value) return 0;
		const style = window.getComputedStyle(selectionRef.value);
		return Number.parseFloat(style.gap || "6px");
	};
	const tagStyle = computed(() => {
		const gapWidth = getGapWidth();
		const inputSlotWidth = props.filterable ? gapWidth + 11 : 0;
		return { maxWidth: `${collapseItemRef.value && props.maxCollapseTags === 1 ? states.selectionWidth - states.collapseItemWidth - gapWidth - inputSlotWidth : states.selectionWidth - inputSlotWidth}px` };
	});
	const collapseTagStyle = computed(() => {
		return { maxWidth: `${states.selectionWidth}px` };
	});
	const popupScroll = (data) => {
		emit("popup-scroll", data);
	};
	const endReached = (direction) => {
		emit("end-reached", direction);
	};
	useResizeObserver(selectionRef, resetSelectionWidth);
	useResizeObserver(wrapperRef, updateTooltip);
	useResizeObserver(tagMenuRef, updateTagTooltip);
	useResizeObserver(collapseItemRef, resetCollapseItemWidth);
	let stop;
	watch(() => dropdownMenuVisible.value, (newVal) => {
		if (newVal) stop = useResizeObserver(menuRef, updateTooltip).stop;
		else {
			stop?.();
			stop = void 0;
		}
		emit("visible-change", newVal);
	});
	onMounted(() => {
		setSelected();
	});
	return {
		inputId,
		contentId,
		nsSelect,
		nsInput,
		states,
		isFocused,
		expanded,
		optionsArray,
		hoverOption,
		selectSize,
		filteredOptionsCount,
		updateTooltip,
		updateTagTooltip,
		debouncedOnInputChange,
		onInput,
		deletePrevTag,
		deleteTag,
		deleteSelected,
		handleOptionSelect,
		scrollToOption,
		hasModelValue,
		shouldShowPlaceholder,
		currentPlaceholder,
		mouseEnterEventName,
		needStatusIcon,
		showClearBtn,
		iconComponent,
		iconReverse,
		validateState,
		validateIcon,
		showNewOption,
		updateOptions,
		collapseTagSize,
		setSelected,
		selectDisabled,
		emptyText,
		handleCompositionStart,
		handleCompositionUpdate,
		handleCompositionEnd,
		handleKeydown,
		onOptionCreate,
		onOptionDestroy,
		handleMenuEnter,
		focus,
		blur,
		handleClearClick,
		handleClickOutside,
		handleEsc,
		toggleMenu,
		selectOption,
		getValueKey,
		navigateOptions,
		dropdownMenuVisible,
		showTagList,
		collapseTagList,
		popupScroll,
		getOption,
		endReached,
		tagStyle,
		collapseTagStyle,
		popperRef,
		inputRef,
		tooltipRef,
		tagTooltipRef,
		prefixRef,
		suffixRef,
		selectRef,
		wrapperRef,
		selectionRef,
		scrollbarRef,
		menuRef,
		tagMenuRef,
		collapseItemRef
	};
};
//#endregion
//#region node_modules/element-plus/es/components/select/src/options.mjs
var options_default = /* @__PURE__ */ defineComponent({
	name: "ElOptions",
	setup(_, { slots }) {
		const select = inject(selectKey);
		let cachedValueList = [];
		return () => {
			const children = slots.default?.();
			const valueList = [];
			function filterOptions(children) {
				if (!isArray$1(children)) return;
				children.forEach((item) => {
					const name = (item?.type || {})?.name;
					if (name === "ElOptionGroup") filterOptions(!isString(item.children) && !isArray$1(item.children) && isFunction$1(item.children?.default) ? item.children?.default() : item.children);
					else if (name === "ElOption") valueList.push(item.props?.value);
					else if (isArray$1(item.children)) filterOptions(item.children);
				});
			}
			if (children.length) filterOptions(children[0]?.children);
			if (!isEqual(valueList, cachedValueList)) {
				cachedValueList = valueList;
				if (select) select.states.optionValues = valueList;
			}
			return children;
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/select/src/select.vue_vue_type_script_lang.mjs
var COMPONENT_NAME$2 = "ElSelect";
var warnHandlerMap = /* @__PURE__ */ new WeakMap();
var createSelectWarnHandler = (appContext) => {
	return (...args) => {
		const message = args[0];
		if (!message || message.includes("Slot \"default\" invoked outside of the render function") && args[2]?.includes("ElTreeSelect")) return;
		const original = warnHandlerMap.get(appContext)?.originalWarnHandler;
		if (original) {
			original(...args);
			return;
		}
		console.warn(...args);
	};
};
var getWarnHandlerRecord = (appContext) => {
	let record = warnHandlerMap.get(appContext);
	if (!record) {
		record = {
			originalWarnHandler: appContext.config.warnHandler,
			handler: createSelectWarnHandler(appContext),
			count: 0
		};
		warnHandlerMap.set(appContext, record);
	}
	return record;
};
var select_vue_vue_type_script_lang_default = /* @__PURE__ */ defineComponent({
	name: COMPONENT_NAME$2,
	componentName: COMPONENT_NAME$2,
	components: {
		ElSelectMenu: select_dropdown_default,
		ElOption: option_default,
		ElOptions: options_default,
		ElOptionGroup: option_group_default,
		ElTag,
		ElScrollbar,
		ElTooltip,
		ElIcon
	},
	directives: { ClickOutside },
	props: selectProps,
	emits: selectEmits,
	setup(props, { emit, slots }) {
		const instance = getCurrentInstance();
		const warnRecord = getWarnHandlerRecord(instance.appContext);
		warnRecord.count += 1;
		instance.appContext.config.warnHandler = warnRecord.handler;
		const modelValue = computed(() => {
			const { modelValue: rawModelValue, multiple } = props;
			const fallback = multiple ? [] : void 0;
			if (isArray$1(rawModelValue)) return multiple ? rawModelValue : fallback;
			return multiple ? fallback : rawModelValue;
		});
		const _props = /* @__PURE__ */ reactive({
			.../* @__PURE__ */ toRefs(props),
			modelValue
		});
		const API = useSelect(_props, emit);
		const { calculatorRef, inputStyle } = useCalcInputWidth();
		const { getLabel, getValue, getOptions, getDisabled } = useProps(props);
		const getOptionProps = (option) => ({
			label: getLabel(option),
			value: getValue(option),
			disabled: getDisabled(option)
		});
		const flatTreeSelectData = (data) => {
			return data.reduce((acc, item) => {
				acc.push(item);
				if (item.children && item.children.length > 0) acc.push(...flatTreeSelectData(item.children));
				return acc;
			}, []);
		};
		const manuallyRenderSlots = (vnodes) => {
			flattedChildren(vnodes || []).forEach((item) => {
				if (isObject$2(item) && (item.type.name === "ElOption" || item.type.name === "ElTree")) {
					const _name = item.type.name;
					if (_name === "ElTree") flatTreeSelectData(item.props?.data || []).forEach((treeItem) => {
						treeItem.currentLabel = treeItem.label ?? (isObject$2(treeItem.value) ? "" : treeItem.value);
						API.onOptionCreate(treeItem);
					});
					else if (_name === "ElOption") {
						const obj = { ...item.props };
						obj.currentLabel = obj.label ?? (isObject$2(obj.value) ? "" : obj.value);
						API.onOptionCreate(obj);
					}
				}
			});
		};
		watch(() => [props.persistent || API.expanded.value || !slots.default ? void 0 : slots.default?.(), modelValue.value], () => {
			if (props.persistent || API.expanded.value) return;
			if (!slots.default) return;
			API.states.options.clear();
			manuallyRenderSlots(slots.default?.());
		}, { immediate: true });
		provide(selectKey, /* @__PURE__ */ reactive({
			props: _props,
			states: API.states,
			selectRef: API.selectRef,
			optionsArray: API.optionsArray,
			setSelected: API.setSelected,
			handleOptionSelect: API.handleOptionSelect,
			onOptionCreate: API.onOptionCreate,
			onOptionDestroy: API.onOptionDestroy
		}));
		const selectedLabel = computed(() => {
			if (!props.multiple) return API.states.selectedLabel;
			return API.states.selected.map((i) => i.currentLabel);
		});
		onBeforeUnmount(() => {
			const record = warnHandlerMap.get(instance.appContext);
			if (!record) return;
			record.count -= 1;
			if (record.count <= 0) {
				instance.appContext.config.warnHandler = record.originalWarnHandler;
				warnHandlerMap.delete(instance.appContext);
			}
		});
		return {
			...API,
			modelValue,
			selectedLabel,
			calculatorRef,
			inputStyle,
			getLabel,
			getValue,
			getOptions,
			getDisabled,
			getOptionProps
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/select/src/select2.mjs
var _hoisted_1$15 = [
	"id",
	"value",
	"name",
	"disabled",
	"autocomplete",
	"tabindex",
	"readonly",
	"aria-activedescendant",
	"aria-controls",
	"aria-expanded",
	"aria-label"
];
var _hoisted_2$8 = ["textContent"];
var _hoisted_3$4 = { key: 1 };
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
	const _component_el_tag = resolveComponent("el-tag");
	const _component_el_tooltip = resolveComponent("el-tooltip");
	const _component_el_icon = resolveComponent("el-icon");
	const _component_el_option = resolveComponent("el-option");
	const _component_el_option_group = resolveComponent("el-option-group");
	const _component_el_options = resolveComponent("el-options");
	const _component_el_scrollbar = resolveComponent("el-scrollbar");
	const _component_el_select_menu = resolveComponent("el-select-menu");
	const _directive_click_outside = resolveDirective("click-outside");
	return withDirectives((openBlock(), createElementBlock("div", mergeProps({
		ref: "selectRef",
		class: [_ctx.nsSelect.b(), _ctx.nsSelect.m(_ctx.selectSize)]
	}, { [toHandlerKey(_ctx.mouseEnterEventName)]: _cache[11] || (_cache[11] = ($event) => _ctx.states.inputHovering = true) }, { onMouseleave: _cache[12] || (_cache[12] = ($event) => _ctx.states.inputHovering = false) }), [createVNode(_component_el_tooltip, {
		ref: "tooltipRef",
		visible: _ctx.dropdownMenuVisible,
		placement: _ctx.placement,
		teleported: _ctx.teleported,
		"popper-class": [_ctx.nsSelect.e("popper"), _ctx.popperClass],
		"popper-style": _ctx.popperStyle,
		"popper-options": _ctx.popperOptions,
		"fallback-placements": _ctx.fallbackPlacements,
		effect: _ctx.effect,
		pure: "",
		trigger: "click",
		transition: `${_ctx.nsSelect.namespace.value}-zoom-in-top`,
		"stop-popper-mouse-event": false,
		"gpu-acceleration": false,
		persistent: _ctx.persistent,
		"append-to": _ctx.appendTo,
		"show-arrow": _ctx.showArrow,
		offset: _ctx.offset,
		onBeforeShow: _ctx.handleMenuEnter,
		onHide: _cache[10] || (_cache[10] = ($event) => _ctx.states.isBeforeHide = false)
	}, {
		default: withCtx(() => [createBaseVNode("div", {
			ref: "wrapperRef",
			class: normalizeClass([
				_ctx.nsSelect.e("wrapper"),
				_ctx.nsSelect.is("focused", _ctx.isFocused),
				_ctx.nsSelect.is("hovering", _ctx.states.inputHovering),
				_ctx.nsSelect.is("filterable", _ctx.filterable),
				_ctx.nsSelect.is("disabled", _ctx.selectDisabled)
			]),
			onClick: _cache[7] || (_cache[7] = withModifiers((...args) => _ctx.toggleMenu && _ctx.toggleMenu(...args), ["prevent"]))
		}, [
			_ctx.$slots.prefix ? (openBlock(), createElementBlock("div", {
				key: 0,
				ref: "prefixRef",
				class: normalizeClass(_ctx.nsSelect.e("prefix"))
			}, [renderSlot(_ctx.$slots, "prefix")], 2)) : createCommentVNode("v-if", true),
			createBaseVNode("div", {
				ref: "selectionRef",
				class: normalizeClass([_ctx.nsSelect.e("selection"), _ctx.nsSelect.is("near", _ctx.multiple && !_ctx.$slots.prefix && !!_ctx.states.selected.length)])
			}, [
				_ctx.multiple ? renderSlot(_ctx.$slots, "tag", {
					key: 0,
					data: _ctx.states.selected,
					deleteTag: _ctx.deleteTag,
					selectDisabled: _ctx.selectDisabled
				}, () => [(openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.showTagList, (item) => {
					return openBlock(), createElementBlock("div", {
						key: _ctx.getValueKey(item),
						class: normalizeClass(_ctx.nsSelect.e("selected-item"))
					}, [createVNode(_component_el_tag, {
						closable: !_ctx.selectDisabled && !item.isDisabled,
						size: _ctx.collapseTagSize,
						type: _ctx.tagType,
						effect: _ctx.tagEffect,
						"disable-transitions": "",
						style: normalizeStyle(_ctx.tagStyle),
						onClose: ($event) => _ctx.deleteTag($event, item)
					}, {
						default: withCtx(() => [createBaseVNode("span", { class: normalizeClass(_ctx.nsSelect.e("tags-text")) }, [renderSlot(_ctx.$slots, "label", {
							index: item.index,
							label: item.currentLabel,
							value: item.value
						}, () => [createTextVNode(toDisplayString(item.currentLabel), 1)])], 2)]),
						_: 2
					}, 1032, [
						"closable",
						"size",
						"type",
						"effect",
						"style",
						"onClose"
					])], 2);
				}), 128)), _ctx.collapseTags && _ctx.states.selected.length > _ctx.maxCollapseTags ? (openBlock(), createBlock(_component_el_tooltip, {
					key: 0,
					ref: "tagTooltipRef",
					disabled: _ctx.dropdownMenuVisible || !_ctx.collapseTagsTooltip,
					"fallback-placements": _ctx.tagTooltip?.fallbackPlacements ?? [
						"bottom",
						"top",
						"right",
						"left"
					],
					effect: _ctx.tagTooltip?.effect ?? _ctx.effect,
					placement: _ctx.tagTooltip?.placement ?? "bottom",
					"popper-class": _ctx.tagTooltip?.popperClass ?? _ctx.popperClass,
					"popper-style": _ctx.tagTooltip?.popperStyle ?? _ctx.popperStyle,
					teleported: _ctx.tagTooltip?.teleported ?? _ctx.teleported,
					"append-to": _ctx.tagTooltip?.appendTo ?? _ctx.appendTo,
					"popper-options": _ctx.tagTooltip?.popperOptions ?? _ctx.popperOptions,
					transition: _ctx.tagTooltip?.transition,
					"show-after": _ctx.tagTooltip?.showAfter,
					"hide-after": _ctx.tagTooltip?.hideAfter,
					"auto-close": _ctx.tagTooltip?.autoClose,
					offset: _ctx.tagTooltip?.offset
				}, {
					default: withCtx(() => [createBaseVNode("div", {
						ref: "collapseItemRef",
						class: normalizeClass(_ctx.nsSelect.e("selected-item"))
					}, [createVNode(_component_el_tag, {
						closable: false,
						size: _ctx.collapseTagSize,
						type: _ctx.tagType,
						effect: _ctx.tagEffect,
						"disable-transitions": "",
						style: normalizeStyle(_ctx.collapseTagStyle)
					}, {
						default: withCtx(() => [createBaseVNode("span", { class: normalizeClass(_ctx.nsSelect.e("tags-text")) }, " + " + toDisplayString(_ctx.states.selected.length - _ctx.maxCollapseTags), 3)]),
						_: 1
					}, 8, [
						"size",
						"type",
						"effect",
						"style"
					])], 2)]),
					content: withCtx(() => [createBaseVNode("div", {
						ref: "tagMenuRef",
						class: normalizeClass(_ctx.nsSelect.e("selection"))
					}, [(openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.collapseTagList, (item) => {
						return openBlock(), createElementBlock("div", {
							key: _ctx.getValueKey(item),
							class: normalizeClass(_ctx.nsSelect.e("selected-item"))
						}, [createVNode(_component_el_tag, {
							class: "in-tooltip",
							closable: !_ctx.selectDisabled && !item.isDisabled,
							size: _ctx.collapseTagSize,
							type: _ctx.tagType,
							effect: _ctx.tagEffect,
							"disable-transitions": "",
							onClose: ($event) => _ctx.deleteTag($event, item)
						}, {
							default: withCtx(() => [createBaseVNode("span", { class: normalizeClass(_ctx.nsSelect.e("tags-text")) }, [renderSlot(_ctx.$slots, "label", {
								index: item.index,
								label: item.currentLabel,
								value: item.value
							}, () => [createTextVNode(toDisplayString(item.currentLabel), 1)])], 2)]),
							_: 2
						}, 1032, [
							"closable",
							"size",
							"type",
							"effect",
							"onClose"
						])], 2);
					}), 128))], 2)]),
					_: 3
				}, 8, [
					"disabled",
					"fallback-placements",
					"effect",
					"placement",
					"popper-class",
					"popper-style",
					"teleported",
					"append-to",
					"popper-options",
					"transition",
					"show-after",
					"hide-after",
					"auto-close",
					"offset"
				])) : createCommentVNode("v-if", true)]) : createCommentVNode("v-if", true),
				createBaseVNode("div", { class: normalizeClass([
					_ctx.nsSelect.e("selected-item"),
					_ctx.nsSelect.e("input-wrapper"),
					_ctx.nsSelect.is("hidden", !_ctx.filterable || _ctx.selectDisabled || _ctx.multiple && !_ctx.states.inputValue && !_ctx.isFocused)
				]) }, [createBaseVNode("input", {
					id: _ctx.inputId,
					ref: "inputRef",
					value: _ctx.states.inputValue,
					type: "text",
					name: _ctx.name,
					class: normalizeClass([_ctx.nsSelect.e("input"), _ctx.nsSelect.is(_ctx.selectSize)]),
					disabled: _ctx.selectDisabled,
					autocomplete: _ctx.autocomplete,
					style: normalizeStyle(_ctx.inputStyle),
					tabindex: _ctx.tabindex,
					role: "combobox",
					readonly: !_ctx.filterable,
					spellcheck: "false",
					"aria-activedescendant": _ctx.hoverOption?.id || "",
					"aria-controls": _ctx.contentId,
					"aria-expanded": _ctx.dropdownMenuVisible,
					"aria-label": _ctx.ariaLabel,
					"aria-autocomplete": "none",
					"aria-haspopup": "listbox",
					onKeydown: _cache[0] || (_cache[0] = (...args) => _ctx.handleKeydown && _ctx.handleKeydown(...args)),
					onCompositionstart: _cache[1] || (_cache[1] = (...args) => _ctx.handleCompositionStart && _ctx.handleCompositionStart(...args)),
					onCompositionupdate: _cache[2] || (_cache[2] = (...args) => _ctx.handleCompositionUpdate && _ctx.handleCompositionUpdate(...args)),
					onCompositionend: _cache[3] || (_cache[3] = (...args) => _ctx.handleCompositionEnd && _ctx.handleCompositionEnd(...args)),
					onInput: _cache[4] || (_cache[4] = (...args) => _ctx.onInput && _ctx.onInput(...args)),
					onChange: _cache[5] || (_cache[5] = withModifiers(() => {}, ["stop"])),
					onClick: _cache[6] || (_cache[6] = withModifiers((...args) => _ctx.toggleMenu && _ctx.toggleMenu(...args), ["stop"]))
				}, null, 46, _hoisted_1$15), _ctx.filterable ? (openBlock(), createElementBlock("span", {
					key: 0,
					ref: "calculatorRef",
					"aria-hidden": "true",
					class: normalizeClass(_ctx.nsSelect.e("input-calculator")),
					textContent: toDisplayString(_ctx.states.inputValue)
				}, null, 10, _hoisted_2$8)) : createCommentVNode("v-if", true)], 2),
				_ctx.shouldShowPlaceholder ? (openBlock(), createElementBlock("div", {
					key: 1,
					class: normalizeClass([
						_ctx.nsSelect.e("selected-item"),
						_ctx.nsSelect.e("placeholder"),
						_ctx.nsSelect.is("transparent", !_ctx.hasModelValue || _ctx.expanded && !_ctx.states.inputValue)
					])
				}, [_ctx.hasModelValue ? renderSlot(_ctx.$slots, "label", {
					key: 0,
					index: _ctx.getOption(_ctx.modelValue).index,
					label: _ctx.currentPlaceholder,
					value: _ctx.modelValue
				}, () => [createBaseVNode("span", null, toDisplayString(_ctx.currentPlaceholder), 1)]) : (openBlock(), createElementBlock("span", _hoisted_3$4, toDisplayString(_ctx.currentPlaceholder), 1))], 2)) : createCommentVNode("v-if", true)
			], 2),
			createBaseVNode("div", {
				ref: "suffixRef",
				class: normalizeClass(_ctx.nsSelect.e("suffix"))
			}, [
				_ctx.iconComponent && !_ctx.showClearBtn ? (openBlock(), createBlock(_component_el_icon, {
					key: 0,
					class: normalizeClass([
						_ctx.nsSelect.e("caret"),
						_ctx.nsSelect.e("icon"),
						_ctx.iconReverse
					])
				}, {
					default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(_ctx.iconComponent)))]),
					_: 1
				}, 8, ["class"])) : createCommentVNode("v-if", true),
				_ctx.showClearBtn && _ctx.clearIcon ? (openBlock(), createBlock(_component_el_icon, {
					key: 1,
					class: normalizeClass([
						_ctx.nsSelect.e("caret"),
						_ctx.nsSelect.e("icon"),
						_ctx.nsSelect.e("clear")
					]),
					onClick: _ctx.handleClearClick
				}, {
					default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(_ctx.clearIcon)))]),
					_: 1
				}, 8, ["class", "onClick"])) : createCommentVNode("v-if", true),
				_ctx.validateState && _ctx.validateIcon && _ctx.needStatusIcon ? (openBlock(), createBlock(_component_el_icon, {
					key: 2,
					class: normalizeClass([
						_ctx.nsInput.e("icon"),
						_ctx.nsInput.e("validateIcon"),
						_ctx.nsInput.is("loading", _ctx.validateState === "validating")
					])
				}, {
					default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(_ctx.validateIcon)))]),
					_: 1
				}, 8, ["class"])) : createCommentVNode("v-if", true)
			], 2)
		], 2)]),
		content: withCtx(() => [createVNode(_component_el_select_menu, { ref: "menuRef" }, {
			default: withCtx(() => [
				_ctx.$slots.header ? (openBlock(), createElementBlock("div", {
					key: 0,
					class: normalizeClass(_ctx.nsSelect.be("dropdown", "header")),
					onClick: _cache[8] || (_cache[8] = withModifiers(() => {}, ["stop"]))
				}, [renderSlot(_ctx.$slots, "header")], 2)) : createCommentVNode("v-if", true),
				withDirectives(createVNode(_component_el_scrollbar, {
					id: _ctx.contentId,
					ref: "scrollbarRef",
					tag: "ul",
					"wrap-class": _ctx.nsSelect.be("dropdown", "wrap"),
					"view-class": _ctx.nsSelect.be("dropdown", "list"),
					class: normalizeClass([_ctx.nsSelect.is("empty", _ctx.filteredOptionsCount === 0)]),
					role: "listbox",
					"aria-label": _ctx.ariaLabel,
					"aria-orientation": "vertical",
					onScroll: _ctx.popupScroll,
					onEndReached: _ctx.endReached
				}, {
					default: withCtx(() => [_ctx.showNewOption ? (openBlock(), createBlock(_component_el_option, {
						key: 0,
						value: _ctx.states.inputValue,
						created: true
					}, null, 8, ["value"])) : createCommentVNode("v-if", true), createVNode(_component_el_options, null, {
						default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [(openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.options, (option, index) => {
							return openBlock(), createElementBlock(Fragment, { key: index }, [_ctx.getOptions(option)?.length ? (openBlock(), createBlock(_component_el_option_group, {
								key: 0,
								label: _ctx.getLabel(option),
								disabled: _ctx.getDisabled(option)
							}, {
								default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.getOptions(option), (item) => {
									return openBlock(), createBlock(_component_el_option, mergeProps({ key: _ctx.getValue(item) }, { ref_for: true }, _ctx.getOptionProps(item)), null, 16);
								}), 128))]),
								_: 2
							}, 1032, ["label", "disabled"])) : (openBlock(), createBlock(_component_el_option, mergeProps({
								key: 1,
								ref_for: true
							}, _ctx.getOptionProps(option)), null, 16))], 64);
						}), 128))])]),
						_: 3
					})]),
					_: 3
				}, 8, [
					"id",
					"wrap-class",
					"view-class",
					"class",
					"aria-label",
					"onScroll",
					"onEndReached"
				]), [[vShow, _ctx.states.options.size > 0 && !_ctx.loading]]),
				_ctx.$slots.loading && _ctx.loading ? (openBlock(), createElementBlock("div", {
					key: 1,
					class: normalizeClass(_ctx.nsSelect.be("dropdown", "loading"))
				}, [renderSlot(_ctx.$slots, "loading")], 2)) : _ctx.loading || _ctx.filteredOptionsCount === 0 ? (openBlock(), createElementBlock("div", {
					key: 2,
					class: normalizeClass(_ctx.nsSelect.be("dropdown", "empty"))
				}, [renderSlot(_ctx.$slots, "empty", {}, () => [createBaseVNode("span", null, toDisplayString(_ctx.emptyText), 1)])], 2)) : createCommentVNode("v-if", true),
				_ctx.$slots.footer ? (openBlock(), createElementBlock("div", {
					key: 3,
					class: normalizeClass(_ctx.nsSelect.be("dropdown", "footer")),
					onClick: _cache[9] || (_cache[9] = withModifiers(() => {}, ["stop"]))
				}, [renderSlot(_ctx.$slots, "footer")], 2)) : createCommentVNode("v-if", true)
			]),
			_: 3
		}, 512)]),
		_: 3
	}, 8, [
		"visible",
		"placement",
		"teleported",
		"popper-class",
		"popper-style",
		"popper-options",
		"fallback-placements",
		"effect",
		"transition",
		"persistent",
		"append-to",
		"show-arrow",
		"offset",
		"onBeforeShow"
	])], 16)), [[
		_directive_click_outside,
		_ctx.handleClickOutside,
		_ctx.popperRef
	]]);
}
//#endregion
//#region node_modules/element-plus/es/components/select/index.mjs
var ElSelect = withInstall(/* @__PURE__ */ _plugin_vue_export_helper_default$1(select_vue_vue_type_script_lang_default, [["render", _sfc_render$2]]), {
	Option: option_default,
	OptionGroup: option_group_default
});
var ElOption = withNoopInstall(option_default);
var ElOptionGroup = withNoopInstall(option_group_default);
//#endregion
//#region node_modules/element-plus/es/components/checkbox/src/checkbox.mjs
/**
* @deprecated Removed after 3.0.0, Use `CheckboxProps` instead.
*/
var checkboxProps = {
	/**
	* @description binding value
	*/
	modelValue: {
		type: [
			Number,
			String,
			Boolean
		],
		default: void 0
	},
	/**
	* @description label of the Checkbox when used inside a `checkbox-group`
	*/
	label: {
		type: [
			String,
			Boolean,
			Number,
			Object
		],
		default: void 0
	},
	/**
	* @description value of the Checkbox when used inside a `checkbox-group`
	*/
	value: {
		type: [
			String,
			Boolean,
			Number,
			Object
		],
		default: void 0
	},
	/**
	* @description Set indeterminate state, only responsible for style control
	*/
	indeterminate: Boolean,
	/**
	* @description whether the Checkbox is disabled
	*/
	disabled: {
		type: Boolean,
		default: void 0
	},
	/**
	* @description if the Checkbox is checked
	*/
	checked: Boolean,
	/**
	* @description native 'name' attribute
	*/
	name: {
		type: String,
		default: void 0
	},
	/**
	* @description value of the Checkbox if it's checked
	*/
	trueValue: {
		type: [String, Number],
		default: void 0
	},
	/**
	* @description value of the Checkbox if it's not checked
	*/
	falseValue: {
		type: [String, Number],
		default: void 0
	},
	/**
	* @deprecated use `trueValue` instead
	* @description value of the Checkbox if it's checked
	*/
	trueLabel: {
		type: [String, Number],
		default: void 0
	},
	/**
	* @deprecated use `falseValue` instead
	* @description value of the Checkbox if it's not checked
	*/
	falseLabel: {
		type: [String, Number],
		default: void 0
	},
	/**
	* @description input id
	*/
	id: {
		type: String,
		default: void 0
	},
	/**
	* @description whether to add a border around Checkbox
	*/
	border: Boolean,
	/**
	* @description size of the Checkbox
	*/
	size: useSizeProp,
	/**
	* @description input tabindex
	*/
	tabindex: [String, Number],
	/**
	* @description whether to trigger form validation
	*/
	validateEvent: {
		type: Boolean,
		default: true
	},
	ariaLabel: String,
	...useAriaProps(["ariaControls"])
};
var checkboxEmits = {
	[UPDATE_MODEL_EVENT]: (val) => isString(val) || isNumber(val) || isBoolean(val),
	change: (val) => isString(val) || isNumber(val) || isBoolean(val)
};
//#endregion
//#region node_modules/element-plus/es/components/checkbox/src/constants.mjs
var checkboxGroupContextKey = Symbol("checkboxGroupContextKey");
//#endregion
//#region node_modules/element-plus/es/components/checkbox/src/checkbox-group.mjs
/**
* @deprecated Removed after 3.0.0, Use `CheckboxGroupProps` instead.
*/
var checkboxGroupProps = buildProps({
	/**
	* @description binding value
	*/
	modelValue: {
		type: definePropType(Array),
		default: () => []
	},
	/**
	* @description whether the nesting checkboxes are disabled
	*/
	disabled: {
		type: Boolean,
		default: void 0
	},
	/**
	* @description minimum number of checkbox checked
	*/
	min: Number,
	/**
	* @description maximum number of checkbox checked
	*/
	max: Number,
	/**
	* @description size of checkbox
	*/
	size: useSizeProp,
	/**
	* @description border and background color when button is active
	*/
	fill: String,
	/**
	* @description font color when button is active
	*/
	textColor: String,
	/**
	* @description element tag of the checkbox group
	*/
	tag: {
		type: String,
		default: "div"
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
		default: () => checkboxDefaultProps
	},
	type: {
		type: String,
		values: ["checkbox", "button"],
		default: "checkbox"
	},
	...useAriaProps(["ariaLabel"])
});
var checkboxGroupEmits = {
	[UPDATE_MODEL_EVENT]: (val) => isArray$1(val),
	change: (val) => isArray$1(val)
};
var checkboxDefaultProps = {
	label: "label",
	value: "value",
	disabled: "disabled"
};
//#endregion
//#region node_modules/element-plus/es/components/checkbox/src/composables/use-checkbox-disabled.mjs
var useCheckboxDisabled = ({ model, isChecked }) => {
	const checkboxGroup = inject(checkboxGroupContextKey, void 0);
	const formContext = inject(formContextKey, void 0);
	const isLimitDisabled = computed(() => {
		const max = checkboxGroup?.max?.value;
		const min = checkboxGroup?.min?.value;
		return !isUndefined(max) && model.value.length >= max && !isChecked.value || !isUndefined(min) && model.value.length <= min && isChecked.value;
	});
	return {
		isDisabled: useFormDisabled(computed(() => {
			if (checkboxGroup === void 0) return formContext?.disabled ?? isLimitDisabled.value;
			else return checkboxGroup.disabled?.value || isLimitDisabled.value;
		})),
		isLimitDisabled
	};
};
//#endregion
//#region node_modules/element-plus/es/components/checkbox/src/composables/use-checkbox-event.mjs
var useCheckboxEvent = (props, { model, isLimitExceeded, hasOwnLabel, isDisabled, isLabeledByFormItem }) => {
	const checkboxGroup = inject(checkboxGroupContextKey, void 0);
	const { formItem } = useFormItem();
	const { emit } = getCurrentInstance();
	function getLabeledValue(value) {
		return [
			true,
			props.trueValue,
			props.trueLabel
		].includes(value) ? props.trueValue ?? props.trueLabel ?? true : props.falseValue ?? props.falseLabel ?? false;
	}
	function emitChangeEvent(checked, e) {
		emit(CHANGE_EVENT, getLabeledValue(checked), e);
	}
	function handleChange(e) {
		if (isLimitExceeded.value) return;
		const target = e.target;
		emit(CHANGE_EVENT, getLabeledValue(target.checked), e);
	}
	async function onClickRoot(e) {
		if (isLimitExceeded.value) return;
		if (!hasOwnLabel.value && !isDisabled.value && isLabeledByFormItem.value) {
			if (!e.composedPath().some((item) => item.tagName === "LABEL")) {
				model.value = getLabeledValue([
					false,
					props.falseValue,
					props.falseLabel
				].includes(model.value));
				await nextTick();
				emitChangeEvent(model.value, e);
			}
		}
	}
	const validateEvent = computed(() => checkboxGroup?.validateEvent || props.validateEvent);
	watch(() => props.modelValue, () => {
		if (validateEvent.value) formItem?.validate("change").catch(NOOP);
	});
	return {
		handleChange,
		onClickRoot
	};
};
//#endregion
//#region node_modules/element-plus/es/components/checkbox/src/composables/use-checkbox-model.mjs
var useCheckboxModel = (props) => {
	const selfModel = /* @__PURE__ */ ref(false);
	const { emit, vnode } = getCurrentInstance();
	const checkboxGroup = inject(checkboxGroupContextKey, void 0);
	const isGroup = computed(() => isUndefined(checkboxGroup) === false);
	const isLimitExceeded = /* @__PURE__ */ ref(false);
	const isControlled = computed(() => {
		const rawProps = vnode.props ?? {};
		return "modelValue" in rawProps || "model-value" in rawProps;
	});
	const model = computed({
		get() {
			return isGroup.value ? checkboxGroup?.modelValue?.value : !isControlled.value ? selfModel.value : props.modelValue;
		},
		set(val) {
			if (isGroup.value && isArray$1(val)) {
				isLimitExceeded.value = checkboxGroup?.max?.value !== void 0 && val.length > checkboxGroup?.max.value && val.length > model.value.length;
				isLimitExceeded.value === false && checkboxGroup?.changeEvent?.(val);
			} else {
				emit(UPDATE_MODEL_EVENT, val);
				selfModel.value = val;
			}
		}
	});
	return {
		model,
		isGroup,
		isLimitExceeded
	};
};
//#endregion
//#region node_modules/element-plus/es/components/checkbox/src/composables/use-checkbox-status.mjs
var useCheckboxStatus = (props, slots, { model }) => {
	const checkboxGroup = inject(checkboxGroupContextKey, void 0);
	const isFocused = /* @__PURE__ */ ref(false);
	const actualValue = computed(() => {
		if (!isPropAbsent(props.value)) return props.value;
		return props.label;
	});
	const isChecked = computed(() => {
		const value = model.value;
		if (isBoolean(value)) return value;
		else if (isArray$1(value)) if (isObject$2(actualValue.value)) return value.map(toRaw).some((o) => isEqual(o, actualValue.value));
		else return value.map(toRaw).includes(actualValue.value);
		else if (value !== null && value !== void 0) return value === props.trueValue || value === props.trueLabel;
		else return !!value;
	});
	return {
		checkboxButtonSize: useFormSize(computed(() => checkboxGroup?.size?.value), { prop: true }),
		isChecked,
		isFocused,
		checkboxSize: useFormSize(computed(() => checkboxGroup?.size?.value)),
		hasOwnLabel: computed(() => {
			return !!slots.default || !isPropAbsent(actualValue.value);
		}),
		actualValue
	};
};
//#endregion
//#region node_modules/element-plus/es/components/checkbox/src/composables/use-checkbox.mjs
var useCheckbox = (props, slots) => {
	const { formItem: elFormItem } = useFormItem();
	const { model, isGroup, isLimitExceeded } = useCheckboxModel(props);
	const { isFocused, isChecked, checkboxButtonSize, checkboxSize, hasOwnLabel, actualValue } = useCheckboxStatus(props, slots, { model });
	const { isDisabled } = useCheckboxDisabled({
		model,
		isChecked
	});
	const { inputId, isLabeledByFormItem } = useFormItemInputId(props, {
		formItemContext: elFormItem,
		disableIdGeneration: hasOwnLabel,
		disableIdManagement: isGroup
	});
	const { handleChange, onClickRoot } = useCheckboxEvent(props, {
		model,
		isLimitExceeded,
		hasOwnLabel,
		isDisabled,
		isLabeledByFormItem
	});
	const setStoreValue = () => {
		function addToStore() {
			if (isArray$1(model.value) && !model.value.includes(actualValue.value)) model.value.push(actualValue.value);
			else model.value = props.trueValue ?? props.trueLabel ?? true;
		}
		props.checked && addToStore();
	};
	setStoreValue();
	useDeprecated({
		from: "label act as value",
		replacement: "value",
		version: "3.0.0",
		scope: "el-checkbox",
		ref: "https://element-plus.org/en-US/component/checkbox.html"
	}, computed(() => isGroup.value && isPropAbsent(props.value)));
	useDeprecated({
		from: "true-label",
		replacement: "true-value",
		version: "3.0.0",
		scope: "el-checkbox",
		ref: "https://element-plus.org/en-US/component/checkbox.html"
	}, computed(() => !!props.trueLabel));
	useDeprecated({
		from: "false-label",
		replacement: "false-value",
		version: "3.0.0",
		scope: "el-checkbox",
		ref: "https://element-plus.org/en-US/component/checkbox.html"
	}, computed(() => !!props.falseLabel));
	return {
		inputId,
		isLabeledByFormItem,
		isChecked,
		isDisabled,
		isFocused,
		checkboxButtonSize,
		checkboxSize,
		hasOwnLabel,
		model,
		actualValue,
		handleChange,
		onClickRoot
	};
};
//#endregion
//#region node_modules/element-plus/es/components/checkbox/src/checkbox.vue_vue_type_script_setup_true_lang.mjs
var _hoisted_1$14 = [
	"id",
	"indeterminate",
	"name",
	"tabindex",
	"disabled"
];
//#endregion
//#region node_modules/element-plus/es/components/checkbox/src/checkbox2.mjs
var checkbox_default = /* @__PURE__ */ defineComponent({
	name: "ElCheckbox",
	__name: "checkbox",
	props: checkboxProps,
	emits: checkboxEmits,
	setup(__props) {
		const props = __props;
		const { inputId, isLabeledByFormItem, isChecked, isDisabled, isFocused, checkboxSize, hasOwnLabel, model, actualValue, handleChange, onClickRoot } = useCheckbox(props, useSlots());
		const inputBindings = computed(() => {
			if (props.trueValue || props.falseValue || props.trueLabel || props.falseLabel) return {
				"true-value": props.trueValue ?? props.trueLabel ?? true,
				"false-value": props.falseValue ?? props.falseLabel ?? false
			};
			return { value: actualValue.value };
		});
		const ns = useNamespace("checkbox");
		const compKls = computed(() => {
			return [
				ns.b(),
				ns.m(checkboxSize.value),
				ns.is("disabled", isDisabled.value),
				ns.is("bordered", props.border),
				ns.is("checked", isChecked.value)
			];
		});
		const spanKls = computed(() => {
			return [
				ns.e("input"),
				ns.is("disabled", isDisabled.value),
				ns.is("checked", isChecked.value),
				ns.is("indeterminate", props.indeterminate),
				ns.is("focus", isFocused.value)
			];
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(!unref(hasOwnLabel) && unref(isLabeledByFormItem) ? "span" : "label"), {
				for: !unref(hasOwnLabel) && unref(isLabeledByFormItem) ? null : unref(inputId),
				class: normalizeClass(compKls.value),
				"aria-controls": __props.indeterminate ? __props.ariaControls : null,
				"aria-checked": __props.indeterminate ? "mixed" : void 0,
				"aria-label": __props.ariaLabel,
				onClick: unref(onClickRoot)
			}, {
				default: withCtx(() => [createBaseVNode("span", { class: normalizeClass(spanKls.value) }, [withDirectives(createBaseVNode("input", mergeProps({
					id: unref(inputId),
					"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => /* @__PURE__ */ isRef(model) ? model.value = $event : null),
					class: unref(ns).e("original"),
					type: "checkbox",
					indeterminate: __props.indeterminate,
					name: __props.name,
					tabindex: __props.tabindex,
					disabled: unref(isDisabled)
				}, inputBindings.value, {
					onChange: _cache[1] || (_cache[1] = (...args) => unref(handleChange) && unref(handleChange)(...args)),
					onFocus: _cache[2] || (_cache[2] = ($event) => isFocused.value = true),
					onBlur: _cache[3] || (_cache[3] = ($event) => isFocused.value = false),
					onClick: _cache[4] || (_cache[4] = withModifiers(() => {}, ["stop"]))
				}), null, 16, _hoisted_1$14), [[vModelCheckbox, unref(model)]]), createBaseVNode("span", { class: normalizeClass(unref(ns).e("inner")) }, null, 2)], 2), unref(hasOwnLabel) ? (openBlock(), createElementBlock("span", {
					key: 0,
					class: normalizeClass(unref(ns).e("label"))
				}, [renderSlot(_ctx.$slots, "default"), !_ctx.$slots.default ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [createTextVNode(toDisplayString(__props.label), 1)], 64)) : createCommentVNode("v-if", true)], 2)) : createCommentVNode("v-if", true)]),
				_: 3
			}, 8, [
				"for",
				"class",
				"aria-controls",
				"aria-checked",
				"aria-label",
				"onClick"
			]);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/checkbox/src/checkbox-button.vue_vue_type_script_setup_true_lang.mjs
var _hoisted_1$13 = [
	"name",
	"tabindex",
	"disabled"
];
//#endregion
//#region node_modules/element-plus/es/components/checkbox/src/checkbox-button.mjs
var checkbox_button_default = /* @__PURE__ */ defineComponent({
	name: "ElCheckboxButton",
	__name: "checkbox-button",
	props: checkboxProps,
	emits: checkboxEmits,
	setup(__props) {
		const props = __props;
		const { isFocused, isChecked, isDisabled, checkboxButtonSize, model, actualValue, handleChange } = useCheckbox(props, useSlots());
		const inputBindings = computed(() => {
			if (props.trueValue || props.falseValue || props.trueLabel || props.falseLabel) return {
				"true-value": props.trueValue ?? props.trueLabel ?? true,
				"false-value": props.falseValue ?? props.falseLabel ?? false
			};
			return { value: actualValue.value };
		});
		const checkboxGroup = inject(checkboxGroupContextKey, void 0);
		const ns = useNamespace("checkbox");
		const activeStyle = computed(() => {
			const fillValue = checkboxGroup?.fill?.value ?? "";
			return {
				backgroundColor: fillValue,
				borderColor: fillValue,
				color: checkboxGroup?.textColor?.value ?? "",
				boxShadow: fillValue ? `-1px 0 0 0 ${fillValue}` : void 0
			};
		});
		const labelKls = computed(() => {
			return [
				ns.b("button"),
				ns.bm("button", checkboxButtonSize.value),
				ns.is("disabled", isDisabled.value),
				ns.is("checked", isChecked.value),
				ns.is("focus", isFocused.value)
			];
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("label", { class: normalizeClass(labelKls.value) }, [withDirectives(createBaseVNode("input", mergeProps({
				"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => /* @__PURE__ */ isRef(model) ? model.value = $event : null),
				class: unref(ns).be("button", "original"),
				type: "checkbox",
				name: __props.name,
				tabindex: __props.tabindex,
				disabled: unref(isDisabled)
			}, inputBindings.value, {
				onChange: _cache[1] || (_cache[1] = (...args) => unref(handleChange) && unref(handleChange)(...args)),
				onFocus: _cache[2] || (_cache[2] = ($event) => isFocused.value = true),
				onBlur: _cache[3] || (_cache[3] = ($event) => isFocused.value = false),
				onClick: _cache[4] || (_cache[4] = withModifiers(() => {}, ["stop"]))
			}), null, 16, _hoisted_1$13), [[vModelCheckbox, unref(model)]]), _ctx.$slots.default || __props.label ? (openBlock(), createElementBlock("span", {
				key: 0,
				class: normalizeClass(unref(ns).be("button", "inner")),
				style: normalizeStyle(unref(isChecked) ? activeStyle.value : void 0)
			}, [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString(__props.label), 1)])], 6)) : createCommentVNode("v-if", true)], 2);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/checkbox/src/checkbox-group2.mjs
var checkbox_group_default = /* @__PURE__ */ defineComponent({
	name: "ElCheckboxGroup",
	__name: "checkbox-group",
	props: checkboxGroupProps,
	emits: checkboxGroupEmits,
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const ns = useNamespace("checkbox");
		const checkboxDisabled = useFormDisabled();
		const { formItem } = useFormItem();
		const { inputId: groupId, isLabeledByFormItem } = useFormItemInputId(props, { formItemContext: formItem });
		const changeEvent = async (value) => {
			emit(UPDATE_MODEL_EVENT, value);
			await nextTick();
			emit(CHANGE_EVENT, value);
		};
		const modelValue = computed({
			get() {
				return props.modelValue;
			},
			set(val) {
				changeEvent(val);
			}
		});
		const aliasProps = computed(() => ({
			...checkboxDefaultProps,
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
		const optionComponent = computed(() => props.type === "button" ? checkbox_button_default : checkbox_default);
		provide(checkboxGroupContextKey, {
			...pick(/* @__PURE__ */ toRefs(props), [
				"size",
				"min",
				"max",
				"validateEvent",
				"fill",
				"textColor"
			]),
			disabled: checkboxDisabled,
			modelValue,
			changeEvent
		});
		watch(() => props.modelValue, (newVal, oldValue) => {
			if (props.validateEvent && !isEqual(newVal, oldValue)) formItem?.validate("change").catch(NOOP);
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(resolveDynamicComponent(__props.tag), {
				id: unref(groupId),
				class: normalizeClass(unref(ns).b("group")),
				role: "group",
				"aria-label": !unref(isLabeledByFormItem) ? __props.ariaLabel || "checkbox-group" : void 0,
				"aria-labelledby": unref(isLabeledByFormItem) ? unref(formItem)?.labelId : void 0
			}, {
				default: withCtx(() => [renderSlot(_ctx.$slots, "default", {}, () => [(openBlock(true), createElementBlock(Fragment, null, renderList(__props.options, (item, index) => {
					return openBlock(), createBlock(resolveDynamicComponent(optionComponent.value), mergeProps({ key: index }, { ref_for: true }, getOptionProps(item)), null, 16);
				}), 128))])]),
				_: 3
			}, 8, [
				"id",
				"class",
				"aria-label",
				"aria-labelledby"
			]);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/checkbox/index.mjs
var ElCheckbox = withInstall(checkbox_default, {
	CheckboxButton: checkbox_button_default,
	CheckboxGroup: checkbox_group_default
});
var ElCheckboxButton = withNoopInstall(checkbox_button_default);
var ElCheckboxGroup = withNoopInstall(checkbox_group_default);
//#endregion
//#region node_modules/element-plus/es/components/descriptions/src/description.mjs
/**
* @deprecated Removed after 3.0.0, Use `DescriptionProps` instead.
*/
var descriptionProps = buildProps({
	/**
	* @description with or without border
	*/
	border: Boolean,
	/**
	* @description numbers of `Descriptions Item` in one line
	*/
	column: {
		type: Number,
		default: 3
	},
	/**
	* @description direction of list
	*/
	direction: {
		type: String,
		values: ["horizontal", "vertical"],
		default: "horizontal"
	},
	/**
	* @description size of list
	*/
	size: useSizeProp,
	/**
	* @description title text, display on the top left
	*/
	title: {
		type: String,
		default: ""
	},
	/**
	* @description extra text, display on the top right
	*/
	extra: {
		type: String,
		default: ""
	},
	/**
	* @description width of every label column
	*/
	labelWidth: { type: [String, Number] }
});
//#endregion
//#region node_modules/element-plus/es/components/descriptions/src/constants.mjs
var COMPONENT_NAME$1 = "ElDescriptionsItem";
var DescriptionItem = /* @__PURE__ */ defineComponent({
	name: COMPONENT_NAME$1,
	props: buildProps({
		/**
		* @description label text
		*/
		label: {
			type: String,
			default: ""
		},
		/**
		* @description colspan of column
		*/
		span: {
			type: Number,
			default: 1
		},
		/**
		* @description the number of rows a cell should span
		*/
		rowspan: {
			type: Number,
			default: 1
		},
		/**
		* @description column width, the width of the same column in different rows is set by the max value (If no `border`, width contains label and content)
		*/
		width: {
			type: [String, Number],
			default: ""
		},
		/**
		* @description column minimum width, columns with `width` has a fixed width, while columns with `min-width` has a width that is distributed in proportion (If no`border`, width contains label and content)
		*/
		minWidth: {
			type: [String, Number],
			default: ""
		},
		/**
		* @description column label width, if not set, it will be the same as the width of the column. Higher priority than the `label-width` of `Descriptions`
		*/
		labelWidth: { type: [String, Number] },
		/**
		* @description column content alignment (If no `border`, effective for both label and content)
		*/
		align: {
			type: String,
			values: columnAlignment,
			default: "left"
		},
		/**
		* @description column label alignment, if omitted, the value of the above `align` attribute will be applied (If no `border`, please use `align` attribute)
		*/
		labelAlign: {
			type: String,
			values: columnAlignment
		},
		/**
		* @description column content custom class name
		*/
		className: {
			type: String,
			default: ""
		},
		/**
		* @description column label custom class name
		*/
		labelClassName: {
			type: String,
			default: ""
		}
	})
});
//#endregion
//#region node_modules/element-plus/es/components/descriptions/src/token.mjs
var descriptionsKey = Symbol("elDescriptions");
//#endregion
//#region node_modules/element-plus/es/components/descriptions/src/descriptions-row.mjs
/**
* @deprecated Removed after 3.0.0, Use `DescriptionsRowProps` instead.
*/
var descriptionsRowProps = buildProps({ row: {
	type: definePropType(Array),
	default: () => []
} });
//#endregion
//#region node_modules/element-plus/es/components/descriptions/src/descriptions-cell.mjs
var descriptions_cell_default = /* @__PURE__ */ defineComponent({
	name: "ElDescriptionsCell",
	props: {
		cell: { type: Object },
		tag: {
			type: String,
			default: "td"
		},
		type: { type: String }
	},
	setup() {
		return { descriptions: inject(descriptionsKey, {}) };
	},
	render() {
		const item = getNormalizedProps(this.cell);
		const directives = (this.cell?.dirs || []).map((dire) => {
			const { dir, arg, modifiers, value } = dire;
			return [
				dir,
				value,
				arg,
				modifiers
			];
		});
		const { border, direction } = this.descriptions;
		const isVertical = direction === "vertical";
		const renderLabel = () => this.cell?.children?.label?.() || item.label;
		const renderContent = () => this.cell?.children?.default?.();
		const span = item.span;
		const rowspan = item.rowspan;
		const align = item.align ? `is-${item.align}` : "";
		const labelAlign = item.labelAlign ? `is-${item.labelAlign}` : align;
		const className = item.className;
		const labelClassName = item.labelClassName;
		const style = {
			width: addUnit(this.type === "label" ? item.labelWidth ?? this.descriptions.labelWidth ?? item.width : item.width),
			minWidth: addUnit(item.minWidth)
		};
		const ns = useNamespace("descriptions");
		switch (this.type) {
			case "label": return withDirectives(h$1(this.tag, {
				style,
				class: [
					ns.e("cell"),
					ns.e("label"),
					ns.is("bordered-label", border),
					ns.is("vertical-label", isVertical),
					labelAlign,
					labelClassName
				],
				colSpan: isVertical ? span : 1,
				rowspan: isVertical ? 1 : rowspan
			}, renderLabel()), directives);
			case "content": return withDirectives(h$1(this.tag, {
				style,
				class: [
					ns.e("cell"),
					ns.e("content"),
					ns.is("bordered-content", border),
					ns.is("vertical-content", isVertical),
					align,
					className
				],
				colSpan: isVertical ? span : span * 2 - 1,
				rowspan: isVertical ? rowspan * 2 - 1 : rowspan
			}, renderContent()), directives);
			default: {
				const label = renderLabel();
				const labelStyle = {};
				const width = addUnit(item.labelWidth ?? this.descriptions.labelWidth);
				if (width) {
					labelStyle.width = width;
					labelStyle.display = "inline-block";
				}
				return withDirectives(h$1("td", {
					style,
					class: [ns.e("cell"), align],
					colSpan: span,
					rowspan
				}, [!isNil(label) ? h$1("span", {
					style: labelStyle,
					class: [ns.e("label"), labelClassName]
				}, label) : void 0, h$1("span", { class: [ns.e("content"), className] }, renderContent())]), directives);
			}
		}
	}
});
//#endregion
//#region node_modules/element-plus/es/components/descriptions/src/descriptions-row.vue_vue_type_script_setup_true_lang.mjs
var _hoisted_1$12 = { key: 1 };
//#endregion
//#region node_modules/element-plus/es/components/descriptions/src/descriptions-row2.mjs
var descriptions_row_default = /* @__PURE__ */ defineComponent({
	name: "ElDescriptionsRow",
	__name: "descriptions-row",
	props: descriptionsRowProps,
	setup(__props) {
		const descriptions = inject(descriptionsKey, {});
		return (_ctx, _cache) => {
			return unref(descriptions).direction === "vertical" ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [createBaseVNode("tr", null, [(openBlock(true), createElementBlock(Fragment, null, renderList(__props.row, (cell, _index) => {
				return openBlock(), createBlock(unref(descriptions_cell_default), {
					key: `tr1-${_index}`,
					cell,
					tag: "th",
					type: "label"
				}, null, 8, ["cell"]);
			}), 128))]), createBaseVNode("tr", null, [(openBlock(true), createElementBlock(Fragment, null, renderList(__props.row, (cell, _index) => {
				return openBlock(), createBlock(unref(descriptions_cell_default), {
					key: `tr2-${_index}`,
					cell,
					tag: "td",
					type: "content"
				}, null, 8, ["cell"]);
			}), 128))])], 64)) : (openBlock(), createElementBlock("tr", _hoisted_1$12, [(openBlock(true), createElementBlock(Fragment, null, renderList(__props.row, (cell, _index) => {
				return openBlock(), createElementBlock(Fragment, { key: `tr3-${_index}` }, [unref(descriptions).border ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [createVNode(unref(descriptions_cell_default), {
					cell,
					tag: "td",
					type: "label"
				}, null, 8, ["cell"]), createVNode(unref(descriptions_cell_default), {
					cell,
					tag: "td",
					type: "content"
				}, null, 8, ["cell"])], 64)) : (openBlock(), createBlock(unref(descriptions_cell_default), {
					key: 1,
					cell,
					tag: "td",
					type: "both"
				}, null, 8, ["cell"]))], 64);
			}), 128))]));
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/descriptions/index.mjs
var ElDescriptions = withInstall(/* @__PURE__ */ defineComponent({
	name: "ElDescriptions",
	__name: "description",
	props: descriptionProps,
	setup(__props) {
		const props = __props;
		const ns = useNamespace("descriptions");
		const descriptionsSize = useFormSize();
		const slots = useSlots();
		provide(descriptionsKey, props);
		const descriptionKls = computed(() => [ns.b(), ns.m(descriptionsSize.value)]);
		const filledNode = (node, span, count, isLast = false) => {
			if (!node.props) node.props = {};
			if (span > count) node.props.span = count;
			if (isLast) node.props.span = span;
			return node;
		};
		const getRows = () => {
			if (!slots.default) return [];
			const children = flattedChildren(slots.default()).filter((node) => node?.type?.name === COMPONENT_NAME$1);
			const rows = [];
			let temp = [];
			let count = props.column;
			let totalSpan = 0;
			const rowspanTemp = [];
			children.forEach((node, index) => {
				const span = node.props?.span || 1;
				const rowspan = node.props?.rowspan || 1;
				const rowNo = rows.length;
				rowspanTemp[rowNo] ||= 0;
				if (rowspan > 1) for (let i = 1; i < rowspan; i++) {
					rowspanTemp[rowNo + i] ||= 0;
					rowspanTemp[rowNo + i]++;
					totalSpan++;
				}
				if (rowspanTemp[rowNo] > 0) {
					count -= rowspanTemp[rowNo];
					rowspanTemp[rowNo] = 0;
				}
				if (index < children.length - 1) totalSpan += span > count ? count : span;
				if (index === children.length - 1) {
					const lastSpan = props.column - totalSpan % props.column;
					temp.push(filledNode(node, lastSpan, count, true));
					rows.push(temp);
					return;
				}
				if (span < count) {
					count -= span;
					temp.push(node);
				} else {
					temp.push(filledNode(node, span, count));
					rows.push(temp);
					count = props.column;
					temp = [];
				}
			});
			return rows;
		};
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", { class: normalizeClass(descriptionKls.value) }, [__props.title || __props.extra || _ctx.$slots.title || _ctx.$slots.extra ? (openBlock(), createElementBlock("div", {
				key: 0,
				class: normalizeClass(unref(ns).e("header"))
			}, [createBaseVNode("div", { class: normalizeClass(unref(ns).e("title")) }, [renderSlot(_ctx.$slots, "title", {}, () => [createTextVNode(toDisplayString(__props.title), 1)])], 2), createBaseVNode("div", { class: normalizeClass(unref(ns).e("extra")) }, [renderSlot(_ctx.$slots, "extra", {}, () => [createTextVNode(toDisplayString(__props.extra), 1)])], 2)], 2)) : createCommentVNode("v-if", true), createBaseVNode("div", { class: normalizeClass(unref(ns).e("body")) }, [createBaseVNode("table", { class: normalizeClass([unref(ns).e("table"), unref(ns).is("bordered", __props.border)]) }, [createBaseVNode("tbody", null, [(openBlock(true), createElementBlock(Fragment, null, renderList(getRows(), (row, _index) => {
				return openBlock(), createBlock(descriptions_row_default, {
					key: _index,
					row
				}, null, 8, ["row"]);
			}), 128))])], 2)], 2)], 2);
		};
	}
}), { DescriptionsItem: DescriptionItem });
var ElDescriptionsItem = withNoopInstall(DescriptionItem);
//#endregion
//#region node_modules/element-plus/es/components/dialog/src/dialog-content.mjs
/**
* @deprecated Removed after 3.0.0, Use `DialogContentProps` instead.
*/
var dialogContentProps = buildProps({
	/**
	* @description whether to align the header and footer in center
	*/
	center: Boolean,
	/**
	* @description whether to align the dialog both horizontally and vertically
	*/
	alignCenter: {
		type: Boolean,
		default: void 0
	},
	/**
	* @description custom close icon, default is Close
	*/
	closeIcon: { type: iconPropType },
	/**
	* @description enable dragging feature for Dialog
	*/
	draggable: {
		type: Boolean,
		default: void 0
	},
	/**
	* @description draggable Dialog can overflow the viewport
	*/
	overflow: {
		type: Boolean,
		default: void 0
	},
	/**
	* @description whether the Dialog takes up full screen
	*/
	fullscreen: Boolean,
	/**
	* @description custom class names for header wrapper
	*/
	headerClass: String,
	/**
	* @description custom class names for body wrapper
	*/
	bodyClass: String,
	/**
	* @description custom class names for footer wrapper
	*/
	footerClass: String,
	/**
	* @description whether to show a close button
	*/
	showClose: {
		type: Boolean,
		default: true
	},
	/**
	* @description title of Dialog. Can also be passed with a named slot (see the following table)
	*/
	title: {
		type: String,
		default: ""
	},
	/**
	* @description header's aria-level attribute
	*/
	ariaLevel: {
		type: String,
		default: "2"
	}
});
var dialogContentEmits = { close: () => true };
var dialogContentPropsDefaults = {
	alignCenter: void 0,
	draggable: void 0,
	overflow: void 0,
	showClose: true,
	title: "",
	ariaLevel: "2"
};
//#endregion
//#region node_modules/element-plus/es/components/dialog/src/dialog.mjs
/**
* @deprecated Removed after 3.0.0, Use `DialogProps` instead.
*/
var dialogProps = buildProps({
	...dialogContentProps,
	/**
	* @description whether to append Dialog itself to body. A nested Dialog should have this attribute set to `true`
	*/
	appendToBody: Boolean,
	/**
	* @description which element the Dialog appends to
	*/
	appendTo: {
		type: definePropType([String, Object]),
		default: "body"
	},
	/**
	* @description callback before Dialog closes, and it will prevent Dialog from closing, use done to close the dialog
	*/
	beforeClose: { type: definePropType(Function) },
	/**
	* @description destroy elements in Dialog when closed
	*/
	destroyOnClose: Boolean,
	/**
	* @description whether the Dialog can be closed by clicking the mask
	*/
	closeOnClickModal: {
		type: Boolean,
		default: true
	},
	/**
	* @description whether the Dialog can be closed by pressing ESC
	*/
	closeOnPressEscape: {
		type: Boolean,
		default: true
	},
	/**
	* @description whether scroll of body is disabled while Dialog is displayed
	*/
	lockScroll: {
		type: Boolean,
		default: true
	},
	/**
	* @description whether a mask is displayed
	*/
	modal: {
		type: Boolean,
		default: true
	},
	/**
	* @description whether the mask is penetrable
	*/
	modalPenetrable: Boolean,
	/**
	* @description the Time(milliseconds) before open
	*/
	openDelay: {
		type: Number,
		default: 0
	},
	/**
	* @description the Time(milliseconds) before close
	*/
	closeDelay: {
		type: Number,
		default: 0
	},
	/**
	* @description value for `margin-top` of Dialog CSS, default is 15vh
	*/
	top: { type: String },
	/**
	* @description visibility of Dialog
	*/
	modelValue: Boolean,
	/**
	* @description custom class names for mask
	*/
	modalClass: String,
	/**
	* @description custom class names for header wrapper
	*/
	headerClass: String,
	/**
	* @description custom class names for body wrapper
	*/
	bodyClass: String,
	/**
	* @description custom class names for footer wrapper
	*/
	footerClass: String,
	/**
	* @description width of Dialog, default is 50%
	*/
	width: { type: [String, Number] },
	/**
	* @description same as z-index in native CSS, z-order of dialog
	*/
	zIndex: { type: Number },
	trapFocus: Boolean,
	/**
	* @description header's aria-level attribute
	*/
	headerAriaLevel: {
		type: String,
		default: "2"
	},
	/**
	* @description custom transition configuration for dialog animation, it can be a string (transition name) or an object with Vue transition props
	*/
	transition: {
		type: definePropType([String, Object]),
		default: void 0
	}
});
var dialogEmits = {
	open: () => true,
	opened: () => true,
	close: () => true,
	closed: () => true,
	[UPDATE_MODEL_EVENT]: (value) => isBoolean(value),
	openAutoFocus: () => true,
	closeAutoFocus: () => true
};
({ ...dialogContentPropsDefaults });
//#endregion
//#region node_modules/element-plus/es/components/overlay/src/overlay.mjs
var overlayProps = buildProps({
	mask: {
		type: Boolean,
		default: true
	},
	customMaskEvent: Boolean,
	overlayClass: { type: definePropType([
		String,
		Array,
		Object
	]) },
	zIndex: { type: definePropType([String, Number]) }
});
var overlayEmits = { click: (evt) => evt instanceof MouseEvent };
var BLOCK = "overlay";
//#endregion
//#region node_modules/element-plus/es/components/overlay/index.mjs
var ElOverlay = /* @__PURE__ */ defineComponent({
	name: "ElOverlay",
	props: overlayProps,
	emits: overlayEmits,
	setup(props, { slots, emit }) {
		const ns = useNamespace(BLOCK);
		const onMaskClick = (e) => {
			emit("click", e);
		};
		const { onClick, onMousedown, onMouseup } = useSameTarget(props.customMaskEvent ? void 0 : onMaskClick);
		return () => {
			return props.mask ? createVNode("div", {
				class: [ns.b(), props.overlayClass],
				style: { zIndex: props.zIndex },
				onClick,
				onMousedown,
				onMouseup
			}, [renderSlot(slots, "default")], 14, [
				"onClick",
				"onMouseup",
				"onMousedown"
			]) : h$1("div", {
				class: props.overlayClass,
				style: {
					zIndex: props.zIndex,
					position: "fixed",
					top: "0px",
					right: "0px",
					bottom: "0px",
					left: "0px"
				}
			}, [renderSlot(slots, "default")]);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/dialog/src/constants.mjs
var dialogInjectionKey = Symbol("dialogInjectionKey");
var DEFAULT_DIALOG_TRANSITION = "dialog-fade";
//#endregion
//#region node_modules/element-plus/es/components/dialog/src/use-dialog.mjs
var COMPONENT_NAME = "ElDialog";
var useDialog = (props, targetRef) => {
	const emit = getCurrentInstance().emit;
	const { nextZIndex } = useZIndex();
	let lastPosition = "";
	const titleId = useId();
	const bodyId = useId();
	const visible = /* @__PURE__ */ ref(false);
	const closed = /* @__PURE__ */ ref(false);
	const rendered = /* @__PURE__ */ ref(false);
	const zIndex = /* @__PURE__ */ ref(props.zIndex ?? nextZIndex());
	const closing = /* @__PURE__ */ ref(false);
	let openTimer = void 0;
	let closeTimer = void 0;
	const config = useGlobalConfig();
	const namespace = computed(() => config.value?.namespace ?? "el");
	const globalConfig = computed(() => config.value?.dialog);
	const style = computed(() => {
		const style = {};
		const varPrefix = `--${namespace.value}-dialog`;
		if (!props.fullscreen) {
			if (props.top) style[`${varPrefix}-margin-top`] = props.top;
			const width = addUnit(props.width);
			if (width) style[`${varPrefix}-width`] = width;
		}
		return style;
	});
	const _draggable = computed(() => (props.draggable ?? globalConfig.value?.draggable ?? false) && !props.fullscreen);
	const _alignCenter = computed(() => props.alignCenter ?? globalConfig.value?.alignCenter ?? false);
	const _overflow = computed(() => props.overflow ?? globalConfig.value?.overflow ?? false);
	const penetrable = computed(() => props.modalPenetrable && !props.modal && !props.fullscreen);
	const overlayDialogStyle = computed(() => {
		if (_alignCenter.value) return { display: "flex" };
		return {};
	});
	const transitionConfig = computed(() => {
		const transition = props.transition ?? globalConfig.value?.transition ?? "dialog-fade";
		const baseConfig = {
			name: transition,
			onAfterEnter: afterEnter,
			onBeforeLeave: beforeLeave,
			onAfterLeave: afterLeave
		};
		if (isObject$2(transition)) {
			const config = { ...transition };
			const _mergeHook = (userHook, defaultHook) => {
				return (el) => {
					if (isArray$1(userHook)) userHook.forEach((fn) => {
						if (isFunction$1(fn)) fn(el);
					});
					else if (isFunction$1(userHook)) userHook(el);
					defaultHook();
				};
			};
			config.onAfterEnter = _mergeHook(config.onAfterEnter, afterEnter);
			config.onBeforeLeave = _mergeHook(config.onBeforeLeave, beforeLeave);
			config.onAfterLeave = _mergeHook(config.onAfterLeave, afterLeave);
			if (!config.name) {
				config.name = DEFAULT_DIALOG_TRANSITION;
				debugWarn(COMPONENT_NAME, `transition.name is missing when using object syntax, fallback to '${DEFAULT_DIALOG_TRANSITION}'`);
			}
			return config;
		}
		return baseConfig;
	});
	function afterEnter() {
		emit("opened");
	}
	function afterLeave() {
		emit("closed");
		emit(UPDATE_MODEL_EVENT, false);
		if (props.destroyOnClose) rendered.value = false;
		closing.value = false;
	}
	function beforeLeave() {
		closing.value = true;
		emit("close");
	}
	function open() {
		closeTimer?.();
		openTimer?.();
		if (props.openDelay && props.openDelay > 0) ({stop: openTimer} = useTimeoutFn(() => doOpen(), props.openDelay));
		else doOpen();
	}
	function close() {
		openTimer?.();
		closeTimer?.();
		if (props.closeDelay && props.closeDelay > 0) ({stop: closeTimer} = useTimeoutFn(() => doClose(), props.closeDelay));
		else doClose();
	}
	function handleClose() {
		function hide(shouldCancel) {
			if (shouldCancel) return;
			closed.value = true;
			visible.value = false;
		}
		if (props.beforeClose) props.beforeClose(hide);
		else close();
	}
	function onModalClick() {
		if (props.closeOnClickModal) handleClose();
	}
	function doOpen() {
		if (!isClient) return;
		visible.value = true;
	}
	function doClose() {
		visible.value = false;
	}
	function onOpenAutoFocus() {
		emit("openAutoFocus");
	}
	function onCloseAutoFocus() {
		emit("closeAutoFocus");
	}
	function onFocusoutPrevented(event) {
		if (event.detail?.focusReason === "pointer") event.preventDefault();
	}
	if (props.lockScroll) useLockscreen(visible);
	function onCloseRequested() {
		if (props.closeOnPressEscape) handleClose();
	}
	function bringToFront() {
		if (!visible.value || !penetrable.value || props.zIndex !== void 0) return;
		zIndex.value = nextZIndex();
	}
	watch(() => props.zIndex, () => {
		zIndex.value = props.zIndex ?? nextZIndex();
	});
	watch(() => props.modelValue, (val) => {
		if (val) {
			closed.value = false;
			closing.value = false;
			open();
			rendered.value = true;
			zIndex.value = props.zIndex ?? nextZIndex();
			nextTick(() => {
				emit("open");
				if (targetRef.value) {
					targetRef.value.parentElement.scrollTop = 0;
					targetRef.value.parentElement.scrollLeft = 0;
					targetRef.value.scrollTop = 0;
				}
			});
		} else if (visible.value) close();
	});
	watch(() => props.fullscreen, (val) => {
		if (!targetRef.value) return;
		if (val) {
			lastPosition = targetRef.value.style.transform;
			targetRef.value.style.transform = "";
		} else targetRef.value.style.transform = lastPosition;
	});
	onMounted(() => {
		if (props.modelValue) {
			visible.value = true;
			rendered.value = true;
			open();
		}
	});
	return {
		afterEnter,
		afterLeave,
		beforeLeave,
		handleClose,
		onModalClick,
		close,
		doClose,
		onOpenAutoFocus,
		onCloseAutoFocus,
		onCloseRequested,
		onFocusoutPrevented,
		bringToFront,
		titleId,
		bodyId,
		closed,
		style,
		overlayDialogStyle,
		rendered,
		visible,
		zIndex,
		transitionConfig,
		_draggable,
		_alignCenter,
		_overflow,
		closing,
		penetrable
	};
};
//#endregion
//#region node_modules/element-plus/es/utils/vue/refs.mjs
var composeRefs = (...refs) => {
	return (el) => {
		refs.forEach((ref) => {
			ref.value = el;
		});
	};
};
//#endregion
//#region node_modules/element-plus/es/components/dialog/src/dialog-content.vue_vue_type_script_setup_true_lang.mjs
var _hoisted_1$11 = ["aria-level"];
var _hoisted_2$7 = ["aria-label"];
var _hoisted_3$3 = ["id"];
//#endregion
//#region node_modules/element-plus/es/components/dialog/src/dialog-content2.mjs
var dialog_content_default = /* @__PURE__ */ defineComponent({
	name: "ElDialogContent",
	__name: "dialog-content",
	props: dialogContentProps,
	emits: dialogContentEmits,
	setup(__props, { expose: __expose }) {
		const { t } = useLocale();
		const { Close } = CloseComponents;
		const props = __props;
		const { dialogRef, headerRef, bodyId, ns, style } = inject(dialogInjectionKey);
		const { focusTrapRef } = inject(FOCUS_TRAP_INJECTION_KEY);
		const composedDialogRef = composeRefs(focusTrapRef, dialogRef);
		const draggable = computed(() => !!props.draggable);
		const { resetPosition, updatePosition, isDragging } = useDraggable(dialogRef, headerRef, draggable, computed(() => !!props.overflow));
		const dialogKls = computed(() => [
			ns.b(),
			ns.is("fullscreen", props.fullscreen),
			ns.is("draggable", draggable.value),
			ns.is("dragging", isDragging.value),
			ns.is("align-center", !!props.alignCenter),
			{ [ns.m("center")]: props.center }
		]);
		__expose({
			resetPosition,
			updatePosition
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref: unref(composedDialogRef),
				class: normalizeClass(dialogKls.value),
				style: normalizeStyle(unref(style)),
				tabindex: "-1"
			}, [
				createBaseVNode("header", {
					ref_key: "headerRef",
					ref: headerRef,
					class: normalizeClass([
						unref(ns).e("header"),
						__props.headerClass,
						{ "show-close": __props.showClose }
					])
				}, [renderSlot(_ctx.$slots, "header", {}, () => [createBaseVNode("span", {
					role: "heading",
					"aria-level": __props.ariaLevel,
					class: normalizeClass(unref(ns).e("title"))
				}, toDisplayString(__props.title), 11, _hoisted_1$11)]), __props.showClose ? (openBlock(), createElementBlock("button", {
					key: 0,
					"aria-label": unref(t)("el.dialog.close"),
					class: normalizeClass(unref(ns).e("headerbtn")),
					type: "button",
					onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
				}, [createVNode(unref(ElIcon), { class: normalizeClass(unref(ns).e("close")) }, {
					default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(__props.closeIcon || unref(Close))))]),
					_: 1
				}, 8, ["class"])], 10, _hoisted_2$7)) : createCommentVNode("v-if", true)], 2),
				createBaseVNode("div", {
					id: unref(bodyId),
					class: normalizeClass([unref(ns).e("body"), __props.bodyClass])
				}, [renderSlot(_ctx.$slots, "default")], 10, _hoisted_3$3),
				_ctx.$slots.footer ? (openBlock(), createElementBlock("footer", {
					key: 0,
					class: normalizeClass([unref(ns).e("footer"), __props.footerClass])
				}, [renderSlot(_ctx.$slots, "footer")], 2)) : createCommentVNode("v-if", true)
			], 6);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/dialog/src/dialog.vue_vue_type_script_setup_true_lang.mjs
var _hoisted_1$10 = [
	"aria-label",
	"aria-labelledby",
	"aria-describedby"
];
//#endregion
//#region node_modules/element-plus/es/components/dialog/index.mjs
var ElDialog = withInstall(/* @__PURE__ */ defineComponent({
	name: "ElDialog",
	inheritAttrs: false,
	__name: "dialog",
	props: dialogProps,
	emits: dialogEmits,
	setup(__props, { expose: __expose }) {
		const props = __props;
		const slots = useSlots();
		useDeprecated({
			scope: "el-dialog",
			from: "the title slot",
			replacement: "the header slot",
			version: "3.0.0",
			ref: "https://element-plus.org/en-US/component/dialog.html#slots"
		}, computed(() => !!slots.title));
		const ns = useNamespace("dialog");
		const dialogRef = /* @__PURE__ */ ref();
		const headerRef = /* @__PURE__ */ ref();
		const dialogContentRef = /* @__PURE__ */ ref();
		const { visible, titleId, bodyId, style, overlayDialogStyle, rendered, transitionConfig, zIndex, _draggable, _alignCenter, _overflow, penetrable, handleClose, onModalClick, onOpenAutoFocus, onCloseAutoFocus, onCloseRequested, onFocusoutPrevented, bringToFront, closing } = useDialog(props, dialogRef);
		provide(dialogInjectionKey, {
			dialogRef,
			headerRef,
			bodyId,
			ns,
			rendered,
			style
		});
		const overlayEvent = useSameTarget(onModalClick);
		const resetPosition = () => {
			dialogContentRef.value?.resetPosition();
		};
		__expose({
			/** @description whether the dialog is visible */
			visible,
			dialogContentRef,
			resetPosition,
			handleClose
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Teleport, {
				to: __props.appendTo,
				disabled: __props.appendTo !== "body" ? false : !__props.appendToBody
			}, [createVNode(Transition, mergeProps(unref(transitionConfig), { persisted: "" }), {
				default: withCtx(() => [withDirectives(createVNode(unref(ElOverlay), {
					"custom-mask-event": "",
					mask: __props.modal,
					"overlay-class": [
						__props.modalClass ?? "",
						`${unref(ns).namespace.value}-modal-dialog`,
						unref(ns).is("penetrable", unref(penetrable))
					],
					"z-index": unref(zIndex)
				}, {
					default: withCtx(() => [createBaseVNode("div", {
						role: "dialog",
						"aria-modal": "true",
						"aria-label": __props.title || void 0,
						"aria-labelledby": !__props.title ? unref(titleId) : void 0,
						"aria-describedby": unref(bodyId),
						class: normalizeClass([`${unref(ns).namespace.value}-overlay-dialog`, unref(ns).is("closing", unref(closing))]),
						style: normalizeStyle(unref(overlayDialogStyle)),
						onClick: _cache[0] || (_cache[0] = (...args) => unref(overlayEvent).onClick && unref(overlayEvent).onClick(...args)),
						onMousedown: _cache[1] || (_cache[1] = (...args) => unref(overlayEvent).onMousedown && unref(overlayEvent).onMousedown(...args)),
						onMouseup: _cache[2] || (_cache[2] = (...args) => unref(overlayEvent).onMouseup && unref(overlayEvent).onMouseup(...args))
					}, [createVNode(unref(focus_trap_default$1), {
						loop: "",
						trapped: unref(visible),
						"focus-start-el": "container",
						onFocusAfterTrapped: unref(onOpenAutoFocus),
						onFocusAfterReleased: unref(onCloseAutoFocus),
						onFocusoutPrevented: unref(onFocusoutPrevented),
						onReleaseRequested: unref(onCloseRequested)
					}, {
						default: withCtx(() => [unref(rendered) ? (openBlock(), createBlock(dialog_content_default, mergeProps({
							key: 0,
							ref_key: "dialogContentRef",
							ref: dialogContentRef
						}, _ctx.$attrs, {
							center: __props.center,
							"align-center": unref(_alignCenter),
							"close-icon": __props.closeIcon,
							draggable: unref(_draggable),
							overflow: unref(_overflow),
							fullscreen: __props.fullscreen,
							"header-class": __props.headerClass,
							"body-class": __props.bodyClass,
							"footer-class": __props.footerClass,
							"show-close": __props.showClose,
							title: __props.title,
							"aria-level": __props.headerAriaLevel,
							onClose: unref(handleClose),
							onMousedown: unref(bringToFront)
						}), createSlots({
							header: withCtx(() => [!_ctx.$slots.title ? renderSlot(_ctx.$slots, "header", {
								key: 0,
								close: unref(handleClose),
								titleId: unref(titleId),
								titleClass: unref(ns).e("title")
							}) : renderSlot(_ctx.$slots, "title", { key: 1 })]),
							default: withCtx(() => [renderSlot(_ctx.$slots, "default")]),
							_: 2
						}, [_ctx.$slots.footer ? {
							name: "footer",
							fn: withCtx(() => [renderSlot(_ctx.$slots, "footer")]),
							key: "0"
						} : void 0]), 1040, [
							"center",
							"align-center",
							"close-icon",
							"draggable",
							"overflow",
							"fullscreen",
							"header-class",
							"body-class",
							"footer-class",
							"show-close",
							"title",
							"aria-level",
							"onClose",
							"onMousedown"
						])) : createCommentVNode("v-if", true)]),
						_: 3
					}, 8, [
						"trapped",
						"onFocusAfterTrapped",
						"onFocusAfterReleased",
						"onFocusoutPrevented",
						"onReleaseRequested"
					])], 46, _hoisted_1$10)]),
					_: 3
				}, 8, [
					"mask",
					"overlay-class",
					"z-index"
				]), [[vShow, unref(visible)]])]),
				_: 3
			}, 16)], 8, ["to", "disabled"]);
		};
	}
}));
//#endregion
//#region node_modules/element-plus/es/components/pagination/src/constants.mjs
var elPaginationKey = Symbol("elPaginationKey");
//#endregion
//#region node_modules/element-plus/es/components/pagination/src/components/prev.mjs
var paginationPrevProps = buildProps({
	disabled: Boolean,
	currentPage: {
		type: Number,
		default: 1
	},
	prevText: { type: String },
	prevIcon: { type: iconPropType }
});
var paginationPrevEmits = { click: (evt) => evt instanceof MouseEvent };
//#endregion
//#region node_modules/element-plus/es/components/pagination/src/components/prev.vue_vue_type_script_setup_true_lang.mjs
var _hoisted_1$9 = [
	"disabled",
	"aria-label",
	"aria-disabled"
];
var _hoisted_2$6 = { key: 0 };
//#endregion
//#region node_modules/element-plus/es/components/pagination/src/components/prev2.mjs
var prev_default = /* @__PURE__ */ defineComponent({
	name: "ElPaginationPrev",
	__name: "prev",
	props: paginationPrevProps,
	emits: paginationPrevEmits,
	setup(__props) {
		const props = __props;
		const { t } = useLocale();
		const internalDisabled = computed(() => props.disabled || props.currentPage <= 1);
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("button", {
				type: "button",
				class: "btn-prev",
				disabled: internalDisabled.value,
				"aria-label": _ctx.prevText || unref(t)("el.pagination.prev"),
				"aria-disabled": internalDisabled.value,
				onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
			}, [_ctx.prevText ? (openBlock(), createElementBlock("span", _hoisted_2$6, toDisplayString(_ctx.prevText), 1)) : (openBlock(), createBlock(unref(ElIcon), { key: 1 }, {
				default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(_ctx.prevIcon)))]),
				_: 1
			}))], 8, _hoisted_1$9);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/pagination/src/components/next.mjs
var paginationNextProps = buildProps({
	disabled: Boolean,
	currentPage: {
		type: Number,
		default: 1
	},
	pageCount: {
		type: Number,
		default: 50
	},
	nextText: { type: String },
	nextIcon: { type: iconPropType }
});
//#endregion
//#region node_modules/element-plus/es/components/pagination/src/components/next.vue_vue_type_script_setup_true_lang.mjs
var _hoisted_1$8 = [
	"disabled",
	"aria-label",
	"aria-disabled"
];
var _hoisted_2$5 = { key: 0 };
//#endregion
//#region node_modules/element-plus/es/components/pagination/src/components/next2.mjs
var next_default = /* @__PURE__ */ defineComponent({
	name: "ElPaginationNext",
	__name: "next",
	props: paginationNextProps,
	emits: ["click"],
	setup(__props) {
		const props = __props;
		const { t } = useLocale();
		const internalDisabled = computed(() => props.disabled || props.currentPage === props.pageCount || props.pageCount === 0);
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("button", {
				type: "button",
				class: "btn-next",
				disabled: internalDisabled.value,
				"aria-label": _ctx.nextText || unref(t)("el.pagination.next"),
				"aria-disabled": internalDisabled.value,
				onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click", $event))
			}, [_ctx.nextText ? (openBlock(), createElementBlock("span", _hoisted_2$5, toDisplayString(_ctx.nextText), 1)) : (openBlock(), createBlock(unref(ElIcon), { key: 1 }, {
				default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(_ctx.nextIcon)))]),
				_: 1
			}))], 8, _hoisted_1$8);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/pagination/src/usePagination.mjs
var usePagination = () => inject(elPaginationKey, {});
//#endregion
//#region node_modules/element-plus/es/components/pagination/src/components/sizes2.mjs
var sizes_default = /* @__PURE__ */ defineComponent({
	name: "ElPaginationSizes",
	__name: "sizes",
	props: buildProps({
		pageSize: {
			type: Number,
			required: true
		},
		pageSizes: {
			type: definePropType(Array),
			default: () => mutable([
				10,
				20,
				30,
				40,
				50,
				100
			])
		},
		popperClass: { type: String },
		popperStyle: { type: definePropType([String, Object]) },
		disabled: Boolean,
		teleported: Boolean,
		size: {
			type: String,
			values: componentSizes
		},
		appendSizeTo: String
	}),
	emits: ["page-size-change"],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const { t } = useLocale();
		const ns = useNamespace("pagination");
		const pagination = usePagination();
		const innerPageSize = /* @__PURE__ */ ref(props.pageSize);
		watch(() => props.pageSizes, (newVal, oldVal) => {
			if (isEqual(newVal, oldVal)) return;
			if (isArray$1(newVal)) emit("page-size-change", newVal.includes(props.pageSize) ? props.pageSize : props.pageSizes[0]);
		});
		watch(() => props.pageSize, (newVal) => {
			innerPageSize.value = newVal;
		});
		const innerPageSizes = computed(() => props.pageSizes);
		function handleChange(val) {
			if (val !== innerPageSize.value) {
				innerPageSize.value = val;
				pagination.handleSizeChange?.(Number(val));
			}
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("span", { class: normalizeClass(unref(ns).e("sizes")) }, [createVNode(unref(ElSelect), {
				"model-value": innerPageSize.value,
				disabled: _ctx.disabled,
				"popper-class": _ctx.popperClass,
				"popper-style": _ctx.popperStyle,
				size: _ctx.size,
				teleported: _ctx.teleported,
				"validate-event": false,
				"append-to": _ctx.appendSizeTo,
				onChange: handleChange
			}, {
				default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(innerPageSizes.value, (item) => {
					return openBlock(), createBlock(unref(ElOption), {
						key: item,
						value: item,
						label: item + unref(t)("el.pagination.pagesize")
					}, null, 8, ["value", "label"]);
				}), 128))]),
				_: 1
			}, 8, [
				"model-value",
				"disabled",
				"popper-class",
				"popper-style",
				"size",
				"teleported",
				"append-to"
			])], 2);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/pagination/src/components/jumper.mjs
var paginationJumperProps = buildProps({ size: {
	type: String,
	values: componentSizes
} });
//#endregion
//#region node_modules/element-plus/es/components/pagination/src/components/jumper.vue_vue_type_script_setup_true_lang.mjs
var _hoisted_1$7 = ["disabled"];
//#endregion
//#region node_modules/element-plus/es/components/pagination/src/components/jumper2.mjs
var jumper_default = /* @__PURE__ */ defineComponent({
	name: "ElPaginationJumper",
	__name: "jumper",
	props: paginationJumperProps,
	setup(__props) {
		const { t } = useLocale();
		const ns = useNamespace("pagination");
		const { pageCount, disabled, currentPage, changeEvent } = usePagination();
		const userInput = /* @__PURE__ */ ref();
		const innerValue = computed(() => userInput.value ?? currentPage?.value);
		function handleInput(val) {
			userInput.value = val ? +val : "";
		}
		function handleChange(val) {
			val = Math.trunc(+val);
			changeEvent?.(val);
			userInput.value = void 0;
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("span", {
				class: normalizeClass(unref(ns).e("jump")),
				disabled: unref(disabled)
			}, [
				createBaseVNode("span", { class: normalizeClass([unref(ns).e("goto")]) }, toDisplayString(unref(t)("el.pagination.goto")), 3),
				createVNode(unref(ElInput), {
					size: _ctx.size,
					class: normalizeClass([unref(ns).e("editor"), unref(ns).is("in-pagination")]),
					min: 1,
					max: unref(pageCount),
					disabled: unref(disabled),
					"model-value": innerValue.value,
					"validate-event": false,
					"aria-label": unref(t)("el.pagination.page"),
					type: "number",
					"onUpdate:modelValue": handleInput,
					onChange: handleChange
				}, null, 8, [
					"size",
					"class",
					"max",
					"disabled",
					"model-value",
					"aria-label"
				]),
				createBaseVNode("span", { class: normalizeClass([unref(ns).e("classifier")]) }, toDisplayString(unref(t)("el.pagination.pageClassifier")), 3)
			], 10, _hoisted_1$7);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/pagination/src/components/total.mjs
var paginationTotalProps = buildProps({ total: {
	type: Number,
	default: 1e3
} });
//#endregion
//#region node_modules/element-plus/es/components/pagination/src/components/total.vue_vue_type_script_setup_true_lang.mjs
var _hoisted_1$6 = ["disabled"];
//#endregion
//#region node_modules/element-plus/es/components/pagination/src/components/total2.mjs
var total_default = /* @__PURE__ */ defineComponent({
	name: "ElPaginationTotal",
	__name: "total",
	props: paginationTotalProps,
	setup(__props) {
		const { t } = useLocale();
		const ns = useNamespace("pagination");
		const { disabled } = usePagination();
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("span", {
				class: normalizeClass(unref(ns).e("total")),
				disabled: unref(disabled)
			}, toDisplayString(unref(t)("el.pagination.total", { total: _ctx.total })), 11, _hoisted_1$6);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/pagination/src/components/pager.mjs
var paginationPagerProps = buildProps({
	currentPage: {
		type: Number,
		default: 1
	},
	pageCount: {
		type: Number,
		required: true
	},
	pagerCount: {
		type: Number,
		default: 7
	},
	disabled: Boolean
});
//#endregion
//#region node_modules/element-plus/es/components/pagination/src/components/pager.vue_vue_type_script_setup_true_lang.mjs
var _hoisted_1$5 = [
	"aria-current",
	"aria-label",
	"tabindex"
];
var _hoisted_2$4 = ["tabindex", "aria-label"];
var _hoisted_3$2 = [
	"aria-current",
	"aria-label",
	"tabindex"
];
var _hoisted_4$1 = ["tabindex", "aria-label"];
var _hoisted_5 = [
	"aria-current",
	"aria-label",
	"tabindex"
];
//#endregion
//#region node_modules/element-plus/es/components/pagination/src/components/pager2.mjs
var pager_default = /* @__PURE__ */ defineComponent({
	name: "ElPaginationPager",
	__name: "pager",
	props: paginationPagerProps,
	emits: [CHANGE_EVENT],
	setup(__props, { emit: __emit }) {
		const props = __props;
		const emit = __emit;
		const nsPager = useNamespace("pager");
		const nsIcon = useNamespace("icon");
		const { t } = useLocale();
		const showPrevMore = /* @__PURE__ */ ref(false);
		const showNextMore = /* @__PURE__ */ ref(false);
		const quickPrevHover = /* @__PURE__ */ ref(false);
		const quickNextHover = /* @__PURE__ */ ref(false);
		const quickPrevFocus = /* @__PURE__ */ ref(false);
		const quickNextFocus = /* @__PURE__ */ ref(false);
		const pagers = computed(() => {
			const pagerCount = props.pagerCount;
			const halfPagerCount = (pagerCount - 1) / 2;
			const currentPage = Number(props.currentPage);
			const pageCount = Number(props.pageCount);
			let showPrevMore = false;
			let showNextMore = false;
			if (pageCount > pagerCount) {
				if (currentPage > pagerCount - halfPagerCount) showPrevMore = true;
				if (currentPage < pageCount - halfPagerCount) showNextMore = true;
			}
			const array = [];
			if (showPrevMore && !showNextMore) {
				const startPage = pageCount - (pagerCount - 2);
				for (let i = startPage; i < pageCount; i++) array.push(i);
			} else if (!showPrevMore && showNextMore) for (let i = 2; i < pagerCount; i++) array.push(i);
			else if (showPrevMore && showNextMore) {
				const offset = Math.floor(pagerCount / 2) - 1;
				for (let i = currentPage - offset; i <= currentPage + offset; i++) array.push(i);
			} else for (let i = 2; i < pageCount; i++) array.push(i);
			return array;
		});
		const prevMoreKls = computed(() => [
			"more",
			"btn-quickprev",
			nsIcon.b(),
			nsPager.is("disabled", props.disabled)
		]);
		const nextMoreKls = computed(() => [
			"more",
			"btn-quicknext",
			nsIcon.b(),
			nsPager.is("disabled", props.disabled)
		]);
		const tabindex = computed(() => props.disabled ? -1 : 0);
		watch(() => [
			props.pageCount,
			props.pagerCount,
			props.currentPage
		], ([pageCount, pagerCount, currentPage]) => {
			const halfPagerCount = (pagerCount - 1) / 2;
			let showPrev = false;
			let showNext = false;
			if (pageCount > pagerCount) {
				showPrev = currentPage > pagerCount - halfPagerCount;
				showNext = currentPage < pageCount - halfPagerCount;
			}
			quickPrevHover.value &&= showPrev;
			quickNextHover.value &&= showNext;
			showPrevMore.value = showPrev;
			showNextMore.value = showNext;
		}, { immediate: true });
		function onMouseEnter(forward = false) {
			if (props.disabled) return;
			if (forward) quickPrevHover.value = true;
			else quickNextHover.value = true;
		}
		function onFocus(forward = false) {
			if (forward) quickPrevFocus.value = true;
			else quickNextFocus.value = true;
		}
		function onEnter(e) {
			const target = e.target;
			if (target.tagName.toLowerCase() === "li" && Array.from(target.classList).includes("number")) {
				const newPage = Number(target.textContent);
				if (newPage !== props.currentPage) emit(CHANGE_EVENT, newPage);
			} else if (target.tagName.toLowerCase() === "li" && Array.from(target.classList).includes("more")) onPagerClick(e);
		}
		function onPagerClick(event) {
			const target = event.target;
			if (target.tagName.toLowerCase() === "ul" || props.disabled) return;
			let newPage = Number(target.textContent);
			const pageCount = props.pageCount;
			const currentPage = props.currentPage;
			const pagerCountOffset = props.pagerCount - 2;
			if (target.className.includes("more")) {
				if (target.className.includes("quickprev")) newPage = currentPage - pagerCountOffset;
				else if (target.className.includes("quicknext")) newPage = currentPage + pagerCountOffset;
			}
			if (!Number.isNaN(+newPage)) {
				if (newPage < 1) newPage = 1;
				if (newPage > pageCount) newPage = pageCount;
			}
			if (newPage !== currentPage) emit(CHANGE_EVENT, newPage);
		}
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("ul", {
				class: normalizeClass(unref(nsPager).b()),
				onClick: onPagerClick,
				onKeyup: withKeys(onEnter, ["enter"])
			}, [
				_ctx.pageCount > 0 ? (openBlock(), createElementBlock("li", {
					key: 0,
					class: normalizeClass([[unref(nsPager).is("active", _ctx.currentPage === 1), unref(nsPager).is("disabled", _ctx.disabled)], "number"]),
					"aria-current": _ctx.currentPage === 1,
					"aria-label": unref(t)("el.pagination.currentPage", { pager: 1 }),
					tabindex: tabindex.value
				}, " 1 ", 10, _hoisted_1$5)) : createCommentVNode("v-if", true),
				showPrevMore.value ? (openBlock(), createElementBlock("li", {
					key: 1,
					class: normalizeClass(prevMoreKls.value),
					tabindex: tabindex.value,
					"aria-label": unref(t)("el.pagination.prevPages", { pager: _ctx.pagerCount - 2 }),
					onMouseenter: _cache[0] || (_cache[0] = ($event) => onMouseEnter(true)),
					onMouseleave: _cache[1] || (_cache[1] = ($event) => quickPrevHover.value = false),
					onFocus: _cache[2] || (_cache[2] = ($event) => onFocus(true)),
					onBlur: _cache[3] || (_cache[3] = ($event) => quickPrevFocus.value = false)
				}, [(quickPrevHover.value || quickPrevFocus.value) && !_ctx.disabled ? (openBlock(), createBlock(unref(d_arrow_left_default), { key: 0 })) : (openBlock(), createBlock(unref(more_filled_default), { key: 1 }))], 42, _hoisted_2$4)) : createCommentVNode("v-if", true),
				(openBlock(true), createElementBlock(Fragment, null, renderList(pagers.value, (pager) => {
					return openBlock(), createElementBlock("li", {
						key: pager,
						class: normalizeClass([[unref(nsPager).is("active", _ctx.currentPage === pager), unref(nsPager).is("disabled", _ctx.disabled)], "number"]),
						"aria-current": _ctx.currentPage === pager,
						"aria-label": unref(t)("el.pagination.currentPage", { pager }),
						tabindex: tabindex.value
					}, toDisplayString(pager), 11, _hoisted_3$2);
				}), 128)),
				showNextMore.value ? (openBlock(), createElementBlock("li", {
					key: 2,
					class: normalizeClass(nextMoreKls.value),
					tabindex: tabindex.value,
					"aria-label": unref(t)("el.pagination.nextPages", { pager: _ctx.pagerCount - 2 }),
					onMouseenter: _cache[4] || (_cache[4] = ($event) => onMouseEnter()),
					onMouseleave: _cache[5] || (_cache[5] = ($event) => quickNextHover.value = false),
					onFocus: _cache[6] || (_cache[6] = ($event) => onFocus()),
					onBlur: _cache[7] || (_cache[7] = ($event) => quickNextFocus.value = false)
				}, [(quickNextHover.value || quickNextFocus.value) && !_ctx.disabled ? (openBlock(), createBlock(unref(d_arrow_right_default), { key: 0 })) : (openBlock(), createBlock(unref(more_filled_default), { key: 1 }))], 42, _hoisted_4$1)) : createCommentVNode("v-if", true),
				_ctx.pageCount > 1 ? (openBlock(), createElementBlock("li", {
					key: 3,
					class: normalizeClass([[unref(nsPager).is("active", _ctx.currentPage === _ctx.pageCount), unref(nsPager).is("disabled", _ctx.disabled)], "number"]),
					"aria-current": _ctx.currentPage === _ctx.pageCount,
					"aria-label": unref(t)("el.pagination.currentPage", { pager: _ctx.pageCount }),
					tabindex: tabindex.value
				}, toDisplayString(_ctx.pageCount), 11, _hoisted_5)) : createCommentVNode("v-if", true)
			], 34);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/pagination/src/pagination.mjs
/**
* It it user's responsibility to guarantee that the value of props.total... is number
* (same as pageSize, defaultPageSize, currentPage, defaultCurrentPage, pageCount)
* Otherwise we can reasonable infer that the corresponding field is absent
*/
var isAbsent = (v) => typeof v !== "number";
var paginationProps = buildProps({
	/**
	* @description options of item count per page
	*/
	pageSize: Number,
	/**
	* @description default initial value of page size, not setting is the same as setting 10
	*/
	defaultPageSize: Number,
	/**
	* @description total item count
	*/
	total: Number,
	/**
	* @description total page count. Set either `total` or `page-count` and pages will be displayed; if you need `page-sizes`, `total` is required
	*/
	pageCount: Number,
	/**
	* @description number of pagers. Pagination collapses when the total page count exceeds this value
	*/
	pagerCount: {
		type: Number,
		validator: (value) => {
			return isNumber(value) && Math.trunc(value) === value && value > 4 && value < 22 && value % 2 === 1;
		},
		default: 7
	},
	/**
	* @description current page number
	*/
	currentPage: Number,
	/**
	* @description default initial value of current-page, not setting is the same as setting 1
	*/
	defaultCurrentPage: Number,
	/**
	* @description layout of Pagination, elements separated with a comma
	*/
	layout: {
		type: String,
		default: [
			"prev",
			"pager",
			"next",
			"jumper",
			"->",
			"total"
		].join(", ")
	},
	/**
	* @description item count of each page
	*/
	pageSizes: {
		type: definePropType(Array),
		default: () => mutable([
			10,
			20,
			30,
			40,
			50,
			100
		])
	},
	/**
	* @description custom class name for the page size Select's dropdown
	*/
	popperClass: {
		type: String,
		default: ""
	},
	/**
	* @description custom style for the page size Select's dropdown
	*/
	popperStyle: { type: definePropType([String, Object]) },
	/**
	* @description text for the prev button
	*/
	prevText: {
		type: String,
		default: ""
	},
	/**
	* @description icon for the prev button, higher priority of `prev-text`
	*/
	prevIcon: {
		type: iconPropType,
		default: () => arrow_left_default
	},
	/**
	* @description text for the next button
	*/
	nextText: {
		type: String,
		default: ""
	},
	/**
	* @description icon for the next button, higher priority of `next-text`
	*/
	nextIcon: {
		type: iconPropType,
		default: () => arrow_right_default
	},
	/**
	* @description whether Pagination size is teleported to body
	*/
	teleported: {
		type: Boolean,
		default: true
	},
	/**
	* @description whether to use small pagination
	*/
	small: Boolean,
	/**
	* @description set page size
	*/
	size: useSizeProp,
	/**
	* @description whether the buttons have a background color
	*/
	background: Boolean,
	/**
	* @description whether Pagination is disabled
	*/
	disabled: Boolean,
	/**
	* @description whether to hide when there's only one page
	*/
	hideOnSinglePage: Boolean,
	/**
	* @description which element the size dropdown appends to.
	*/
	appendSizeTo: String
});
var paginationEmits = {
	"update:current-page": (val) => isNumber(val),
	"update:page-size": (val) => isNumber(val),
	"size-change": (val) => isNumber(val),
	change: (currentPage, pageSize) => isNumber(currentPage) && isNumber(pageSize),
	"current-change": (val) => isNumber(val),
	"prev-click": (val) => isNumber(val),
	"next-click": (val) => isNumber(val)
};
var componentName = "ElPagination";
//#endregion
//#region node_modules/element-plus/es/components/pagination/index.mjs
var ElPagination = withInstall(/* @__PURE__ */ defineComponent({
	name: componentName,
	props: paginationProps,
	emits: paginationEmits,
	setup(props, { emit, slots }) {
		const { t } = useLocale();
		const ns = useNamespace("pagination");
		const vnodeProps = getCurrentInstance().vnode.props || {};
		const _globalSize = useGlobalSize();
		const _size = computed(() => props.small ? "small" : props.size ?? _globalSize.value);
		useDeprecated({
			from: "small",
			replacement: "size",
			version: "3.0.0",
			scope: "el-pagination",
			ref: "https://element-plus.org/zh-CN/component/pagination.html"
		}, computed(() => !!props.small));
		const hasCurrentPageListener = "onUpdate:currentPage" in vnodeProps || "onUpdate:current-page" in vnodeProps || "onCurrentChange" in vnodeProps;
		const hasPageSizeListener = "onUpdate:pageSize" in vnodeProps || "onUpdate:page-size" in vnodeProps || "onSizeChange" in vnodeProps;
		const assertValidUsage = computed(() => {
			if (isAbsent(props.total) && isAbsent(props.pageCount)) return false;
			if (!isAbsent(props.currentPage) && !hasCurrentPageListener) return false;
			if (props.layout.includes("sizes")) {
				if (!isAbsent(props.pageCount)) {
					if (!hasPageSizeListener) return false;
				} else if (!isAbsent(props.total)) {
					if (!isAbsent(props.pageSize)) {
						if (!hasPageSizeListener) return false;
					}
				}
			}
			return true;
		});
		const innerPageSize = /* @__PURE__ */ ref(isAbsent(props.defaultPageSize) ? 10 : props.defaultPageSize);
		const innerCurrentPage = /* @__PURE__ */ ref(isAbsent(props.defaultCurrentPage) ? 1 : props.defaultCurrentPage);
		const pageSizeBridge = computed({
			get() {
				return isAbsent(props.pageSize) ? innerPageSize.value : props.pageSize;
			},
			set(v) {
				if (isAbsent(props.pageSize)) innerPageSize.value = v;
				if (hasPageSizeListener) {
					emit("update:page-size", v);
					emit("size-change", v);
				}
			}
		});
		const pageCountBridge = computed(() => {
			let pageCount = 0;
			if (!isAbsent(props.pageCount)) pageCount = props.pageCount;
			else if (!isAbsent(props.total)) pageCount = Math.max(1, Math.ceil(props.total / pageSizeBridge.value));
			return pageCount;
		});
		const currentPageBridge = computed({
			get() {
				return isAbsent(props.currentPage) ? innerCurrentPage.value : props.currentPage;
			},
			set(v) {
				let newCurrentPage = v;
				if (v < 1) newCurrentPage = 1;
				else if (v > pageCountBridge.value) newCurrentPage = pageCountBridge.value;
				if (isAbsent(props.currentPage)) innerCurrentPage.value = newCurrentPage;
				if (hasCurrentPageListener) {
					emit("update:current-page", newCurrentPage);
					emit("current-change", newCurrentPage);
				}
			}
		});
		watch(pageCountBridge, (val) => {
			if (currentPageBridge.value > val) currentPageBridge.value = val;
		});
		watch([currentPageBridge, pageSizeBridge], (value) => {
			emit(CHANGE_EVENT, ...value);
		}, { flush: "post" });
		function handleCurrentChange(val) {
			currentPageBridge.value = val;
		}
		function handleSizeChange(val) {
			pageSizeBridge.value = val;
			const newPageCount = pageCountBridge.value;
			if (currentPageBridge.value > newPageCount) currentPageBridge.value = newPageCount;
		}
		function prev() {
			if (props.disabled) return;
			currentPageBridge.value -= 1;
			emit("prev-click", currentPageBridge.value);
		}
		function next() {
			if (props.disabled) return;
			currentPageBridge.value += 1;
			emit("next-click", currentPageBridge.value);
		}
		function addClass(element, cls) {
			if (element) {
				if (!element.props) element.props = {};
				element.props.class = [element.props.class, cls].join(" ");
			}
		}
		provide(elPaginationKey, {
			pageCount: pageCountBridge,
			disabled: computed(() => props.disabled),
			currentPage: currentPageBridge,
			changeEvent: handleCurrentChange,
			handleSizeChange
		});
		return () => {
			if (!assertValidUsage.value) {
				debugWarn(componentName, t("el.pagination.deprecationWarning"));
				return null;
			}
			if (!props.layout) return null;
			if (props.hideOnSinglePage && pageCountBridge.value <= 1) return null;
			const rootChildren = [];
			const rightWrapperChildren = [];
			const rightWrapperRoot = h$1("div", { class: ns.e("rightwrapper") }, rightWrapperChildren);
			const TEMPLATE_MAP = {
				prev: h$1(prev_default, {
					disabled: props.disabled,
					currentPage: currentPageBridge.value,
					prevText: props.prevText,
					prevIcon: props.prevIcon,
					onClick: prev
				}),
				jumper: h$1(jumper_default, { size: _size.value }),
				pager: h$1(pager_default, {
					currentPage: currentPageBridge.value,
					pageCount: pageCountBridge.value,
					pagerCount: props.pagerCount,
					onChange: handleCurrentChange,
					disabled: props.disabled
				}),
				next: h$1(next_default, {
					disabled: props.disabled,
					currentPage: currentPageBridge.value,
					pageCount: pageCountBridge.value,
					nextText: props.nextText,
					nextIcon: props.nextIcon,
					onClick: next
				}),
				sizes: h$1(sizes_default, {
					pageSize: pageSizeBridge.value,
					pageSizes: props.pageSizes,
					popperClass: props.popperClass,
					popperStyle: props.popperStyle,
					disabled: props.disabled,
					teleported: props.teleported,
					size: _size.value,
					appendSizeTo: props.appendSizeTo
				}),
				slot: slots?.default?.() ?? null,
				total: h$1(total_default, { total: isAbsent(props.total) ? 0 : props.total })
			};
			const components = props.layout.split(",").map((item) => item.trim());
			let haveRightWrapper = false;
			components.forEach((c) => {
				if (c === "->") {
					haveRightWrapper = true;
					return;
				}
				if (!haveRightWrapper) rootChildren.push(TEMPLATE_MAP[c]);
				else rightWrapperChildren.push(TEMPLATE_MAP[c]);
			});
			addClass(rootChildren[0], ns.is("first"));
			addClass(rootChildren[rootChildren.length - 1], ns.is("last"));
			if (haveRightWrapper && rightWrapperChildren.length > 0) {
				addClass(rightWrapperChildren[0], ns.is("first"));
				addClass(rightWrapperChildren[rightWrapperChildren.length - 1], ns.is("last"));
				rootChildren.push(rightWrapperRoot);
			}
			return h$1("div", { class: [
				ns.b(),
				ns.is("background", props.background),
				ns.m(_size.value)
			] }, rootChildren);
		};
	}
}));
//#endregion
//#region node_modules/element-plus/es/utils/vue/validator.mjs
var isValidComponentSize = (val) => ["", ...componentSizes].includes(val);
//#endregion
//#region node_modules/element-plus/es/components/table/src/table/defaults.mjs
/**
* @deprecated Removed after 3.0.0, Use `TableProps` instead.
*/
var tableProps = {
	/**
	* @description table data
	*/
	data: {
		type: Array,
		default: () => []
	},
	/**
	* @description size of Table
	*/
	size: useSizeProp,
	width: [String, Number],
	/**
	* @description table's height. By default it has an `auto` height. If its value is a number, the height is measured in pixels; if its value is a string, the value will be assigned to element's style.height, the height is affected by external styles
	*/
	height: [String, Number],
	/**
	* @description table's max-height. The legal value is a number or the height in px
	*/
	maxHeight: [String, Number],
	/**
	* @description whether width of column automatically fits its container
	*/
	fit: {
		type: Boolean,
		default: true
	},
	/**
	* @description whether Table is striped
	*/
	stripe: Boolean,
	/**
	* @description whether Table has vertical border
	*/
	border: Boolean,
	/**
	* @description key of row data, used for optimizing rendering. Required if `reserve-selection` is on or display tree data. When its type is String, multi-level access is supported, e.g. `user.info.id`, but `user.info[0].id` is not supported, in which case `Function` should be used
	*/
	rowKey: [String, Function],
	/**
	* @description whether Table header is visible
	*/
	showHeader: {
		type: Boolean,
		default: true
	},
	/**
	* @description whether to display a summary row
	*/
	showSummary: Boolean,
	/**
	* @description displayed text for the first column of summary row
	*/
	sumText: String,
	/**
	* @description custom summary method
	*/
	summaryMethod: Function,
	/**
	* @description function that returns custom class names for a row, or a string assigning class names for every row
	*/
	rowClassName: [String, Function],
	/**
	* @description function that returns custom style for a row, or an object assigning custom style for every row
	*/
	rowStyle: [Object, Function],
	/**
	* @description function that returns custom class names for a cell, or a string assigning class names for every cell
	*/
	cellClassName: [String, Function],
	/**
	* @description function that returns custom style for a cell, or an object assigning custom style for every cell
	*/
	cellStyle: [Object, Function],
	/**
	* @description function that returns custom class names for a row in table header, or a string assigning class names for every row in table header
	*/
	headerRowClassName: [String, Function],
	/**
	* @description function that returns custom style for a row in table header, or an object assigning custom style for every row in table header
	*/
	headerRowStyle: [Object, Function],
	/**
	* @description function that returns custom class names for a cell in table header, or a string assigning class names for every cell in table header
	*/
	headerCellClassName: [String, Function],
	/**
	* @description function that returns custom style for a cell in table header, or an object assigning custom style for every cell in table header
	*/
	headerCellStyle: [Object, Function],
	/**
	* @description whether current row is highlighted
	*/
	highlightCurrentRow: Boolean,
	/**
	* @description key of current row, a set only prop
	*/
	currentRowKey: [String, Number],
	/**
	* @description displayed text when data is empty. You can customize this area with `#empty`
	*/
	emptyText: String,
	/**
	* @description set expanded rows by this prop, prop's value is the keys of expand rows, you should set row-key before using this prop
	*/
	expandRowKeys: Array,
	/**
	* @description whether expand all rows by default, works when the table has a column type="expand" or contains tree structure data
	*/
	defaultExpandAll: Boolean,
	/**
	* @description enable expandable rows, works when the table has a column type="expand"
	*/
	rowExpandable: { type: Function },
	/**
	* @description set the default sort column and order. property `prop` is used to set default sort column, property `order` is used to set default sort order
	*/
	defaultSort: Object,
	/**
	* @description the `effect` of the overflow tooltip
	*/
	tooltipEffect: String,
	/**
	* @description the options for the overflow tooltip, [see the following tooltip component](tooltip.html#attributes)
	*/
	tooltipOptions: Object,
	/**
	* @description method that returns rowspan and colspan
	*/
	spanMethod: Function,
	/**
	* @description controls the behavior of master checkbox in multi-select tables when only some rows are selected (but not all). If true, all rows will be selected, else deselected
	*/
	selectOnIndeterminate: {
		type: Boolean,
		default: true
	},
	/**
	* @description horizontal indentation of tree data
	*/
	indent: {
		type: Number,
		default: 16
	},
	/**
	* @description configuration for rendering nested data
	*/
	treeProps: {
		type: Object,
		default: () => {
			return {
				hasChildren: "hasChildren",
				children: "children",
				checkStrictly: false
			};
		}
	},
	/**
	* @description whether to lazy loading data
	*/
	lazy: Boolean,
	/**
	* @description method for loading child row data, only works when `lazy` is true
	*/
	load: Function,
	style: {
		type: [
			String,
			Object,
			Array,
			Boolean
		],
		default: () => ({})
	},
	className: {
		type: String,
		default: ""
	},
	/**
	* @description sets the algorithm used to lay out table cells, rows, and columns
	*/
	tableLayout: {
		type: String,
		default: "fixed"
	},
	/**
	* @description always show scrollbar
	*/
	scrollbarAlwaysOn: Boolean,
	/**
	* @description ensure main axis minimum-size doesn't follow the content
	*/
	flexible: Boolean,
	/**
	* @description whether to hide extra content and show them in a tooltip when hovering on the cell.It will affect all the table columns
	*/
	showOverflowTooltip: {
		type: [Boolean, Object],
		default: void 0
	},
	/**
	* @description function that formats cell tooltip content, works when `show-overflow-tooltip` is `true`
	*/
	tooltipFormatter: Function,
	appendFilterPanelTo: String,
	scrollbarTabindex: {
		type: [Number, String],
		default: void 0
	},
	/**
	* @description whether to allow drag the last column
	*/
	allowDragLastColumn: {
		type: Boolean,
		default: true
	},
	/**
	* @description whether to preserve expanded row content in DOM when collapsed
	*/
	preserveExpandedContent: Boolean,
	/**
	* @description whether to use native scrollbars
	*/
	nativeScrollbar: Boolean
};
//#endregion
//#region node_modules/element-plus/es/components/table/src/util.mjs
var tableIdSeed = 1;
var columnIdSeed = 1;
var createTableId = (namespace) => `${namespace}-table_${tableIdSeed++}`;
var createTableColumnId = (parentId) => `${parentId}_column_${columnIdSeed++}`;
var getCell = function(event) {
	return event.target?.closest("td");
};
var orderBy = function(array, sortKey, reverse, sortMethod, sortBy) {
	if (!sortKey && !sortMethod && (!sortBy || isArray$1(sortBy) && !sortBy.length)) return array;
	if (isString(reverse)) reverse = reverse === "descending" ? -1 : 1;
	else reverse = reverse && reverse < 0 ? -1 : 1;
	const getKey = sortMethod ? null : function(value, index) {
		if (sortBy) return flatMap(castArray$1(sortBy), (by) => {
			if (isString(by)) return get(value, by);
			else return by(value, index, array);
		});
		if (sortKey !== "$key") {
			if (isObject$2(value) && "$value" in value) value = value.$value;
		}
		return [isObject$2(value) ? sortKey ? get(value, sortKey) : null : value];
	};
	const compare = function(a, b) {
		if (sortMethod) return sortMethod(a.value, b.value);
		for (let i = 0, len = a.key?.length ?? 0; i < len; i++) {
			if (a.key?.[i] < b.key?.[i]) return -1;
			if (a.key?.[i] > b.key?.[i]) return 1;
		}
		return 0;
	};
	return array.map((value, index) => {
		return {
			value,
			index,
			key: getKey ? getKey(value, index) : null
		};
	}).sort((a, b) => {
		let order = compare(a, b);
		if (!order) order = a.index - b.index;
		return order * +reverse;
	}).map((item) => item.value);
};
var getColumnById = function(table, columnId) {
	let column = null;
	table.columns.forEach((item) => {
		if (item.id === columnId) column = item;
	});
	return column;
};
var getColumnByKey = function(table, columnKey) {
	let column = null;
	for (let i = 0; i < table.columns.length; i++) {
		const item = table.columns[i];
		if (item.columnKey === columnKey) {
			column = item;
			break;
		}
	}
	if (!column) throwError("ElTable", `No column matching with column-key: ${columnKey}`);
	return column;
};
var getColumnByCell = function(table, cell, namespace) {
	const matches = (cell.className || "").match(new RegExp(`${namespace}-table_[^\\s]+`, "gm"));
	if (matches) return getColumnById(table, matches[0]);
	return null;
};
var getRowIdentity = (row, rowKey) => {
	if (!row) throw new Error("Row is required when get row identity");
	if (isString(rowKey)) {
		if (!rowKey.includes(".")) return `${row[rowKey]}`;
		const key = rowKey.split(".");
		let current = row;
		for (const element of key) current = current[element];
		return `${current}`;
	} else if (isFunction$1(rowKey)) return rowKey.call(null, row);
	return "";
};
var getKeysMap = function(array, rowKey, flatten = false, childrenKey = "children") {
	const data = array || [];
	const arrayMap = {};
	data.forEach((row, index) => {
		arrayMap[getRowIdentity(row, rowKey)] = {
			row,
			index
		};
		if (flatten) {
			const children = row[childrenKey];
			if (isArray$1(children)) Object.assign(arrayMap, getKeysMap(children, rowKey, true, childrenKey));
		}
	});
	return arrayMap;
};
function mergeOptions(defaults, config) {
	const options = {};
	let key;
	for (key in defaults) options[key] = defaults[key];
	for (key in config) if (hasOwn(config, key)) {
		const value = config[key];
		if (!isUndefined(value)) options[key] = value;
	}
	return options;
}
function parseWidth(width) {
	if (width === "") return width;
	if (!isUndefined(width)) {
		width = Number.parseInt(width, 10);
		if (Number.isNaN(width)) width = "";
	}
	return width;
}
function parseMinWidth(minWidth) {
	if (minWidth === "") return minWidth;
	if (!isUndefined(minWidth)) {
		minWidth = parseWidth(minWidth);
		if (Number.isNaN(minWidth)) minWidth = 80;
	}
	return minWidth;
}
function parseHeight(height) {
	if (isNumber(height)) return height;
	if (isString(height)) if (/^\d+(?:px)?$/.test(height)) return Number.parseInt(height, 10);
	else return height;
	return null;
}
function compose(...funcs) {
	if (funcs.length === 0) return (arg) => arg;
	if (funcs.length === 1) return funcs[0];
	return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
function toggleRowStatus(statusArr, row, newVal, tableTreeProps, selectable, rowIndex, rowKey) {
	let _rowIndex = rowIndex ?? 0;
	let changed = false;
	const getIndex = () => {
		if (!rowKey) return statusArr.indexOf(row);
		const id = getRowIdentity(row, rowKey);
		return statusArr.findIndex((item) => getRowIdentity(item, rowKey) === id);
	};
	const index = getIndex();
	const included = index !== -1;
	const isRowSelectable = selectable?.call(null, row, _rowIndex);
	const toggleStatus = (type) => {
		if (type === "add") statusArr.push(row);
		else statusArr.splice(index, 1);
		changed = true;
	};
	const getChildrenCount = (row) => {
		let count = 0;
		const children = tableTreeProps?.children && row[tableTreeProps.children];
		if (children && isArray$1(children)) {
			count += children.length;
			children.forEach((item) => {
				count += getChildrenCount(item);
			});
		}
		return count;
	};
	if (!selectable || isRowSelectable) if (isBoolean(newVal)) {
		if (newVal && !included) toggleStatus("add");
		else if (!newVal && included) toggleStatus("remove");
	} else included ? toggleStatus("remove") : toggleStatus("add");
	if (!tableTreeProps?.checkStrictly && tableTreeProps?.children && isArray$1(row[tableTreeProps.children])) row[tableTreeProps.children].forEach((item) => {
		const childChanged = toggleRowStatus(statusArr, item, newVal ?? !included, tableTreeProps, selectable, _rowIndex + 1, rowKey);
		_rowIndex += getChildrenCount(item) + 1;
		if (childChanged) changed = childChanged;
	});
	return changed;
}
function walkTreeNode(root, cb, childrenKey = "children", lazyKey = "hasChildren", lazy = false) {
	const isNil = (array) => !(isArray$1(array) && array.length);
	function _walker(parent, children, level) {
		cb(parent, children, level);
		children.forEach((item) => {
			if (item[lazyKey] && lazy) {
				cb(item, null, level + 1);
				return;
			}
			const children = item[childrenKey];
			if (!isNil(children)) _walker(item, children, level + 1);
		});
	}
	root.forEach((item) => {
		if (item[lazyKey] && lazy) {
			cb(item, null, 0);
			return;
		}
		const children = item[childrenKey];
		if (!isNil(children)) _walker(item, children, 0);
	});
}
var getTableOverflowTooltipProps = (props, innerText, row, column) => {
	const tooltipFormatterContent = isFunction$1(column?.tooltipFormatter) ? column.tooltipFormatter({
		row,
		column,
		cellValue: getProp(row, column.property).value
	}) : void 0;
	if (isVNode(tooltipFormatterContent)) return {
		slotContent: tooltipFormatterContent,
		content: null,
		strategy: "fixed",
		...props
	};
	return {
		slotContent: null,
		content: tooltipFormatterContent ?? innerText,
		strategy: "fixed",
		...props
	};
};
var removePopper = null;
function createTablePopper(props, popperContent, row, column, trigger, table) {
	const tableOverflowTooltipProps = getTableOverflowTooltipProps(props, popperContent, row, column);
	const mergedProps = {
		...tableOverflowTooltipProps,
		slotContent: void 0
	};
	if (removePopper?.trigger === trigger) {
		const comp = removePopper.vm?.component;
		merge(comp?.props, mergedProps);
		if (comp && tableOverflowTooltipProps.slotContent) comp.slots.content = () => [tableOverflowTooltipProps.slotContent];
		return;
	}
	removePopper?.();
	const parentNode = table?.refs.tableWrapper;
	const ns = parentNode?.dataset.prefix;
	const vm = createVNode(ElTooltip, {
		virtualTriggering: true,
		virtualRef: trigger,
		appendTo: parentNode,
		placement: "top",
		transition: "none",
		offset: 0,
		hideAfter: 0,
		...mergedProps
	}, tableOverflowTooltipProps.slotContent ? { content: () => tableOverflowTooltipProps.slotContent } : void 0);
	vm.appContext = {
		...table.appContext,
		...table
	};
	const container = document.createElement("div");
	render(vm, container);
	vm.component.exposed.onOpen();
	const scrollContainer = parentNode?.querySelector(`.${ns}-scrollbar__wrap`);
	removePopper = () => {
		if (vm.component?.exposed?.onClose) vm.component.exposed.onClose();
		render(null, container);
		const currentRemovePopper = removePopper;
		scrollContainer?.removeEventListener("scroll", currentRemovePopper);
		currentRemovePopper.trigger = void 0;
		currentRemovePopper.vm = void 0;
		removePopper = null;
	};
	removePopper.trigger = trigger ?? void 0;
	removePopper.vm = vm;
	scrollContainer?.addEventListener("scroll", removePopper);
}
function getCurrentColumns(column) {
	if (column.children) return flatMap(column.children, getCurrentColumns);
	else return [column];
}
function getColSpan(colSpan, column) {
	return colSpan + column.colSpan;
}
var isFixedColumn = (index, fixed, store, realColumns) => {
	let start = 0;
	let after = index;
	const columns = store.states.columns.value;
	if (realColumns) {
		const curColumns = getCurrentColumns(realColumns[index]);
		start = columns.slice(0, columns.indexOf(curColumns[0])).reduce(getColSpan, 0);
		after = start + curColumns.reduce(getColSpan, 0) - 1;
	} else start = index;
	let fixedLayout;
	switch (fixed) {
		case "left":
			if (after < store.states.fixedLeafColumnsLength.value) fixedLayout = "left";
			break;
		case "right":
			if (start >= columns.length - store.states.rightFixedLeafColumnsLength.value) fixedLayout = "right";
			break;
		default: if (after < store.states.fixedLeafColumnsLength.value) fixedLayout = "left";
		else if (start >= columns.length - store.states.rightFixedLeafColumnsLength.value) fixedLayout = "right";
	}
	return fixedLayout ? {
		direction: fixedLayout,
		start,
		after
	} : {};
};
var getFixedColumnsClass = (namespace, index, fixed, store, realColumns, offset = 0) => {
	const classes = [];
	const { direction, start, after } = isFixedColumn(index, fixed, store, realColumns);
	if (direction) {
		const isLeft = direction === "left";
		classes.push(`${namespace}-fixed-column--${direction}`);
		if (isLeft && after + offset === store.states.fixedLeafColumnsLength.value - 1) classes.push("is-last-column");
		else if (!isLeft && start - offset === store.states.columns.value.length - store.states.rightFixedLeafColumnsLength.value) classes.push("is-first-column");
	}
	return classes;
};
function getOffset(offset, column) {
	return offset + (isNull(column.realWidth) || Number.isNaN(column.realWidth) ? Number(column.width) : column.realWidth);
}
var getFixedColumnOffset = (index, fixed, store, realColumns) => {
	const { direction, start = 0, after = 0 } = isFixedColumn(index, fixed, store, realColumns);
	if (!direction) return;
	const styles = {};
	const isLeft = direction === "left";
	const columns = store.states.columns.value;
	if (isLeft) styles.left = columns.slice(0, start).reduce(getOffset, 0);
	else styles.right = columns.slice(after + 1).reverse().reduce(getOffset, 0);
	return styles;
};
var ensurePosition = (style, key) => {
	if (!style) return;
	if (!Number.isNaN(style[key])) style[key] = `${style[key]}px`;
};
function ensureValidVNode(vnodes) {
	return vnodes.some((child) => {
		if (!isVNode(child)) return true;
		if (child.type === Comment) return false;
		if (child.type === Fragment && !ensureValidVNode(child.children)) return false;
		return true;
	}) ? vnodes : null;
}
//#endregion
//#region node_modules/element-plus/es/components/table/src/store/expand.mjs
function useExpand(watcherData) {
	const instance = getCurrentInstance();
	const defaultExpandAll = /* @__PURE__ */ ref(false);
	const expandRows = /* @__PURE__ */ ref([]);
	const canRowExpand = (row, index) => {
		const expandableFn = instance.store.states.rowExpandable.value;
		return expandableFn?.(row, index) ?? true;
	};
	const updateExpandRows = () => {
		const data = watcherData.data.value || [];
		const rowKey = watcherData.rowKey.value;
		if (defaultExpandAll.value) expandRows.value = instance.store.states.rowExpandable.value ? data.filter(canRowExpand) : data.slice();
		else if (rowKey) {
			const expandRowsMap = getKeysMap(expandRows.value, rowKey);
			expandRows.value = data.filter((row, index) => {
				return !!expandRowsMap[getRowIdentity(row, rowKey)] && canRowExpand(row, index);
			});
		} else expandRows.value = [];
	};
	const toggleRowExpansion = (row, expanded) => {
		const rowIndex = (watcherData.data.value || []).indexOf(row);
		if (rowIndex > -1 && !canRowExpand(row, rowIndex)) return;
		if (toggleRowStatus(expandRows.value, row, expanded, void 0, void 0, void 0, watcherData.rowKey.value)) instance.emit("expand-change", row, expandRows.value.slice());
	};
	const setExpandRowKeys = (rowKeys) => {
		instance.store.assertRowKey();
		const data = watcherData.data.value || [];
		const rowKey = watcherData.rowKey.value;
		const keysMap = getKeysMap(data, rowKey);
		expandRows.value = rowKeys.reduce((prev, cur) => {
			const info = keysMap[cur];
			if (info && canRowExpand(info.row, info.index)) prev.push(info.row);
			return prev;
		}, []);
	};
	const isRowExpanded = (row) => {
		const rowKey = watcherData.rowKey.value;
		if (rowKey) return !!getKeysMap(expandRows.value, rowKey)[getRowIdentity(row, rowKey)];
		return expandRows.value.includes(row);
	};
	return {
		updateExpandRows,
		toggleRowExpansion,
		setExpandRowKeys,
		isRowExpanded,
		states: {
			expandRows,
			defaultExpandAll
		}
	};
}
//#endregion
//#region node_modules/element-plus/es/components/table/src/store/current.mjs
function useCurrent(watcherData) {
	const instance = getCurrentInstance();
	const _currentRowKey = /* @__PURE__ */ ref(null);
	const currentRow = /* @__PURE__ */ ref(null);
	const setCurrentRowKey = (key) => {
		instance.store.assertRowKey();
		_currentRowKey.value = key;
		setCurrentRowByKey(key);
	};
	const restoreCurrentRowKey = () => {
		_currentRowKey.value = null;
	};
	const setCurrentRowByKey = (key) => {
		const { data, rowKey } = watcherData;
		const oldCurrentRow = currentRow.value;
		let _currentRow = null;
		if (rowKey.value) _currentRow = (unref(data) || []).find((item) => getRowIdentity(item, rowKey.value) === key) ?? null;
		currentRow.value = _currentRow ?? null;
		instance.emit("current-change", currentRow.value, oldCurrentRow);
	};
	const updateCurrentRow = (_currentRow) => {
		const oldCurrentRow = currentRow.value;
		if (_currentRow && _currentRow !== oldCurrentRow) {
			currentRow.value = _currentRow;
			instance.emit("current-change", currentRow.value, oldCurrentRow);
			return;
		}
		if (!_currentRow && oldCurrentRow) {
			currentRow.value = null;
			instance.emit("current-change", null, oldCurrentRow);
		}
	};
	const updateCurrentRowData = () => {
		const rowKey = watcherData.rowKey.value;
		const data = watcherData.data.value || [];
		const oldCurrentRow = currentRow.value;
		if (oldCurrentRow && !data.includes(oldCurrentRow)) if (rowKey) setCurrentRowByKey(getRowIdentity(oldCurrentRow, rowKey));
		else {
			currentRow.value = null;
			instance.emit("current-change", null, oldCurrentRow);
		}
		else if (_currentRowKey.value) {
			setCurrentRowByKey(_currentRowKey.value);
			restoreCurrentRowKey();
		}
	};
	return {
		setCurrentRowKey,
		restoreCurrentRowKey,
		setCurrentRowByKey,
		updateCurrentRow,
		updateCurrentRowData,
		states: {
			_currentRowKey,
			currentRow
		}
	};
}
//#endregion
//#region node_modules/element-plus/es/components/table/src/store/tree.mjs
function useTree(watcherData) {
	const expandRowKeys = /* @__PURE__ */ ref([]);
	const treeData = /* @__PURE__ */ ref({});
	const indent = /* @__PURE__ */ ref(16);
	const lazy = /* @__PURE__ */ ref(false);
	const lazyTreeNodeMap = /* @__PURE__ */ ref({});
	const lazyColumnIdentifier = /* @__PURE__ */ ref("hasChildren");
	const childrenColumnName = /* @__PURE__ */ ref("children");
	const checkStrictly = /* @__PURE__ */ ref(false);
	const instance = getCurrentInstance();
	const normalizedData = computed(() => {
		if (!watcherData.rowKey.value) return {};
		return normalize(watcherData.data.value || []);
	});
	const normalizedLazyNode = computed(() => {
		const rowKey = watcherData.rowKey.value;
		const keys = Object.keys(lazyTreeNodeMap.value);
		const res = {};
		if (!keys.length) return res;
		keys.forEach((key) => {
			if (lazyTreeNodeMap.value[key].length) {
				const item = { children: [] };
				lazyTreeNodeMap.value[key].forEach((row) => {
					const currentRowKey = getRowIdentity(row, rowKey);
					item.children.push(currentRowKey);
					if (row[lazyColumnIdentifier.value] && !res[currentRowKey]) res[currentRowKey] = { children: [] };
				});
				res[key] = item;
			}
		});
		return res;
	});
	const normalize = (data) => {
		const rowKey = watcherData.rowKey.value;
		const res = {};
		walkTreeNode(data, (parent, children, level) => {
			const parentId = getRowIdentity(parent, rowKey);
			if (isArray$1(children)) res[parentId] = {
				children: children.map((row) => getRowIdentity(row, rowKey)),
				level
			};
			else if (lazy.value) res[parentId] = {
				children: [],
				lazy: true,
				level
			};
		}, childrenColumnName.value, lazyColumnIdentifier.value, lazy.value);
		return res;
	};
	const updateTreeData = (ifChangeExpandRowKeys = false, ifExpandAll) => {
		ifExpandAll ||= instance.store?.states.defaultExpandAll.value;
		const nested = normalizedData.value;
		const normalizedLazyNode_ = normalizedLazyNode.value;
		const keys = Object.keys(nested);
		const newTreeData = {};
		if (keys.length) {
			const oldTreeData = unref(treeData);
			const rootLazyRowKeys = [];
			const getExpanded = (oldValue, key) => {
				if (ifChangeExpandRowKeys) if (expandRowKeys.value) return ifExpandAll || expandRowKeys.value.includes(key);
				else return !!(ifExpandAll || oldValue?.expanded);
				else {
					const included = ifExpandAll || expandRowKeys.value && expandRowKeys.value.includes(key);
					return !!(oldValue?.expanded || included);
				}
			};
			keys.forEach((key) => {
				const oldValue = oldTreeData[key];
				const newValue = { ...nested[key] };
				newValue.expanded = getExpanded(oldValue, key);
				if (newValue.lazy) {
					const { loaded = false, loading = false } = oldValue || {};
					newValue.loaded = !!loaded;
					newValue.loading = !!loading;
					rootLazyRowKeys.push(key);
				}
				newTreeData[key] = newValue;
			});
			const lazyKeys = Object.keys(normalizedLazyNode_);
			if (lazy.value && lazyKeys.length && rootLazyRowKeys.length) lazyKeys.forEach((key) => {
				const oldValue = oldTreeData[key];
				const lazyNodeChildren = normalizedLazyNode_[key].children;
				if (rootLazyRowKeys.includes(key)) {
					if (newTreeData[key].children?.length !== 0) throw new Error("[ElTable]children must be an empty array.");
					newTreeData[key].children = lazyNodeChildren;
				} else {
					const { loaded = false, loading = false } = oldValue || {};
					newTreeData[key] = {
						lazy: true,
						loaded: !!loaded,
						loading: !!loading,
						expanded: getExpanded(oldValue, key),
						children: lazyNodeChildren,
						level: void 0
					};
				}
			});
		}
		treeData.value = newTreeData;
		instance.store?.updateTableScrollY();
	};
	watch(() => expandRowKeys.value, () => {
		updateTreeData(true);
	}, { deep: true });
	watch(() => normalizedData.value, () => {
		updateTreeData();
	});
	watch(() => normalizedLazyNode.value, () => {
		updateTreeData();
	});
	const updateTreeExpandKeys = (value) => {
		expandRowKeys.value = value;
		updateTreeData();
	};
	const isUseLazy = (data) => {
		return lazy.value && data && "loaded" in data && !data.loaded;
	};
	const toggleTreeExpansion = (row, expanded) => {
		instance.store.assertRowKey();
		const rowKey = watcherData.rowKey.value;
		const id = getRowIdentity(row, rowKey);
		const data = id && treeData.value[id];
		if (id && data && "expanded" in data) {
			const oldExpanded = data.expanded;
			expanded = isUndefined(expanded) ? !data.expanded : expanded;
			treeData.value[id].expanded = expanded;
			if (oldExpanded !== expanded) instance.emit("expand-change", row, expanded);
			expanded && isUseLazy(data) && loadData(row, id, data);
			instance.store.updateTableScrollY();
		}
	};
	const loadOrToggle = (row) => {
		instance.store.assertRowKey();
		const rowKey = watcherData.rowKey.value;
		const id = getRowIdentity(row, rowKey);
		const data = treeData.value[id];
		if (isUseLazy(data)) loadData(row, id, data);
		else toggleTreeExpansion(row, void 0);
	};
	const loadData = (row, key, treeNode) => {
		const { load } = instance.props;
		if (load && !treeData.value[key].loaded) {
			treeData.value[key].loading = true;
			load(row, treeNode, (data) => {
				if (!isArray$1(data)) throw new TypeError("[ElTable] data must be an array");
				treeData.value[key].loading = false;
				treeData.value[key].loaded = true;
				treeData.value[key].expanded = true;
				if (data.length) lazyTreeNodeMap.value = {
					...lazyTreeNodeMap.value,
					[key]: data
				};
				instance.emit("expand-change", row, true);
			});
		}
	};
	const updateKeyChildren = (key, data) => {
		const { lazy, rowKey } = instance.props;
		if (!lazy) return;
		if (!rowKey) throw new Error("[Table] rowKey is required in updateKeyChild");
		if (lazyTreeNodeMap.value[key]) lazyTreeNodeMap.value = {
			...lazyTreeNodeMap.value,
			[key]: data
		};
	};
	return {
		loadData,
		loadOrToggle,
		toggleTreeExpansion,
		updateTreeExpandKeys,
		updateTreeData,
		updateKeyChildren,
		normalize,
		states: {
			expandRowKeys,
			treeData,
			indent,
			lazy,
			lazyTreeNodeMap,
			lazyColumnIdentifier,
			childrenColumnName,
			checkStrictly
		}
	};
}
//#endregion
//#region node_modules/element-plus/es/components/table/src/store/watcher.mjs
var sortData = (data, states) => {
	const sortingColumn = states.sortingColumn;
	if (!sortingColumn || isString(sortingColumn.sortable)) return data;
	return orderBy(data, states.sortProp, states.sortOrder, sortingColumn.sortMethod, sortingColumn.sortBy);
};
var doFlattenColumns = (columns) => {
	const result = [];
	columns.forEach((column) => {
		if (column.children && column.children.length > 0) result.push.apply(result, doFlattenColumns(column.children));
		else result.push(column);
	});
	return result;
};
function useWatcher$1() {
	const instance = getCurrentInstance();
	const { size: tableSize } = /* @__PURE__ */ toRefs(instance.proxy?.$props);
	const rowKey = /* @__PURE__ */ ref(null);
	const data = /* @__PURE__ */ ref([]);
	const _data = /* @__PURE__ */ ref([]);
	const isComplex = /* @__PURE__ */ ref(false);
	const _columns = /* @__PURE__ */ ref([]);
	const originColumns = /* @__PURE__ */ ref([]);
	const columns = /* @__PURE__ */ ref([]);
	const fixedColumns = /* @__PURE__ */ ref([]);
	const rightFixedColumns = /* @__PURE__ */ ref([]);
	const leafColumns = /* @__PURE__ */ ref([]);
	const fixedLeafColumns = /* @__PURE__ */ ref([]);
	const rightFixedLeafColumns = /* @__PURE__ */ ref([]);
	const updateOrderFns = [];
	const leafColumnsLength = /* @__PURE__ */ ref(0);
	const fixedLeafColumnsLength = /* @__PURE__ */ ref(0);
	const rightFixedLeafColumnsLength = /* @__PURE__ */ ref(0);
	const isAllSelected = /* @__PURE__ */ ref(false);
	const selection = /* @__PURE__ */ ref([]);
	const selectionIndeterminate = /* @__PURE__ */ ref({});
	const reserveSelection = /* @__PURE__ */ ref(false);
	const selectOnIndeterminate = /* @__PURE__ */ ref(false);
	const selectable = /* @__PURE__ */ ref(null);
	const rowExpandable = /* @__PURE__ */ ref(null);
	const filters = /* @__PURE__ */ ref({});
	const filteredData = /* @__PURE__ */ ref(null);
	const sortingColumn = /* @__PURE__ */ ref(null);
	const sortProp = /* @__PURE__ */ ref(null);
	const sortOrder = /* @__PURE__ */ ref(null);
	const hoverRow = /* @__PURE__ */ ref(null);
	let halfSelection = [];
	const selectedMap = computed(() => {
		return rowKey.value ? getKeysMap(selection.value, rowKey.value) : void 0;
	});
	const getRowChildren = (row) => {
		const { childrenColumnName, lazyTreeNodeMap } = instance.store.states;
		const inlineChildren = row[childrenColumnName.value] ?? [];
		if (!rowKey.value) return inlineChildren;
		const id = getRowIdentity(row, rowKey.value);
		return [...lazyTreeNodeMap.value?.[id] ?? [], ...inlineChildren];
	};
	watch(data, () => {
		if (instance.state) {
			scheduleLayout(false);
			if (instance.props.tableLayout === "auto") instance.refs.tableHeaderRef?.updateFixedColumnStyle();
		}
	}, { deep: true });
	const assertRowKey = () => {
		if (!rowKey.value) throw new Error("[ElTable] prop row-key is required");
	};
	const updateChildFixed = (column) => {
		column.children?.forEach((childColumn) => {
			childColumn.fixed = column.fixed;
			updateChildFixed(childColumn);
		});
	};
	const updateColumns = () => {
		_columns.value.forEach((column) => {
			updateChildFixed(column);
		});
		fixedColumns.value = _columns.value.filter((column) => [true, "left"].includes(column.fixed));
		const selectColumn = _columns.value.find((column) => column.type === "selection");
		let selectColFixLeft;
		if (selectColumn && selectColumn.fixed !== "right" && !fixedColumns.value.includes(selectColumn)) {
			if (_columns.value.indexOf(selectColumn) === 0 && fixedColumns.value.length) {
				fixedColumns.value.unshift(selectColumn);
				selectColFixLeft = true;
			}
		}
		rightFixedColumns.value = _columns.value.filter((column) => column.fixed === "right");
		const notFixedColumns = _columns.value.filter((column) => (selectColFixLeft ? column.type !== "selection" : true) && !column.fixed);
		originColumns.value = Array.from(fixedColumns.value).concat(notFixedColumns).concat(rightFixedColumns.value);
		const leafColumns = doFlattenColumns(notFixedColumns);
		const fixedLeafColumns = doFlattenColumns(fixedColumns.value);
		const rightFixedLeafColumns = doFlattenColumns(rightFixedColumns.value);
		leafColumnsLength.value = leafColumns.length;
		fixedLeafColumnsLength.value = fixedLeafColumns.length;
		rightFixedLeafColumnsLength.value = rightFixedLeafColumns.length;
		columns.value = Array.from(fixedLeafColumns).concat(leafColumns).concat(rightFixedLeafColumns);
		isComplex.value = fixedColumns.value.length > 0 || rightFixedColumns.value.length > 0;
	};
	const scheduleLayout = (needUpdateColumns, immediate = false) => {
		if (needUpdateColumns) updateColumns();
		if (immediate) instance.state.doLayout();
		else instance.state.debouncedUpdateLayout();
	};
	const isSelected = (row) => {
		if (selectedMap.value) return !!selectedMap.value[getRowIdentity(row, rowKey.value)];
		else return selection.value.includes(row);
	};
	const rowIndexMap = computed(() => {
		const map = /* @__PURE__ */ new Map();
		if (!rowKey.value || !selectable.value) return map;
		let index = 0;
		const _traverse = (rows) => {
			if (!isArray$1(rows)) return;
			rows.forEach((row) => {
				const id = getRowIdentity(row, rowKey.value);
				map.set(id, index);
				index += 1;
				const children = getRowChildren(row);
				if (children.length) _traverse(children);
			});
		};
		_traverse(data.value || []);
		return map;
	});
	const updateSelectionByChildren = (options = {}) => {
		const { emitChange = true } = options;
		if (treeStates.checkStrictly.value || !rowKey.value) {
			selectionIndeterminate.value = {};
			halfSelection = [];
			return;
		}
		const rowKeyValue = rowKey.value;
		const rowIndexMapValue = options.rowIndexMap ?? rowIndexMap.value;
		const selectableFn = selectable.value;
		const rowIdCache = /* @__PURE__ */ new WeakMap();
		const getCachedRowId = (row) => {
			const cachedId = rowIdCache.get(row);
			if (cachedId) return cachedId;
			const id = getRowIdentity(row, rowKeyValue);
			rowIdCache.set(row, id);
			return id;
		};
		const indeterminateMap = {};
		const nextHalfSelection = [];
		const selectedIdSet = new Set(selection.value.map((row) => getCachedRowId(row)));
		const rowsToAdd = [];
		let selectionChanged = false;
		const _updateSelectionForRow = (row, id, selected) => {
			const isRowSelected = selectedIdSet.has(id);
			if (selected && !isRowSelected) {
				rowsToAdd.push(row);
				selectedIdSet.add(id);
				selectionChanged = true;
			} else if (!selected && isRowSelected) {
				selectedIdSet.delete(id);
				selectionChanged = true;
			}
		};
		const _walk = (rows) => {
			let selectedCount = 0;
			let selectableCount = 0;
			if (!isArray$1(rows)) return {
				selectedCount,
				selectableCount
			};
			rows.forEach((row) => {
				const id = getCachedRowId(row);
				const children = getRowChildren(row);
				let childSelectedCount = 0;
				let childSelectableCount = 0;
				if (children.length) {
					const childResult = _walk(children);
					childSelectedCount = childResult.selectedCount;
					childSelectableCount = childResult.selectableCount;
				}
				const rowSelectable = selectableFn ? selectableFn.call(null, row, rowIndexMapValue.get(id) ?? 0) : true;
				if (rowSelectable) {
					if (childSelectableCount > 0) {
						const allSelected = childSelectedCount === childSelectableCount;
						if (!allSelected && !(childSelectedCount === 0)) {
							indeterminateMap[id] = true;
							nextHalfSelection.push(row);
						}
						_updateSelectionForRow(row, id, allSelected);
					}
				}
				if (rowSelectable) {
					selectableCount += 1;
					if (selectedIdSet.has(id)) selectedCount += 1;
				}
				selectedCount += childSelectedCount;
				selectableCount += childSelectableCount;
			});
			return {
				selectedCount,
				selectableCount
			};
		};
		_walk(data.value || []);
		if (selectionChanged) {
			const nextSelection = selection.value.filter((row) => selectedIdSet.has(getCachedRowId(row)));
			rowsToAdd.forEach((row) => {
				if (!selectedIdSet.has(getCachedRowId(row))) return;
				nextSelection.push(row);
			});
			selection.value = nextSelection;
		}
		selectionIndeterminate.value = indeterminateMap;
		halfSelection = nextHalfSelection;
		if (selectionChanged && emitChange) instance.emit("selection-change", selection.value ? selection.value.slice() : []);
	};
	const clearSelection = () => {
		isAllSelected.value = false;
		const oldSelection = selection.value;
		selection.value = [];
		selectionIndeterminate.value = {};
		halfSelection = [];
		if (oldSelection.length) instance.emit("selection-change", []);
	};
	const cleanSelection = () => {
		let deleted;
		if (rowKey.value) {
			deleted = [];
			const childrenKey = instance?.store?.states?.childrenColumnName.value;
			const dataMap = getKeysMap(data.value, rowKey.value, true, childrenKey);
			const { lazyTreeNodeMap } = instance.store.states;
			if (lazyTreeNodeMap.value) Object.entries(lazyTreeNodeMap.value).forEach(([parentId, lazyRows]) => {
				if (dataMap[parentId]) lazyRows.forEach((row) => {
					const id = getRowIdentity(row, rowKey.value);
					if (!dataMap[id]) dataMap[id] = {
						row,
						index: -1
					};
				});
			});
			for (const key in selectedMap.value) if (hasOwn(selectedMap.value, key) && !dataMap[key]) deleted.push(selectedMap.value[key].row);
		} else deleted = selection.value.filter((item) => !data.value.includes(item));
		if (deleted.length) {
			const newSelection = selection.value.filter((item) => !deleted.includes(item));
			selection.value = newSelection;
			updateSelectionByChildren({ emitChange: false });
			instance.emit("selection-change", [...newSelection]);
		}
	};
	const getSelectionRows = () => {
		return (selection.value || []).slice();
	};
	const getHalfSelectionRows = () => {
		return halfSelection.slice();
	};
	const cascadeToLazyChildren = (row, selected, rowIndexMap) => {
		if (!rowKey.value || treeStates.checkStrictly.value || !treeStates.lazy.value) return;
		const { lazyTreeNodeMap, childrenColumnName } = instance.store.states;
		const id = getRowIdentity(row, rowKey.value);
		const lazyChildren = lazyTreeNodeMap.value?.[id] ?? [];
		const inlineChildren = row[childrenColumnName.value] ?? [];
		const treeProps = {
			children: childrenColumnName.value,
			checkStrictly: false
		};
		for (const child of lazyChildren) {
			const childIndex = rowIndexMap.get(getRowIdentity(child, rowKey.value)) ?? 0;
			toggleRowStatus(selection.value, child, selected, treeProps, selectable.value, childIndex, rowKey.value);
			cascadeToLazyChildren(child, selected, rowIndexMap);
		}
		for (const child of inlineChildren) cascadeToLazyChildren(child, selected, rowIndexMap);
	};
	const toggleRowSelection = (row, selected, emitChange = true, ignoreSelectable = false) => {
		const treeProps = {
			children: instance?.store?.states?.childrenColumnName.value,
			checkStrictly: instance?.store?.states?.checkStrictly.value
		};
		if (toggleRowStatus(selection.value, row, selected, treeProps, ignoreSelectable ? void 0 : selectable.value, data.value.indexOf(row), rowKey.value)) {
			if (treeStates.lazy.value && !treeStates.checkStrictly.value) {
				cascadeToLazyChildren(row, selected ?? isSelected(row), rowIndexMap.value);
				updateSelectionByChildren({
					emitChange: false,
					rowIndexMap: rowIndexMap.value
				});
			} else updateSelectionByChildren({ emitChange: false });
			const newSelection = (selection.value || []).slice();
			if (emitChange) instance.emit("select", newSelection, row);
			instance.emit("selection-change", newSelection);
		}
	};
	const _toggleAllSelection = () => {
		const value = selectOnIndeterminate.value ? !isAllSelected.value : !(isAllSelected.value || selection.value.length);
		isAllSelected.value = value;
		let selectionChanged = false;
		let childrenCount = 0;
		const rowKey = instance?.store?.states?.rowKey.value;
		const { childrenColumnName } = instance.store.states;
		const treeProps = {
			children: childrenColumnName.value,
			checkStrictly: false
		};
		data.value.forEach((row, index) => {
			const rowIndex = index + childrenCount;
			if (toggleRowStatus(selection.value, row, value, treeProps, selectable.value, rowIndex, rowKey)) selectionChanged = true;
			childrenCount += getChildrenCount(getRowIdentity(row, rowKey));
		});
		const rowIndexMapVal = rowIndexMap.value;
		if (treeStates.lazy.value && !treeStates.checkStrictly.value && rowKey) for (const lazyRows of Object.values(treeStates.lazyTreeNodeMap.value)) for (const child of lazyRows) {
			const childIndex = rowIndexMapVal.get(getRowIdentity(child, rowKey)) ?? 0;
			if (toggleRowStatus(selection.value, child, value, treeProps, selectable.value, childIndex, rowKey)) selectionChanged = true;
			cascadeToLazyChildren(child, value, rowIndexMapVal);
		}
		updateSelectionByChildren({
			emitChange: false,
			rowIndexMap: rowIndexMapVal
		});
		if (selectionChanged) instance.emit("selection-change", selection.value ? [...selection.value] : []);
		instance.emit("select-all", (selection.value || []).slice());
	};
	const updateAllSelected = () => {
		if (data.value?.length === 0) {
			isAllSelected.value = false;
			return;
		}
		let rowIndex = 0;
		let selectedCount = 0;
		const checkSelectedStatus = (rows) => {
			for (const row of rows) {
				const isRowSelectable = selectable.value && selectable.value.call(null, row, rowIndex);
				if (!isSelected(row)) {
					if (!selectable.value || isRowSelectable) return false;
				} else selectedCount++;
				rowIndex++;
				const children = getRowChildren(row);
				if (children.length && !checkSelectedStatus(children)) return false;
			}
			return true;
		};
		const isAllSelected_ = checkSelectedStatus(data.value || []);
		isAllSelected.value = selectedCount === 0 ? false : isAllSelected_;
	};
	const getRowIndeterminate = (row) => {
		if (!rowKey.value) return false;
		const id = getRowIdentity(row, rowKey.value);
		return !!selectionIndeterminate.value[id];
	};
	const getChildrenCount = (rowKey) => {
		if (!instance || !instance.store) return 0;
		const { treeData } = instance.store.states;
		let count = 0;
		const children = treeData.value[rowKey]?.children;
		if (children) {
			count += children.length;
			children.forEach((childKey) => {
				count += getChildrenCount(childKey);
			});
		}
		return count;
	};
	const updateFilters = (column, values) => {
		const filters_ = {};
		castArray$1(column).forEach((col) => {
			filters.value[col.id] = values;
			filters_[col.columnKey || col.id] = values;
		});
		return filters_;
	};
	const updateSort = (column, prop, order) => {
		if (sortingColumn.value && sortingColumn.value !== column) sortingColumn.value.order = null;
		sortingColumn.value = column;
		sortProp.value = prop;
		sortOrder.value = order;
	};
	const execFilter = () => {
		let sourceData = unref(_data);
		Object.keys(filters.value).forEach((columnId) => {
			const values = filters.value[columnId];
			if (!values || values.length === 0) return;
			const column = getColumnById({ columns: columns.value }, columnId);
			if (column && column.filterMethod) sourceData = sourceData.filter((row) => {
				return values.some((value) => column.filterMethod.call(null, value, row, column));
			});
		});
		filteredData.value = sourceData;
	};
	const execSort = () => {
		data.value = sortData(filteredData.value ?? [], {
			sortingColumn: sortingColumn.value,
			sortProp: sortProp.value,
			sortOrder: sortOrder.value
		});
	};
	const execQuery = (ignore = void 0) => {
		if (!ignore?.filter) execFilter();
		execSort();
	};
	const clearFilter = (columnKeys) => {
		const { tableHeaderRef } = instance.refs;
		if (!tableHeaderRef) return;
		const panels = Object.assign({}, tableHeaderRef.filterPanels);
		const keys = Object.keys(panels);
		if (!keys.length) return;
		if (isString(columnKeys)) columnKeys = [columnKeys];
		if (isArray$1(columnKeys)) {
			const columns_ = columnKeys.map((key) => getColumnByKey({ columns: columns.value }, key));
			keys.forEach((key) => {
				const column = columns_.find((col) => col.id === key);
				if (column) column.filteredValue = [];
			});
			instance.store.commit("filterChange", {
				column: columns_,
				values: [],
				silent: true,
				multi: true
			});
		} else {
			keys.forEach((key) => {
				const column = columns.value.find((col) => col.id === key);
				if (column) column.filteredValue = [];
			});
			filters.value = {};
			instance.store.commit("filterChange", {
				column: {},
				values: [],
				silent: true
			});
		}
	};
	const clearSort = () => {
		if (!sortingColumn.value) return;
		updateSort(null, null, null);
		instance.store.commit("changeSortCondition", { silent: true });
	};
	const { setExpandRowKeys, toggleRowExpansion, updateExpandRows, states: expandStates, isRowExpanded } = useExpand({
		data,
		rowKey
	});
	const { updateTreeExpandKeys, toggleTreeExpansion, updateTreeData, updateKeyChildren, loadOrToggle, states: treeStates } = useTree({
		data,
		rowKey
	});
	const { updateCurrentRowData, updateCurrentRow, setCurrentRowKey, states: currentData } = useCurrent({
		data,
		rowKey
	});
	const setExpandRowKeysAdapter = (val) => {
		setExpandRowKeys(val);
		updateTreeExpandKeys(val);
	};
	const toggleRowExpansionAdapter = (row, expanded) => {
		if (columns.value.some(({ type }) => type === "expand")) toggleRowExpansion(row, expanded);
		else toggleTreeExpansion(row, expanded);
	};
	watch(() => treeStates.checkStrictly.value, (value) => {
		if (value) {
			selectionIndeterminate.value = {};
			halfSelection = [];
		} else updateSelectionByChildren({ emitChange: false });
		updateAllSelected();
	});
	watch(() => treeStates.lazyTreeNodeMap.value, () => {
		if (!treeStates.lazy.value || treeStates.checkStrictly.value || !rowKey.value) return;
		const rowIndexMapVal = rowIndexMap.value;
		const prevLen = selection.value.length;
		for (const parentId of Object.keys(treeStates.lazyTreeNodeMap.value)) {
			if (!selectedMap.value?.[parentId]) continue;
			cascadeToLazyChildren(selectedMap.value[parentId].row, true, rowIndexMapVal);
		}
		const cascadeChanged = selection.value.length !== prevLen;
		updateSelectionByChildren({
			emitChange: !cascadeChanged,
			rowIndexMap: rowIndexMapVal
		});
		updateAllSelected();
		if (cascadeChanged) instance.emit("selection-change", [...selection.value]);
	});
	return {
		assertRowKey,
		updateColumns,
		scheduleLayout,
		isSelected,
		clearSelection,
		cleanSelection,
		getSelectionRows,
		getHalfSelectionRows,
		toggleRowSelection,
		_toggleAllSelection,
		toggleAllSelection: null,
		updateAllSelected,
		updateSelectionByChildren,
		getRowIndeterminate,
		updateFilters,
		updateCurrentRow,
		updateSort,
		execFilter,
		execSort,
		execQuery,
		clearFilter,
		clearSort,
		toggleRowExpansion,
		setExpandRowKeysAdapter,
		setCurrentRowKey,
		toggleRowExpansionAdapter,
		isRowExpanded,
		updateExpandRows,
		updateCurrentRowData,
		loadOrToggle,
		updateTreeData,
		updateKeyChildren,
		states: {
			tableSize,
			rowKey,
			data,
			_data,
			isComplex,
			_columns,
			originColumns,
			columns,
			fixedColumns,
			rightFixedColumns,
			leafColumns,
			fixedLeafColumns,
			rightFixedLeafColumns,
			updateOrderFns,
			leafColumnsLength,
			fixedLeafColumnsLength,
			rightFixedLeafColumnsLength,
			isAllSelected,
			selection,
			selectionIndeterminate,
			reserveSelection,
			selectOnIndeterminate,
			selectable,
			rowExpandable,
			filters,
			filteredData,
			sortingColumn,
			sortProp,
			sortOrder,
			hoverRow,
			...expandStates,
			...treeStates,
			...currentData
		}
	};
}
//#endregion
//#region node_modules/element-plus/es/components/table/src/store/index.mjs
function replaceColumn(array, column) {
	return array.map((item) => {
		if (item.id === column.id) return column;
		else if (item.children?.length) item.children = replaceColumn(item.children, column);
		return item;
	});
}
function sortColumn(array) {
	array.forEach((item) => {
		item.no = item.getColumnIndex?.();
		if (item.children?.length) sortColumn(item.children);
	});
	array.sort((cur, pre) => cur.no - pre.no);
}
function useStore() {
	const instance = getCurrentInstance();
	const watcher = useWatcher$1();
	const ns = useNamespace("table");
	const { t } = useLocale();
	const mutations = {
		setData(states, data) {
			const dataInstanceChanged = unref(states._data) !== data;
			states.data.value = data;
			states._data.value = data;
			instance.store.execQuery();
			instance.store.updateCurrentRowData();
			instance.store.updateExpandRows();
			instance.store.updateTreeData(instance.store.states.defaultExpandAll.value);
			if (unref(states.reserveSelection)) instance.store.assertRowKey();
			else if (dataInstanceChanged) instance.store.clearSelection();
			else instance.store.cleanSelection();
			instance.store.updateSelectionByChildren({ emitChange: false });
			instance.store.updateAllSelected();
			if (instance.$ready) instance.store.scheduleLayout();
		},
		insertColumn(states, column, parent, updateColumnOrder) {
			const array = unref(states._columns);
			let newColumns = [];
			if (!parent) {
				array.push(column);
				newColumns = array;
			} else {
				if (parent && !parent.children) parent.children = [];
				parent.children?.push(column);
				newColumns = replaceColumn(array, parent);
			}
			sortColumn(newColumns);
			states._columns.value = newColumns;
			states.updateOrderFns.push(updateColumnOrder);
			if (column.type === "selection") {
				states.selectable.value = column.selectable;
				states.reserveSelection.value = column.reserveSelection;
			}
			if (instance.$ready) {
				instance.store.updateColumns();
				instance.store.scheduleLayout();
			}
		},
		updateColumnOrder(states, column) {
			if (column.getColumnIndex?.() === column.no) return;
			sortColumn(states._columns.value);
			if (instance.$ready) instance.store.updateColumns();
		},
		removeColumn(states, column, parent, updateColumnOrder) {
			const array = unref(states._columns) || [];
			if (parent) {
				parent.children?.splice(parent.children.findIndex((item) => item.id === column.id), 1);
				nextTick(() => {
					if (parent.children?.length === 0) delete parent.children;
				});
				states._columns.value = replaceColumn(array, parent);
			} else {
				const index = array.indexOf(column);
				if (index > -1) {
					array.splice(index, 1);
					states._columns.value = array;
				}
			}
			const updateFnIndex = states.updateOrderFns.indexOf(updateColumnOrder);
			updateFnIndex > -1 && states.updateOrderFns.splice(updateFnIndex, 1);
			if (instance.$ready) {
				instance.store.updateColumns();
				instance.store.scheduleLayout();
			}
		},
		sort(states, options) {
			const { prop, order, init } = options;
			if (prop) {
				const column = unref(states.columns).find((column) => column.property === prop);
				if (column) {
					column.order = order;
					instance.store.updateSort(column, prop, order);
					instance.store.commit("changeSortCondition", { init });
				}
			}
		},
		changeSortCondition(states, options) {
			const { sortingColumn, sortProp, sortOrder } = states;
			const columnValue = unref(sortingColumn), propValue = unref(sortProp), orderValue = unref(sortOrder);
			if (isNull(orderValue)) {
				states.sortingColumn.value = null;
				states.sortProp.value = null;
			}
			instance.store.execQuery({ filter: true });
			if (!options || !(options.silent || options.init)) instance.emit("sort-change", {
				column: columnValue,
				prop: propValue,
				order: orderValue
			});
			instance.store.updateTableScrollY();
		},
		filterChange(_states, options) {
			const { column, values, silent } = options;
			const newFilters = instance.store.updateFilters(column, values);
			instance.store.execQuery();
			if (!silent) instance.emit("filter-change", newFilters);
			instance.store.updateTableScrollY();
		},
		toggleAllSelection() {
			instance.store.toggleAllSelection?.();
		},
		rowSelectedChanged(_states, row) {
			instance.store.toggleRowSelection(row);
			instance.store.updateAllSelected();
		},
		setHoverRow(states, row) {
			states.hoverRow.value = row;
		},
		setCurrentRow(_states, row) {
			instance.store.updateCurrentRow(row);
		}
	};
	const commit = function(name, ...args) {
		const mutations = instance.store.mutations;
		if (mutations[name]) mutations[name].apply(instance, [instance.store.states, ...args]);
		else throw new Error(`Action not found: ${name}`);
	};
	const updateTableScrollY = function() {
		nextTick(() => instance.layout.updateScrollY.apply(instance.layout));
	};
	return {
		ns,
		t,
		...watcher,
		mutations,
		commit,
		updateTableScrollY
	};
}
//#endregion
//#region node_modules/element-plus/es/components/table/src/store/helper.mjs
var InitialStateMap = {
	rowKey: "rowKey",
	defaultExpandAll: "defaultExpandAll",
	rowExpandable: "rowExpandable",
	selectOnIndeterminate: "selectOnIndeterminate",
	indent: "indent",
	lazy: "lazy",
	["treeProps.hasChildren"]: {
		key: "lazyColumnIdentifier",
		default: "hasChildren"
	},
	["treeProps.children"]: {
		key: "childrenColumnName",
		default: "children"
	},
	["treeProps.checkStrictly"]: {
		key: "checkStrictly",
		default: false
	}
};
function createStore(table, props) {
	if (!table) throw new Error("Table is required.");
	const store = useStore();
	store.toggleAllSelection = debounce(store._toggleAllSelection, 10);
	Object.keys(InitialStateMap).forEach((key) => {
		handleValue(getArrKeysValue(props, key), key, store);
	});
	proxyTableProps(store, props);
	return store;
}
function proxyTableProps(store, props) {
	Object.keys(InitialStateMap).forEach((key) => {
		watch(() => getArrKeysValue(props, key), (value) => {
			handleValue(value, key, store);
		});
	});
}
function handleValue(value, propsKey, store) {
	let newVal = value;
	let storeKey = InitialStateMap[propsKey];
	if (isObject$2(storeKey)) {
		newVal = newVal || storeKey.default;
		storeKey = storeKey.key;
	}
	store.states[storeKey].value = newVal;
}
function getArrKeysValue(props, key) {
	if (key.includes(".")) {
		const keyList = key.split(".");
		let value = props;
		keyList.forEach((k) => {
			value = value[k];
		});
		return value;
	} else return props[key];
}
//#endregion
//#region node_modules/element-plus/es/components/table/src/table-layout.mjs
var TableLayout = class {
	constructor(options) {
		this.observers = [];
		this.table = null;
		this.store = null;
		this.columns = [];
		this.fit = true;
		this.showHeader = true;
		this.heightMap = {};
		this.height = /* @__PURE__ */ ref(null);
		this.scrollX = /* @__PURE__ */ ref(false);
		this.scrollY = /* @__PURE__ */ ref(false);
		this.bodyWidth = /* @__PURE__ */ ref(null);
		this.fixedWidth = /* @__PURE__ */ ref(null);
		this.rightFixedWidth = /* @__PURE__ */ ref(null);
		this.gutterWidth = 0;
		for (const name in options) if (hasOwn(options, name)) if (/* @__PURE__ */ isRef(this[name])) this[name].value = options[name];
		else this[name] = options[name];
		if (!this.table) throw new Error("Table is required for Table Layout");
		if (!this.store) throw new Error("Store is required for Table Layout");
	}
	updateScrollY() {
		const height = this.height.value;
		/**
		* When the height is not initialized, it is null.
		* After the table is initialized, when the height is not configured, the height is 0.
		*/
		if (isNull(height)) return false;
		const scrollBarRef = this.table.refs.scrollBarRef;
		if (this.table.vnode.el && scrollBarRef?.wrapRef) {
			let scrollY = true;
			const prevScrollY = this.scrollY.value;
			scrollY = scrollBarRef.wrapRef.scrollHeight > scrollBarRef.wrapRef.clientHeight;
			this.scrollY.value = scrollY;
			return prevScrollY !== scrollY;
		}
		return false;
	}
	setHeight(value, prop = "height") {
		if (!isClient) return;
		const el = this.table.vnode.el;
		value = parseHeight(value);
		this.height.value = Number(value);
		this.heightMap[prop] = value;
		if (!el && (value || value === 0)) {
			nextTick(() => {
				if (this.heightMap[prop] === value) this.setHeight(value, prop);
			});
			return;
		}
		if (el && isNumber(value)) {
			el.style[prop] = `${value}px`;
			this.updateElsHeight();
		} else if (el && isString(value)) {
			el.style[prop] = value;
			this.updateElsHeight();
		}
	}
	setMaxHeight(value) {
		this.setHeight(value, "max-height");
	}
	getFlattenColumns() {
		const flattenColumns = [];
		this.table.store.states.columns.value.forEach((column) => {
			if (column.isColumnGroup) flattenColumns.push.apply(flattenColumns, column.columns);
			else flattenColumns.push(column);
		});
		return flattenColumns;
	}
	updateElsHeight() {
		this.updateScrollY();
		this.notifyObservers("scrollable");
	}
	headerDisplayNone(elm) {
		if (!elm) return true;
		let headerChild = elm;
		while (headerChild.tagName !== "DIV") {
			if (getComputedStyle(headerChild).display === "none") return true;
			headerChild = headerChild.parentElement;
		}
		return false;
	}
	updateColumnsWidth() {
		if (!isClient) return;
		const fit = this.fit;
		const bodyWidth = this.table.vnode.el?.clientWidth;
		let bodyMinWidth = 0;
		const flattenColumns = this.getFlattenColumns();
		const flexColumns = flattenColumns.filter((column) => !isNumber(column.width));
		flattenColumns.forEach((column) => {
			if (isNumber(column.width) && column.realWidth) column.realWidth = null;
		});
		if (flexColumns.length > 0 && fit) {
			flattenColumns.forEach((column) => {
				bodyMinWidth += Number(column.width || column.minWidth || 80);
			});
			if (bodyMinWidth <= bodyWidth) {
				this.scrollX.value = false;
				const totalFlexWidth = bodyWidth - bodyMinWidth;
				if (flexColumns.length === 1) flexColumns[0].realWidth = Number(flexColumns[0].minWidth || 80) + totalFlexWidth;
				else {
					const flexWidthPerPixel = totalFlexWidth / flexColumns.reduce((prev, column) => prev + Number(column.minWidth || 80), 0);
					let noneFirstWidth = 0;
					flexColumns.forEach((column, index) => {
						if (index === 0) return;
						const flexWidth = Math.floor(Number(column.minWidth || 80) * flexWidthPerPixel);
						noneFirstWidth += flexWidth;
						column.realWidth = Number(column.minWidth || 80) + flexWidth;
					});
					flexColumns[0].realWidth = Number(flexColumns[0].minWidth || 80) + totalFlexWidth - noneFirstWidth;
				}
			} else {
				this.scrollX.value = true;
				flexColumns.forEach((column) => {
					column.realWidth = Number(column.minWidth);
				});
			}
			this.bodyWidth.value = Math.max(bodyMinWidth, bodyWidth);
			this.table.state.resizeState.value.width = this.bodyWidth.value;
		} else {
			flattenColumns.forEach((column) => {
				if (!column.width && !column.minWidth) column.realWidth = 80;
				else column.realWidth = Number(column.width || column.minWidth);
				bodyMinWidth += column.realWidth;
			});
			this.scrollX.value = bodyMinWidth > bodyWidth;
			this.bodyWidth.value = bodyMinWidth;
		}
		const fixedColumns = this.store.states.fixedColumns.value;
		if (fixedColumns.length > 0) {
			let fixedWidth = 0;
			fixedColumns.forEach((column) => {
				fixedWidth += Number(column.realWidth || column.width);
			});
			this.fixedWidth.value = fixedWidth;
		}
		const rightFixedColumns = this.store.states.rightFixedColumns.value;
		if (rightFixedColumns.length > 0) {
			let rightFixedWidth = 0;
			rightFixedColumns.forEach((column) => {
				rightFixedWidth += Number(column.realWidth || column.width);
			});
			this.rightFixedWidth.value = rightFixedWidth;
		}
		this.notifyObservers("columns");
	}
	addObserver(observer) {
		this.observers.push(observer);
	}
	removeObserver(observer) {
		const index = this.observers.indexOf(observer);
		if (index !== -1) this.observers.splice(index, 1);
	}
	notifyObservers(event) {
		this.observers.forEach((observer) => {
			switch (event) {
				case "columns":
					observer.state?.onColumnsChange(this);
					break;
				case "scrollable":
					observer.state?.onScrollableChange(this);
					break;
				default: throw new Error(`Table Layout don't have event ${event}.`);
			}
		});
	}
};
//#endregion
//#region node_modules/element-plus/es/components/table/src/tokens.mjs
var TABLE_INJECTION_KEY = Symbol("ElTable");
//#endregion
//#region node_modules/element-plus/es/components/table/src/table-header/utils-helper.mjs
var getAllColumns = (columns) => {
	const result = [];
	columns.forEach((column) => {
		if (column.children) {
			result.push(column);
			result.push.apply(result, getAllColumns(column.children));
		} else result.push(column);
	});
	return result;
};
var convertToRows = (originColumns) => {
	let maxLevel = 1;
	const traverse = (column, parent) => {
		if (parent) {
			column.level = parent.level + 1;
			if (maxLevel < column.level) maxLevel = column.level;
		}
		if (column.children) {
			let colSpan = 0;
			column.children.forEach((subColumn) => {
				traverse(subColumn, column);
				colSpan += subColumn.colSpan;
			});
			column.colSpan = colSpan;
		} else column.colSpan = 1;
	};
	originColumns.forEach((column) => {
		column.level = 1;
		traverse(column, void 0);
	});
	const rows = [];
	for (let i = 0; i < maxLevel; i++) rows.push([]);
	getAllColumns(originColumns).forEach((column) => {
		if (!column.children) column.rowSpan = maxLevel - column.level + 1;
		else {
			column.rowSpan = 1;
			column.children.forEach((col) => col.isSubColumn = true);
		}
		rows[column.level - 1].push(column);
	});
	return rows;
};
function useUtils$1(props) {
	const parent = inject(TABLE_INJECTION_KEY);
	const columnRows = computed(() => {
		return convertToRows(props.store.states.originColumns.value);
	});
	const isGroup = computed(() => {
		const result = columnRows.value.length > 1;
		if (result && parent) parent.state.isGroup.value = true;
		return result;
	});
	const toggleAllSelection = (event) => {
		event.stopPropagation();
		parent?.store.commit("toggleAllSelection");
	};
	return {
		isGroup,
		toggleAllSelection,
		columnRows
	};
}
//#endregion
//#region node_modules/element-plus/es/components/table/src/filter-panel.vue_vue_type_script_lang.mjs
var filter_panel_vue_vue_type_script_lang_default = /* @__PURE__ */ defineComponent({
	name: "ElTableFilterPanel",
	components: {
		ElCheckbox,
		ElCheckboxGroup,
		ElScrollbar,
		ElTooltip,
		ElIcon,
		ArrowDown: arrow_down_default,
		ArrowUp: arrow_up_default
	},
	props: {
		placement: {
			type: String,
			default: "bottom-start"
		},
		store: { type: Object },
		column: { type: Object },
		upDataColumn: { type: Function },
		appendTo: useTooltipContentProps.appendTo
	},
	setup(props) {
		const instance = getCurrentInstance();
		const { t } = useLocale();
		const ns = useNamespace("table-filter");
		const parent = instance?.parent;
		if (props.column && !parent.filterPanels.value[props.column.id]) parent.filterPanels.value[props.column.id] = instance;
		const tooltipRef = /* @__PURE__ */ ref(null);
		const rootRef = /* @__PURE__ */ ref(null);
		const checkedIndex = /* @__PURE__ */ ref(0);
		const filters = computed(() => {
			return props.column && props.column.filters;
		});
		const filterClassName = computed(() => {
			if (props.column && props.column.filterClassName) return `${ns.b()} ${props.column.filterClassName}`;
			return ns.b();
		});
		const filterValue = computed({
			get: () => (props.column?.filteredValue || [])[0],
			set: (value) => {
				if (filteredValue.value) if (!isPropAbsent(value)) filteredValue.value.splice(0, 1, value);
				else filteredValue.value.splice(0, 1);
			}
		});
		const filteredValue = computed({
			get() {
				if (props.column) return props.column.filteredValue || [];
				return [];
			},
			set(value) {
				if (props.column) props.upDataColumn?.("filteredValue", value);
			}
		});
		const multiple = computed(() => {
			if (props.column) return props.column.filterMultiple;
			return true;
		});
		const isActive = (filter) => {
			return filter.value === filterValue.value;
		};
		const hidden = () => {
			tooltipRef.value?.onClose();
		};
		const handleConfirm = () => {
			confirmFilter(filteredValue.value);
			hidden();
		};
		const handleReset = () => {
			filteredValue.value = [];
			confirmFilter(filteredValue.value);
			hidden();
		};
		const handleSelect = (_filterValue, index) => {
			filterValue.value = _filterValue;
			checkedIndex.value = index;
			if (!isPropAbsent(_filterValue)) confirmFilter(filteredValue.value);
			else confirmFilter([]);
			hidden();
		};
		const confirmFilter = (filteredValue) => {
			props.store?.commit("filterChange", {
				column: props.column,
				values: filteredValue
			});
			props.store?.updateAllSelected();
		};
		const handleShowTooltip = () => {
			rootRef.value?.focus();
			!multiple.value && initCheckedIndex();
			if (props.column) props.upDataColumn?.("filterOpened", true);
		};
		const handleHideTooltip = () => {
			if (props.column) props.upDataColumn?.("filterOpened", false);
		};
		const initCheckedIndex = () => {
			if (isPropAbsent(filterValue)) {
				checkedIndex.value = 0;
				return;
			}
			const idx = (filters.value || []).findIndex((item) => {
				return item.value === filterValue.value;
			});
			checkedIndex.value = idx >= 0 ? idx + 1 : 0;
		};
		const handleKeydown = (event) => {
			const code = getEventCode(event);
			const len = (filters.value ? filters.value.length : 0) + 1;
			let index = checkedIndex.value;
			let isPreventDefault = true;
			switch (code) {
				case EVENT_CODE.down:
				case EVENT_CODE.right:
					index = (index + 1) % len;
					break;
				case EVENT_CODE.up:
				case EVENT_CODE.left:
					index = (index - 1 + len) % len;
					break;
				case EVENT_CODE.tab:
					hidden();
					isPreventDefault = false;
					break;
				case EVENT_CODE.enter:
				case EVENT_CODE.space:
					if (index === 0) handleSelect(null, 0);
					else {
						const item = (filters.value || [])[index - 1];
						item.value && handleSelect(item.value, index);
					}
					break;
				default:
					isPreventDefault = false;
					break;
			}
			isPreventDefault && event.preventDefault();
			checkedIndex.value = index;
			rootRef.value?.querySelector(`.${ns.e("list-item")}:nth-child(${index + 1})`)?.focus();
		};
		return {
			multiple,
			filterClassName,
			filteredValue,
			filterValue,
			filters,
			handleConfirm,
			handleReset,
			handleSelect,
			isPropAbsent,
			isActive,
			t,
			ns,
			tooltipRef,
			rootRef,
			checkedIndex,
			handleShowTooltip,
			handleHideTooltip,
			handleKeydown
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/table/src/filter-panel.mjs
var _hoisted_1$4 = ["disabled"];
var _hoisted_2$3 = ["tabindex", "aria-checked"];
var _hoisted_3$1 = [
	"tabindex",
	"aria-checked",
	"onClick"
];
var _hoisted_4 = ["aria-label"];
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
	const _component_el_checkbox = resolveComponent("el-checkbox");
	const _component_el_checkbox_group = resolveComponent("el-checkbox-group");
	const _component_el_scrollbar = resolveComponent("el-scrollbar");
	const _component_arrow_up = resolveComponent("arrow-up");
	const _component_arrow_down = resolveComponent("arrow-down");
	const _component_el_icon = resolveComponent("el-icon");
	const _component_el_tooltip = resolveComponent("el-tooltip");
	return openBlock(), createBlock(_component_el_tooltip, {
		ref: "tooltipRef",
		offset: 0,
		placement: _ctx.placement,
		"show-arrow": false,
		trigger: "click",
		role: "dialog",
		teleported: "",
		effect: "light",
		pure: "",
		loop: "",
		"popper-class": _ctx.filterClassName,
		persistent: "",
		"append-to": _ctx.appendTo,
		onShow: _ctx.handleShowTooltip,
		onHide: _ctx.handleHideTooltip
	}, {
		content: withCtx(() => [_ctx.multiple ? (openBlock(), createElementBlock("div", {
			key: 0,
			ref: "rootRef",
			tabindex: "-1",
			class: normalizeClass(_ctx.ns.e("multiple"))
		}, [createBaseVNode("div", { class: normalizeClass(_ctx.ns.e("content")) }, [createVNode(_component_el_scrollbar, { "wrap-class": _ctx.ns.e("wrap") }, {
			default: withCtx(() => [createVNode(_component_el_checkbox_group, {
				modelValue: _ctx.filteredValue,
				"onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.filteredValue = $event),
				class: normalizeClass(_ctx.ns.e("checkbox-group"))
			}, {
				default: withCtx(() => [(openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.filters, (filter) => {
					return openBlock(), createBlock(_component_el_checkbox, {
						key: filter.value,
						value: filter.value
					}, {
						default: withCtx(() => [createTextVNode(toDisplayString(filter.text), 1)]),
						_: 2
					}, 1032, ["value"]);
				}), 128))]),
				_: 1
			}, 8, ["modelValue", "class"])]),
			_: 1
		}, 8, ["wrap-class"])], 2), createBaseVNode("div", { class: normalizeClass(_ctx.ns.e("bottom")) }, [createBaseVNode("button", {
			class: normalizeClass(_ctx.ns.is("disabled", _ctx.filteredValue.length === 0)),
			disabled: _ctx.filteredValue.length === 0,
			type: "button",
			onClick: _cache[1] || (_cache[1] = (...args) => _ctx.handleConfirm && _ctx.handleConfirm(...args))
		}, toDisplayString(_ctx.t("el.table.confirmFilter")), 11, _hoisted_1$4), createBaseVNode("button", {
			type: "button",
			onClick: _cache[2] || (_cache[2] = (...args) => _ctx.handleReset && _ctx.handleReset(...args))
		}, toDisplayString(_ctx.t("el.table.resetFilter")), 1)], 2)], 2)) : (openBlock(), createElementBlock("ul", {
			key: 1,
			ref: "rootRef",
			tabindex: "-1",
			role: "radiogroup",
			class: normalizeClass(_ctx.ns.e("list")),
			onKeydown: _cache[4] || (_cache[4] = (...args) => _ctx.handleKeydown && _ctx.handleKeydown(...args))
		}, [createBaseVNode("li", {
			role: "radio",
			class: normalizeClass([_ctx.ns.e("list-item"), _ctx.ns.is("active", _ctx.isPropAbsent(_ctx.filterValue))]),
			tabindex: _ctx.checkedIndex === 0 ? 0 : -1,
			"aria-checked": _ctx.isPropAbsent(_ctx.filterValue),
			onClick: _cache[3] || (_cache[3] = ($event) => _ctx.handleSelect(null, 0))
		}, toDisplayString(_ctx.t("el.table.clearFilter")), 11, _hoisted_2$3), (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.filters, (filter, idx) => {
			return openBlock(), createElementBlock("li", {
				key: filter.value,
				role: "radio",
				class: normalizeClass([_ctx.ns.e("list-item"), _ctx.ns.is("active", _ctx.isActive(filter))]),
				tabindex: _ctx.checkedIndex === idx + 1 ? 0 : -1,
				"aria-checked": _ctx.isActive(filter),
				onClick: ($event) => _ctx.handleSelect(filter.value, idx + 1)
			}, toDisplayString(filter.text), 11, _hoisted_3$1);
		}), 128))], 34))]),
		default: withCtx(() => [createBaseVNode("button", {
			type: "button",
			class: normalizeClass(`${_ctx.ns.namespace.value}-table__column-filter-trigger`),
			"aria-label": _ctx.t("el.table.filterLabel", { column: _ctx.column?.label || "" })
		}, [createVNode(_component_el_icon, null, {
			default: withCtx(() => [renderSlot(_ctx.$slots, "filter-icon", {}, () => [_ctx.column?.filterOpened ? (openBlock(), createBlock(_component_arrow_up, { key: 0 })) : (openBlock(), createBlock(_component_arrow_down, { key: 1 }))])]),
			_: 3
		})], 10, _hoisted_4)]),
		_: 3
	}, 8, [
		"placement",
		"popper-class",
		"append-to",
		"onShow",
		"onHide"
	]);
}
var filter_panel_default = /* @__PURE__ */ _plugin_vue_export_helper_default$1(filter_panel_vue_vue_type_script_lang_default, [["render", _sfc_render$1]]);
//#endregion
//#region node_modules/element-plus/es/components/table/src/layout-observer.mjs
function useLayoutObserver(root) {
	const instance = getCurrentInstance();
	onBeforeMount(() => {
		tableLayout.value.addObserver(instance);
	});
	onMounted(() => {
		onColumnsChange(tableLayout.value);
		onScrollableChange(tableLayout.value);
	});
	onUpdated(() => {
		onColumnsChange(tableLayout.value);
		onScrollableChange(tableLayout.value);
	});
	onUnmounted(() => {
		tableLayout.value.removeObserver(instance);
	});
	const tableLayout = computed(() => {
		const layout = root.layout;
		if (!layout) throw new Error("Can not find table layout.");
		return layout;
	});
	const onColumnsChange = (layout) => {
		const cols = root.vnode.el?.querySelectorAll("colgroup > col") || [];
		if (!cols.length) return;
		const flattenColumns = layout.getFlattenColumns();
		const columnsMap = {};
		flattenColumns.forEach((column) => {
			columnsMap[column.id] = column;
		});
		for (let i = 0, j = cols.length; i < j; i++) {
			const col = cols[i];
			const column = columnsMap[col.getAttribute("name")];
			if (column) col.setAttribute("width", column.realWidth || column.width);
		}
	};
	const onScrollableChange = (layout) => {
		const cols = root.vnode.el?.querySelectorAll("colgroup > col[name=gutter]") || [];
		for (let i = 0, j = cols.length; i < j; i++) cols[i].setAttribute("width", layout.scrollY.value ? layout.gutterWidth : "0");
		const ths = root.vnode.el?.querySelectorAll("th.gutter") || [];
		for (let i = 0, j = ths.length; i < j; i++) {
			const th = ths[i];
			th.style.width = layout.scrollY.value ? `${layout.gutterWidth}px` : "0";
			th.style.display = layout.scrollY.value ? "" : "none";
		}
	};
	return {
		tableLayout: tableLayout.value,
		onColumnsChange,
		onScrollableChange
	};
}
//#endregion
//#region node_modules/element-plus/es/components/table/src/table-header/event-helper.mjs
function useEvent(props, emit) {
	const instance = getCurrentInstance();
	const parent = inject(TABLE_INJECTION_KEY);
	const handleFilterClick = (event) => {
		event.stopPropagation();
	};
	const handleHeaderClick = (event, column) => {
		if (!column.filters && column.sortable) handleSortClick(event, column, false);
		else if (column.filterable && !column.sortable) handleFilterClick(event);
		parent?.emit("header-click", column, event);
	};
	const handleHeaderContextMenu = (event, column) => {
		parent?.emit("header-contextmenu", column, event);
	};
	const draggingColumn = /* @__PURE__ */ ref(null);
	const dragging = /* @__PURE__ */ ref(false);
	const dragState = /* @__PURE__ */ ref();
	const handleMouseDown = (event, column) => {
		if (!isClient) return;
		if (column.children && column.children.length > 0) return;
		/* istanbul ignore if */
		if (draggingColumn.value && props.border && draggingColumn.value.id === column.id) {
			dragging.value = true;
			const table = parent;
			emit("set-drag-visible", true);
			const tableLeft = (table?.vnode.el)?.getBoundingClientRect().left;
			const columnEl = instance?.vnode?.el?.querySelector(`th.${column.id}`);
			const columnRect = columnEl.getBoundingClientRect();
			const minLeft = columnRect.left - tableLeft + 30;
			addClass(columnEl, "noclick");
			dragState.value = {
				startMouseLeft: event.clientX,
				startLeft: columnRect.right - tableLeft,
				startColumnLeft: columnRect.left - tableLeft,
				tableLeft
			};
			const resizeProxy = table?.refs.resizeProxy;
			resizeProxy.style.left = `${dragState.value.startLeft}px`;
			document.onselectstart = function() {
				return false;
			};
			document.ondragstart = function() {
				return false;
			};
			const handleMouseMove = (event) => {
				const deltaLeft = event.clientX - dragState.value.startMouseLeft;
				const proxyLeft = dragState.value.startLeft + deltaLeft;
				resizeProxy.style.left = `${Math.max(minLeft, proxyLeft)}px`;
			};
			const handleMouseUp = () => {
				if (dragging.value) {
					const { startColumnLeft, startLeft } = dragState.value;
					column.width = column.realWidth = Number.parseInt(resizeProxy.style.left, 10) - startColumnLeft;
					table?.emit("header-dragend", column.width, startLeft - startColumnLeft, column, event);
					requestAnimationFrame(() => {
						props.store.scheduleLayout(false, true);
					});
					document.body.style.cursor = "";
					dragging.value = false;
					draggingColumn.value = null;
					dragState.value = void 0;
					emit("set-drag-visible", false);
				}
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
				document.onselectstart = null;
				document.ondragstart = null;
				setTimeout(() => {
					removeClass(columnEl, "noclick");
				}, 0);
			};
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		}
	};
	const handleMouseMove = (event, column) => {
		if (!props.border || column.children && column.children.length > 0) return;
		const el = event.target;
		const target = isElement(el) ? el.closest("th") : null;
		if (!target) return;
		const isSortable = hasClass(target, "is-sortable");
		if (isSortable) {
			const cursor = dragging.value ? "col-resize" : "";
			target.style.cursor = cursor;
			const caret = target.querySelector(".caret-wrapper");
			if (caret) caret.style.cursor = cursor;
		}
		if (!column.resizable || dragging.value) {
			draggingColumn.value = null;
			return;
		}
		const rect = target.getBoundingClientRect();
		const isLastTh = target.parentNode?.lastElementChild === target;
		const allowDrag = props.allowDragLastColumn || !isLastTh;
		const isResizeHandleActive = rect.width > 12 && rect.right - event.clientX < 8 && allowDrag;
		const cursor = isResizeHandleActive ? "col-resize" : "";
		document.body.style.cursor = cursor;
		draggingColumn.value = isResizeHandleActive ? column : null;
		if (isSortable) target.style.cursor = cursor;
	};
	const handleMouseOut = () => {
		if (!isClient || dragging.value) return;
		document.body.style.cursor = "";
	};
	const toggleOrder = ({ order, sortOrders }) => {
		if (order === "") return sortOrders[0];
		const index = sortOrders.indexOf(order || null);
		return sortOrders[index > sortOrders.length - 2 ? 0 : index + 1];
	};
	const handleSortClick = (event, column, givenOrder) => {
		event.stopPropagation();
		const order = column.order === givenOrder ? null : givenOrder || toggleOrder(column);
		const target = event.target?.closest("th");
		if (target) {
			if (hasClass(target, "noclick")) {
				removeClass(target, "noclick");
				return;
			}
		}
		if (!column.sortable) return;
		const clickTarget = event.currentTarget;
		if (["ascending", "descending"].some((str) => hasClass(clickTarget, str) && !column.sortOrders.includes(str))) return;
		const states = props.store.states;
		let sortProp = states.sortProp.value;
		let sortOrder;
		const sortingColumn = states.sortingColumn.value;
		if (sortingColumn !== column || sortingColumn === column && isNull(sortingColumn.order)) {
			if (sortingColumn) sortingColumn.order = null;
			states.sortingColumn.value = column;
			sortProp = column.property ?? null;
		}
		if (!order) sortOrder = column.order = null;
		else sortOrder = column.order = order;
		states.sortProp.value = sortProp;
		states.sortOrder.value = sortOrder;
		parent?.store.commit("changeSortCondition");
	};
	return {
		handleHeaderClick,
		handleHeaderContextMenu,
		handleMouseDown,
		handleMouseMove,
		handleMouseOut,
		handleSortClick,
		handleFilterClick
	};
}
//#endregion
//#region node_modules/element-plus/es/components/table/src/table-header/style.helper.mjs
function useStyle$2(props) {
	const parent = inject(TABLE_INJECTION_KEY);
	const ns = useNamespace("table");
	const getHeaderRowStyle = (rowIndex) => {
		const headerRowStyle = parent?.props.headerRowStyle;
		if (isFunction$1(headerRowStyle)) return headerRowStyle.call(null, { rowIndex });
		return headerRowStyle;
	};
	const getHeaderRowClass = (rowIndex) => {
		const classes = [];
		const headerRowClassName = parent?.props.headerRowClassName;
		if (isString(headerRowClassName)) classes.push(headerRowClassName);
		else if (isFunction$1(headerRowClassName)) classes.push(headerRowClassName.call(null, { rowIndex }));
		return classes.join(" ");
	};
	const getHeaderCellStyle = (rowIndex, columnIndex, row, column) => {
		let headerCellStyles = parent?.props.headerCellStyle ?? {};
		if (isFunction$1(headerCellStyles)) headerCellStyles = headerCellStyles.call(null, {
			rowIndex,
			columnIndex,
			row,
			column
		});
		const fixedStyle = getFixedColumnOffset(columnIndex, column.fixed, props.store, row);
		ensurePosition(fixedStyle, "left");
		ensurePosition(fixedStyle, "right");
		return Object.assign({}, headerCellStyles, fixedStyle);
	};
	const getHeaderCellClass = (rowIndex, columnIndex, row, column) => {
		const fixedClasses = getFixedColumnsClass(ns.b(), columnIndex, column.fixed, props.store, row);
		const classes = [
			column.id,
			column.order,
			column.headerAlign,
			column.className,
			column.labelClassName,
			...fixedClasses
		];
		if (!column.children) classes.push("is-leaf");
		if (column.sortable) classes.push("is-sortable");
		const headerCellClassName = parent?.props.headerCellClassName;
		if (isString(headerCellClassName)) classes.push(headerCellClassName);
		else if (isFunction$1(headerCellClassName)) classes.push(headerCellClassName.call(null, {
			rowIndex,
			columnIndex,
			row,
			column
		}));
		classes.push(ns.e("cell"));
		return classes.filter((className) => Boolean(className)).join(" ");
	};
	return {
		getHeaderRowStyle,
		getHeaderRowClass,
		getHeaderCellStyle,
		getHeaderCellClass
	};
}
//#endregion
//#region node_modules/element-plus/es/components/table/src/table-header/index.mjs
var table_header_default = /* @__PURE__ */ defineComponent({
	name: "ElTableHeader",
	components: { ElCheckbox },
	props: {
		fixed: {
			type: String,
			default: ""
		},
		store: {
			required: true,
			type: Object
		},
		border: Boolean,
		defaultSort: {
			type: Object,
			default: () => {
				return {
					prop: "",
					order: ""
				};
			}
		},
		appendFilterPanelTo: { type: String },
		allowDragLastColumn: { type: Boolean }
	},
	setup(props, { emit }) {
		const instance = getCurrentInstance();
		const parent = inject(TABLE_INJECTION_KEY);
		const ns = useNamespace("table");
		const filterPanels = /* @__PURE__ */ ref({});
		const { onColumnsChange, onScrollableChange } = useLayoutObserver(parent);
		const isTableLayoutAuto = parent?.props.tableLayout === "auto";
		const saveIndexSelection = /* @__PURE__ */ reactive(/* @__PURE__ */ new Map());
		const theadRef = /* @__PURE__ */ ref();
		let delayId;
		const updateFixedColumnStyle = () => {
			delayId = setTimeout(() => {
				if (saveIndexSelection.size > 0) {
					saveIndexSelection.forEach((column, key) => {
						const el = theadRef.value.querySelector(`.${key.replace(/\s/g, ".")}`);
						if (el) column.width = el.getBoundingClientRect().width || column.width;
					});
					saveIndexSelection.clear();
				}
			});
		};
		watch(saveIndexSelection, updateFixedColumnStyle);
		onBeforeUnmount(() => {
			if (delayId) {
				clearTimeout(delayId);
				delayId = void 0;
			}
		});
		onMounted(async () => {
			await nextTick();
			await nextTick();
			const { prop, order } = props.defaultSort;
			parent?.store.commit("sort", {
				prop,
				order,
				init: true
			});
			updateFixedColumnStyle();
		});
		const { handleHeaderClick, handleHeaderContextMenu, handleMouseDown, handleMouseMove, handleMouseOut, handleSortClick, handleFilterClick } = useEvent(props, emit);
		const { getHeaderRowStyle, getHeaderRowClass, getHeaderCellStyle, getHeaderCellClass } = useStyle$2(props);
		const { isGroup, toggleAllSelection, columnRows } = useUtils$1(props);
		const { t } = useLocale();
		instance.state = {
			onColumnsChange,
			onScrollableChange
		};
		instance.filterPanels = filterPanels;
		return {
			ns,
			t,
			filterPanels,
			onColumnsChange,
			onScrollableChange,
			columnRows,
			getHeaderRowClass,
			getHeaderRowStyle,
			getHeaderCellClass,
			getHeaderCellStyle,
			handleHeaderClick,
			handleHeaderContextMenu,
			handleMouseDown,
			handleMouseMove,
			handleMouseOut,
			handleSortClick,
			handleFilterClick,
			isGroup,
			toggleAllSelection,
			saveIndexSelection,
			isTableLayoutAuto,
			theadRef,
			updateFixedColumnStyle
		};
	},
	render() {
		const { ns, t, isGroup, columnRows, getHeaderCellStyle, getHeaderCellClass, getHeaderRowClass, getHeaderRowStyle, handleHeaderClick, handleHeaderContextMenu, handleMouseDown, handleMouseMove, handleSortClick, handleMouseOut, store, $parent, saveIndexSelection, isTableLayoutAuto } = this;
		let rowSpan = 1;
		return h$1("thead", {
			ref: "theadRef",
			class: ns.is("group", isGroup)
		}, columnRows.map((subColumns, rowIndex) => h$1("tr", {
			class: getHeaderRowClass(rowIndex),
			key: rowIndex,
			style: getHeaderRowStyle(rowIndex)
		}, subColumns.map((column, cellIndex) => {
			if (column.rowSpan > rowSpan) rowSpan = column.rowSpan;
			const _class = getHeaderCellClass(rowIndex, cellIndex, subColumns, column);
			if (isTableLayoutAuto && column.fixed) saveIndexSelection.set(_class, column);
			return h$1("th", {
				class: _class,
				colspan: column.colSpan,
				key: `${column.id}-thead`,
				rowspan: column.rowSpan,
				scope: column.colSpan > 1 ? "colgroup" : "col",
				ariaSort: column.sortable ? column.order : void 0,
				style: getHeaderCellStyle(rowIndex, cellIndex, subColumns, column),
				onClick: ($event) => {
					if ($event.currentTarget?.classList.contains("noclick")) return;
					handleHeaderClick($event, column);
				},
				onContextmenu: ($event) => handleHeaderContextMenu($event, column),
				onMousedown: ($event) => handleMouseDown($event, column),
				onMousemove: ($event) => handleMouseMove($event, column),
				onMouseout: handleMouseOut
			}, [h$1("div", { class: ["cell", column.filteredValue && column.filteredValue.length > 0 ? "highlight" : ""] }, [
				column.renderHeader ? column.renderHeader({
					column,
					$index: cellIndex,
					store,
					_self: $parent
				}) : column.label,
				column.sortable && h$1("button", {
					type: "button",
					class: "caret-wrapper",
					"aria-label": t("el.table.sortLabel", { column: column.label || "" }),
					onClick: ($event) => handleSortClick($event, column)
				}, [h$1("i", {
					onClick: ($event) => handleSortClick($event, column, "ascending"),
					class: "sort-caret ascending"
				}), h$1("i", {
					onClick: ($event) => handleSortClick($event, column, "descending"),
					class: "sort-caret descending"
				})]),
				column.filterable && h$1(filter_panel_default, {
					store,
					placement: column.filterPlacement || "bottom-start",
					appendTo: $parent?.appendFilterPanelTo,
					column,
					upDataColumn: (key, value) => {
						column[key] = value;
					}
				}, { "filter-icon": () => column.renderFilterIcon ? column.renderFilterIcon({ filterOpened: column.filterOpened }) : null })
			])]);
		}))));
	}
});
//#endregion
//#region node_modules/element-plus/es/components/table/src/table-body/events-helper.mjs
function useEvents(props) {
	const parent = inject(TABLE_INJECTION_KEY);
	const tooltipContent = /* @__PURE__ */ ref("");
	const tooltipTrigger = /* @__PURE__ */ ref(h$1("div"));
	const handleEvent = (event, row, name) => {
		const table = parent;
		const cell = getCell(event);
		let column = null;
		const namespace = table?.vnode.el?.dataset.prefix;
		if (cell) {
			column = getColumnByCell({ columns: props.store?.states.columns.value ?? [] }, cell, namespace);
			if (column) table?.emit(`cell-${name}`, row, column, cell, event);
		}
		table?.emit(`row-${name}`, row, column, event);
	};
	const handleDoubleClick = (event, row) => {
		handleEvent(event, row, "dblclick");
	};
	const handleClick = (event, row) => {
		props.store?.commit("setCurrentRow", row);
		handleEvent(event, row, "click");
	};
	const handleContextMenu = (event, row) => {
		handleEvent(event, row, "contextmenu");
	};
	const handleMouseEnter = debounce((index) => {
		props.store?.commit("setHoverRow", index);
	}, 30);
	const handleMouseLeave = debounce(() => {
		props.store?.commit("setHoverRow", null);
	}, 30);
	const getPadding = (el) => {
		const style = window.getComputedStyle(el, null);
		return {
			left: Number.parseInt(style.paddingLeft, 10) || 0,
			right: Number.parseInt(style.paddingRight, 10) || 0,
			top: Number.parseInt(style.paddingTop, 10) || 0,
			bottom: Number.parseInt(style.paddingBottom, 10) || 0
		};
	};
	const toggleRowClassByCell = (rowSpan, event, toggle) => {
		let node = (event?.target)?.parentNode;
		while (rowSpan > 1) {
			node = node?.nextSibling;
			if (!node || node.nodeName !== "TR") break;
			toggle(node, "hover-row hover-fixed-row");
			rowSpan--;
		}
	};
	const handleCellMouseEnter = (event, row, tooltipOptions) => {
		if (!parent) return;
		const table = parent;
		const cell = getCell(event);
		const namespace = table?.vnode.el?.dataset.prefix;
		let column = null;
		if (cell) {
			column = getColumnByCell({ columns: props.store?.states.columns.value ?? [] }, cell, namespace);
			if (!column) return;
			if (cell.rowSpan > 1) toggleRowClassByCell(cell.rowSpan, event, addClass);
			const hoverState = table.hoverState = {
				cell,
				column,
				row
			};
			table?.emit("cell-mouse-enter", hoverState.row, hoverState.column, hoverState.cell, event);
		}
		if (!tooltipOptions) {
			if (removePopper?.trigger === cell) removePopper?.();
			return;
		}
		const cellChild = event.target.querySelector(".cell");
		if (!(hasClass(cellChild, `${namespace}-tooltip`) && cellChild.childNodes.length && cellChild.textContent?.trim())) return;
		const range = document.createRange();
		range.setStart(cellChild, 0);
		range.setEnd(cellChild, cellChild.childNodes.length);
		/** detail: https://github.com/element-plus/element-plus/issues/10790
		*  What went wrong?
		*  UI > Browser > Zoom, In Blink/WebKit, getBoundingClientRect() sometimes returns inexact values, probably due to lost precision during internal calculations. In the example above:
		*    - Expected: 188
		*    - Actual: 188.00000762939453
		*/
		const { width: rangeWidth, height: rangeHeight } = range.getBoundingClientRect();
		const { width: cellChildWidth, height: cellChildHeight } = cellChild.getBoundingClientRect();
		const { top, left, right, bottom } = getPadding(cellChild);
		const horizontalPadding = left + right;
		const verticalPadding = top + bottom;
		if (isGreaterThan(rangeWidth + horizontalPadding, cellChildWidth) || isGreaterThan(rangeHeight + verticalPadding, cellChildHeight) || isGreaterThan(cellChild.scrollWidth, cellChildWidth)) createTablePopper(tooltipOptions, (cell?.innerText || cell?.textContent) ?? "", row, column, cell, table);
		else if (removePopper?.trigger === cell) removePopper?.();
	};
	const handleCellMouseLeave = (event) => {
		const cell = getCell(event);
		if (!cell) return;
		if (cell.rowSpan > 1) toggleRowClassByCell(cell.rowSpan, event, removeClass);
		const oldHoverState = parent?.hoverState;
		parent?.emit("cell-mouse-leave", oldHoverState?.row, oldHoverState?.column, oldHoverState?.cell, event);
	};
	return {
		handleDoubleClick,
		handleClick,
		handleContextMenu,
		handleMouseEnter,
		handleMouseLeave,
		handleCellMouseEnter,
		handleCellMouseLeave,
		tooltipContent,
		tooltipTrigger
	};
}
//#endregion
//#region node_modules/element-plus/es/components/table/src/table-body/styles-helper.mjs
function useStyles(props) {
	const parent = inject(TABLE_INJECTION_KEY);
	const ns = useNamespace("table");
	const getRowStyle = (row, rowIndex) => {
		const rowStyle = parent?.props.rowStyle;
		if (isFunction$1(rowStyle)) return rowStyle.call(null, {
			row,
			rowIndex
		});
		return rowStyle || null;
	};
	const getRowClass = (row, rowIndex, displayIndex) => {
		const classes = [ns.e("row")];
		if (parent?.props.highlightCurrentRow && row === props.store?.states.currentRow.value) classes.push("current-row");
		if (props.stripe && displayIndex % 2 === 1) classes.push(ns.em("row", "striped"));
		const rowClassName = parent?.props.rowClassName;
		if (isString(rowClassName)) classes.push(rowClassName);
		else if (isFunction$1(rowClassName)) classes.push(rowClassName.call(null, {
			row,
			rowIndex
		}));
		return classes;
	};
	const getCellStyle = (rowIndex, columnIndex, row, column) => {
		const cellStyle = parent?.props.cellStyle;
		let cellStyles = cellStyle ?? {};
		if (isFunction$1(cellStyle)) cellStyles = cellStyle.call(null, {
			rowIndex,
			columnIndex,
			row,
			column
		});
		const fixedStyle = getFixedColumnOffset(columnIndex, props?.fixed, props.store);
		ensurePosition(fixedStyle, "left");
		ensurePosition(fixedStyle, "right");
		return Object.assign({}, cellStyles, fixedStyle);
	};
	const getCellClass = (rowIndex, columnIndex, row, column, offset) => {
		const fixedClasses = getFixedColumnsClass(ns.b(), columnIndex, props?.fixed, props.store, void 0, offset);
		const classes = [
			column.id,
			column.align,
			column.className,
			...fixedClasses
		];
		const cellClassName = parent?.props.cellClassName;
		if (isString(cellClassName)) classes.push(cellClassName);
		else if (isFunction$1(cellClassName)) classes.push(cellClassName.call(null, {
			rowIndex,
			columnIndex,
			row,
			column
		}));
		classes.push(ns.e("cell"));
		return classes.filter((className) => Boolean(className)).join(" ");
	};
	const getSpan = (row, column, rowIndex, columnIndex) => {
		let rowspan = 1;
		let colspan = 1;
		const fn = parent?.props.spanMethod;
		if (isFunction$1(fn)) {
			const result = fn({
				row,
				column,
				rowIndex,
				columnIndex
			});
			if (isArray$1(result)) {
				rowspan = result[0];
				colspan = result[1];
			} else if (isObject$2(result)) {
				rowspan = result.rowspan;
				colspan = result.colspan;
			}
		}
		return {
			rowspan,
			colspan
		};
	};
	const getColspanRealWidth = (columns, colspan, index) => {
		if (colspan < 1) return columns[index].realWidth;
		const widthArr = columns.map(({ realWidth, width }) => realWidth || width).slice(index, index + colspan);
		return Number(widthArr.reduce((acc, width) => Number(acc) + Number(width), -1));
	};
	return {
		getRowStyle,
		getRowClass,
		getCellStyle,
		getCellClass,
		getSpan,
		getColspanRealWidth
	};
}
//#endregion
//#region node_modules/element-plus/es/components/table/src/table-body/td-wrapper.vue_vue_type_script_setup_true_lang.mjs
var _hoisted_1$3 = ["colspan", "rowspan"];
//#endregion
//#region node_modules/element-plus/es/components/table/src/table-body/td-wrapper.mjs
var td_wrapper_default = /* @__PURE__ */ defineComponent({
	name: "TableTdWrapper",
	__name: "td-wrapper",
	props: {
		colspan: {
			type: Number,
			default: 1
		},
		rowspan: {
			type: Number,
			default: 1
		}
	},
	setup(__props) {
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("td", {
				colspan: __props.colspan,
				rowspan: __props.rowspan
			}, [renderSlot(_ctx.$slots, "default")], 8, _hoisted_1$3);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/table/src/table-body/render-helper.mjs
function useRender$1(props) {
	const parent = inject(TABLE_INJECTION_KEY);
	const ns = useNamespace("table");
	const { handleDoubleClick, handleClick, handleContextMenu, handleMouseEnter, handleMouseLeave, handleCellMouseEnter, handleCellMouseLeave, tooltipContent, tooltipTrigger } = useEvents(props);
	const { getRowStyle, getRowClass, getCellStyle, getCellClass, getSpan, getColspanRealWidth } = useStyles(props);
	let displayIndex = -1;
	const firstDefaultColumnIndex = computed(() => {
		return props.store?.states.columns.value.findIndex(({ type }) => type === "default");
	});
	const getKeyOfRow = (row, index) => {
		const rowKey = (parent?.props)?.rowKey;
		if (rowKey) return getRowIdentity(row, rowKey);
		return index;
	};
	const rowRender = (row, $index, treeRowData, expanded = false) => {
		const { tooltipEffect, tooltipOptions, store } = props;
		const { indent, columns } = store.states;
		const rowClasses = [];
		let display = true;
		if (treeRowData) {
			rowClasses.push(ns.em("row", `level-${treeRowData.level}`));
			display = !!treeRowData.display;
		}
		if ($index === 0) displayIndex = -1;
		if (props.stripe && display) displayIndex++;
		rowClasses.push(...getRowClass(row, $index, displayIndex));
		return h$1("tr", {
			style: [display ? null : { display: "none" }, getRowStyle(row, $index)],
			class: rowClasses,
			key: getKeyOfRow(row, $index),
			onDblclick: ($event) => handleDoubleClick($event, row),
			onClick: ($event) => handleClick($event, row),
			onContextmenu: ($event) => handleContextMenu($event, row),
			onMouseenter: () => handleMouseEnter($index),
			onMouseleave: handleMouseLeave
		}, columns.value.map((column, cellIndex) => {
			const { rowspan, colspan } = getSpan(row, column, $index, cellIndex);
			if (!rowspan || !colspan) return null;
			const columnData = Object.assign({}, column);
			columnData.realWidth = getColspanRealWidth(columns.value, colspan, cellIndex);
			const data = {
				store,
				_self: props.context || parent,
				column: columnData,
				row,
				$index,
				cellIndex,
				expanded
			};
			if (cellIndex === firstDefaultColumnIndex.value && treeRowData) {
				data.treeNode = {
					indent: treeRowData.level && treeRowData.level * indent.value,
					level: treeRowData.level
				};
				if (isBoolean(treeRowData.expanded)) {
					data.treeNode.expanded = treeRowData.expanded;
					if ("loading" in treeRowData) data.treeNode.loading = treeRowData.loading;
					if ("noLazyChildren" in treeRowData) data.treeNode.noLazyChildren = treeRowData.noLazyChildren;
				}
			}
			const baseKey = `${getKeyOfRow(row, $index)},${cellIndex}`;
			const patchKey = columnData.columnKey || columnData.rawColumnKey || "";
			const mergedTooltipOptions = column.showOverflowTooltip && merge({ effect: tooltipEffect }, tooltipOptions, column.showOverflowTooltip);
			return h$1(td_wrapper_default, {
				style: getCellStyle($index, cellIndex, row, column),
				class: getCellClass($index, cellIndex, row, column, colspan - 1),
				key: `${patchKey}${baseKey}`,
				rowspan,
				colspan,
				onMouseenter: ($event) => handleCellMouseEnter($event, row, mergedTooltipOptions),
				onMouseleave: handleCellMouseLeave
			}, { default: () => cellChildren(cellIndex, column, data) });
		}));
	};
	const cellChildren = (_cellIndex, column, data) => {
		return column.renderCell(data);
	};
	const wrappedRowRender = (row, $index) => {
		const store = props.store;
		const { isRowExpanded, assertRowKey } = store;
		const { treeData, lazyTreeNodeMap, childrenColumnName, rowKey } = store.states;
		const columns = store.states.columns.value;
		if (columns.some(({ type }) => type === "expand")) {
			const expanded = isRowExpanded(row);
			const tr = rowRender(row, $index, void 0, expanded);
			const renderExpanded = parent?.renderExpanded;
			if (!renderExpanded) {
				console.error("[Element Error]renderExpanded is required.");
				return tr;
			}
			const rows = [[tr]];
			if (parent.props.preserveExpandedContent || expanded) rows[0].push(h$1("tr", {
				key: `expanded-row__${tr.key}`,
				style: { display: expanded ? "" : "none" }
			}, [h$1("td", {
				colspan: columns.length,
				class: `${ns.e("cell")} ${ns.e("expanded-cell")}`
			}, [renderExpanded({
				row,
				$index,
				store,
				expanded
			})])]));
			return rows;
		} else if (Object.keys(treeData.value).length) {
			assertRowKey();
			const key = getRowIdentity(row, rowKey.value);
			let cur = treeData.value[key];
			let treeRowData = null;
			if (cur) {
				treeRowData = {
					expanded: cur.expanded,
					level: cur.level,
					display: true,
					noLazyChildren: void 0,
					loading: void 0
				};
				if (isBoolean(cur.lazy)) {
					if (treeRowData && isBoolean(cur.loaded) && cur.loaded) treeRowData.noLazyChildren = !(cur.children && cur.children.length);
					treeRowData.loading = cur.loading;
				}
			}
			const tmp = [rowRender(row, $index, treeRowData ?? void 0)];
			if (cur) {
				let i = 0;
				const traverse = (children, parent) => {
					if (!(children && children.length && parent)) return;
					children.forEach((node) => {
						const innerTreeRowData = {
							display: parent.display && parent.expanded,
							level: parent.level + 1,
							expanded: false,
							noLazyChildren: false,
							loading: false
						};
						const childKey = getRowIdentity(node, rowKey.value);
						if (isPropAbsent(childKey)) throw new Error("For nested data item, row-key is required.");
						cur = { ...treeData.value[childKey] };
						if (cur) {
							innerTreeRowData.expanded = cur.expanded;
							cur.level = cur.level || innerTreeRowData.level;
							cur.display = !!(cur.expanded && innerTreeRowData.display);
							if (isBoolean(cur.lazy)) {
								if (isBoolean(cur.loaded) && cur.loaded) innerTreeRowData.noLazyChildren = !(cur.children && cur.children.length);
								innerTreeRowData.loading = cur.loading;
							}
						}
						i++;
						tmp.push(rowRender(node, $index + i, innerTreeRowData));
						if (cur) traverse(lazyTreeNodeMap.value[childKey] || node[childrenColumnName.value], cur);
					});
				};
				cur.display = true;
				traverse(lazyTreeNodeMap.value[key] || row[childrenColumnName.value], cur);
			}
			return tmp;
		} else return rowRender(row, $index, void 0);
	};
	return {
		wrappedRowRender,
		tooltipContent,
		tooltipTrigger
	};
}
//#endregion
//#region node_modules/element-plus/es/components/table/src/table-body/index.mjs
var table_body_default = /* @__PURE__ */ defineComponent({
	name: "ElTableBody",
	props: {
		store: {
			required: true,
			type: Object
		},
		stripe: Boolean,
		tooltipEffect: String,
		tooltipOptions: { type: Object },
		context: {
			default: () => ({}),
			type: Object
		},
		rowClassName: [String, Function],
		rowStyle: [Object, Function],
		fixed: {
			type: String,
			default: ""
		},
		highlight: Boolean
	},
	setup(props) {
		const instance = getCurrentInstance();
		const parent = inject(TABLE_INJECTION_KEY);
		const ns = useNamespace("table");
		const { wrappedRowRender, tooltipContent, tooltipTrigger } = useRender$1(props);
		const { onColumnsChange, onScrollableChange } = useLayoutObserver(parent);
		const hoveredCellList = [];
		watch(props.store?.states.hoverRow, (newVal, oldVal) => {
			const el = instance?.vnode.el;
			const rows = Array.from(el?.children || []).filter((e) => e?.classList.contains(`${ns.e("row")}`));
			let rowNum = newVal;
			const childNodes = rows[rowNum]?.childNodes;
			if (childNodes?.length) {
				let control = 0;
				Array.from(childNodes).reduce((acc, item, index) => {
					if (childNodes[index]?.colSpan > 1) control = childNodes[index]?.colSpan;
					if (item.nodeName !== "TD" && control === 0) acc.push(index);
					control > 0 && control--;
					return acc;
				}, []).forEach((rowIndex) => {
					rowNum = newVal;
					while (rowNum > 0) {
						const preChildNodes = rows[rowNum - 1]?.childNodes;
						if (preChildNodes[rowIndex] && preChildNodes[rowIndex].nodeName === "TD" && preChildNodes[rowIndex].rowSpan > 1) {
							addClass(preChildNodes[rowIndex], "hover-cell");
							hoveredCellList.push(preChildNodes[rowIndex]);
							break;
						}
						rowNum--;
					}
				});
			} else {
				hoveredCellList.forEach((item) => removeClass(item, "hover-cell"));
				hoveredCellList.length = 0;
			}
			if (!props.store?.states.isComplex.value || !isClient) return;
			rAF(() => {
				const oldRow = rows[oldVal];
				const newRow = rows[newVal];
				if (oldRow && !oldRow.classList.contains("hover-fixed-row")) removeClass(oldRow, "hover-row");
				if (newRow) addClass(newRow, "hover-row");
			});
		});
		onUnmounted(() => {
			removePopper?.();
		});
		return {
			ns,
			onColumnsChange,
			onScrollableChange,
			wrappedRowRender,
			tooltipContent,
			tooltipTrigger
		};
	},
	render() {
		const { wrappedRowRender, store } = this;
		return h$1("tbody", { tabIndex: -1 }, [(store?.states.data.value || []).reduce((acc, row) => {
			return acc.concat(wrappedRowRender(row, acc.length));
		}, [])]);
	}
});
//#endregion
//#region node_modules/element-plus/es/components/table/src/table-footer/mapState-helper.mjs
function useMapState() {
	const store = inject(TABLE_INJECTION_KEY)?.store;
	return {
		leftFixedLeafCount: computed(() => {
			return store?.states.fixedLeafColumnsLength.value ?? 0;
		}),
		rightFixedLeafCount: computed(() => {
			return store?.states.rightFixedColumns.value.length ?? 0;
		}),
		columnsCount: computed(() => {
			return store?.states.columns.value.length ?? 0;
		}),
		leftFixedCount: computed(() => {
			return store?.states.fixedColumns.value.length ?? 0;
		}),
		rightFixedCount: computed(() => {
			return store?.states.rightFixedColumns.value.length ?? 0;
		}),
		columns: computed(() => store?.states.columns.value ?? [])
	};
}
//#endregion
//#region node_modules/element-plus/es/components/table/src/table-footer/style-helper.mjs
function useStyle$1(props) {
	const { columns } = useMapState();
	const ns = useNamespace("table");
	const getCellClasses = (columns, cellIndex) => {
		const column = columns[cellIndex];
		const classes = [
			ns.e("cell"),
			column.id,
			column.align,
			column.labelClassName,
			...getFixedColumnsClass(ns.b(), cellIndex, column.fixed, props.store)
		];
		if (column.className) classes.push(column.className);
		if (!column.children) classes.push(ns.is("leaf"));
		return classes;
	};
	const getCellStyles = (column, cellIndex) => {
		const fixedStyle = getFixedColumnOffset(cellIndex, column.fixed, props.store);
		ensurePosition(fixedStyle, "left");
		ensurePosition(fixedStyle, "right");
		return fixedStyle;
	};
	return {
		getCellClasses,
		getCellStyles,
		columns
	};
}
//#endregion
//#region node_modules/element-plus/es/components/table/src/table-footer/index.mjs
var table_footer_default = /* @__PURE__ */ defineComponent({
	name: "ElTableFooter",
	props: {
		fixed: {
			type: String,
			default: ""
		},
		store: {
			required: true,
			type: Object
		},
		summaryMethod: Function,
		sumText: String,
		border: Boolean,
		defaultSort: {
			type: Object,
			default: () => {
				return {
					prop: "",
					order: ""
				};
			}
		}
	},
	setup(props) {
		const parent = inject(TABLE_INJECTION_KEY);
		const ns = useNamespace("table");
		const { getCellClasses, getCellStyles, columns } = useStyle$1(props);
		const { onScrollableChange, onColumnsChange } = useLayoutObserver(parent);
		return {
			ns,
			onScrollableChange,
			onColumnsChange,
			getCellClasses,
			getCellStyles,
			columns
		};
	},
	render() {
		const { columns, getCellStyles, getCellClasses, summaryMethod, sumText } = this;
		const data = this.store.states.data.value;
		let sums = [];
		if (summaryMethod) sums = summaryMethod({
			columns,
			data
		});
		else columns.forEach((column, index) => {
			if (index === 0) {
				sums[index] = sumText;
				return;
			}
			const values = data.map((item) => Number(item[column.property]));
			const precisions = [];
			let notNumber = true;
			values.forEach((value) => {
				if (!Number.isNaN(+value)) {
					notNumber = false;
					const decimal = `${value}`.split(".")[1];
					precisions.push(decimal ? decimal.length : 0);
				}
			});
			const precision = Math.max.apply(null, precisions);
			if (!notNumber) sums[index] = values.reduce((prev, curr) => {
				const value = Number(curr);
				if (!Number.isNaN(+value)) return Number.parseFloat((prev + curr).toFixed(Math.min(precision, 20)));
				else return prev;
			}, 0);
			else sums[index] = "";
		});
		return h$1(h$1("tfoot", [h$1("tr", {}, [...columns.map((column, cellIndex) => h$1("td", {
			key: cellIndex,
			colspan: column.colSpan,
			rowspan: column.rowSpan,
			class: getCellClasses(columns, cellIndex),
			style: getCellStyles(column, cellIndex)
		}, [h$1("div", { class: ["cell", column.labelClassName] }, [sums[cellIndex]])]))])]));
	}
});
//#endregion
//#region node_modules/element-plus/es/components/table/src/table/utils-helper.mjs
function useUtils(store) {
	const setCurrentRow = (row) => {
		store.commit("setCurrentRow", row);
	};
	const getSelectionRows = () => {
		return store.getSelectionRows();
	};
	const getHalfSelectionRows = () => {
		return store.getHalfSelectionRows();
	};
	const toggleRowSelection = (row, selected, ignoreSelectable = true) => {
		store.toggleRowSelection(row, selected, false, ignoreSelectable);
		store.updateAllSelected();
	};
	const clearSelection = () => {
		store.clearSelection();
	};
	const clearFilter = (columnKeys) => {
		store.clearFilter(columnKeys);
	};
	const toggleAllSelection = () => {
		store.commit("toggleAllSelection");
	};
	const toggleRowExpansion = (row, expanded) => {
		store.toggleRowExpansionAdapter(row, expanded);
	};
	const clearSort = () => {
		store.clearSort();
	};
	const sort = (prop, order) => {
		store.commit("sort", {
			prop,
			order
		});
	};
	const updateKeyChildren = (key, data) => {
		store.updateKeyChildren(key, data);
	};
	return {
		setCurrentRow,
		getSelectionRows,
		getHalfSelectionRows,
		toggleRowSelection,
		clearSelection,
		clearFilter,
		toggleAllSelection,
		toggleRowExpansion,
		clearSort,
		sort,
		updateKeyChildren
	};
}
//#endregion
//#region node_modules/element-plus/es/components/table/src/table/style-helper.mjs
function useStyle(props, layout, store, table) {
	const isHidden = /* @__PURE__ */ ref(false);
	const renderExpanded = /* @__PURE__ */ ref(null);
	const resizeProxyVisible = /* @__PURE__ */ ref(false);
	const setDragVisible = (visible) => {
		resizeProxyVisible.value = visible;
	};
	const resizeState = /* @__PURE__ */ ref({
		width: null,
		height: null,
		headerHeight: null
	});
	const isGroup = /* @__PURE__ */ ref(false);
	const scrollbarViewStyle = {
		display: "inline-block",
		verticalAlign: "middle"
	};
	const tableWidth = /* @__PURE__ */ ref();
	const tableScrollHeight = /* @__PURE__ */ ref(0);
	const bodyScrollHeight = /* @__PURE__ */ ref(0);
	const headerScrollHeight = /* @__PURE__ */ ref(0);
	const footerScrollHeight = /* @__PURE__ */ ref(0);
	const appendScrollHeight = /* @__PURE__ */ ref(0);
	watch(() => props.height, (value) => {
		layout.setHeight(value ?? null);
	}, { immediate: true });
	watch(() => props.maxHeight, (value) => {
		layout.setMaxHeight(value ?? null);
	}, { immediate: true });
	watch(() => [props.currentRowKey, store.states.rowKey], ([currentRowKey, rowKey]) => {
		if (!unref(rowKey) || !unref(currentRowKey)) return;
		store.setCurrentRowKey(`${currentRowKey}`);
	}, { immediate: true });
	watch(() => props.data, (data) => {
		table.store.commit("setData", data);
	}, {
		immediate: true,
		deep: true
	});
	watchEffect(() => {
		if (props.expandRowKeys) store.setExpandRowKeysAdapter(props.expandRowKeys);
	});
	const handleMouseLeave = () => {
		table.store.commit("setHoverRow", null);
		if (table.hoverState) table.hoverState = null;
	};
	const handleHeaderFooterMousewheel = (_event, data) => {
		const { pixelX, pixelY } = data;
		if (Math.abs(pixelX) >= Math.abs(pixelY)) table.refs.bodyWrapper.scrollLeft += data.pixelX / 5;
	};
	const shouldUpdateHeight = computed(() => {
		return props.height || props.maxHeight || store.states.fixedColumns.value.length > 0 || store.states.rightFixedColumns.value.length > 0;
	});
	const tableBodyStyles = computed(() => {
		return { width: layout.bodyWidth.value ? `${layout.bodyWidth.value}px` : "" };
	});
	const doLayout = () => {
		if (shouldUpdateHeight.value) layout.updateElsHeight();
		layout.updateColumnsWidth();
		if (typeof window === "undefined") return;
		requestAnimationFrame(syncPosition);
	};
	onMounted(async () => {
		await nextTick();
		store.updateColumns();
		bindEvents();
		requestAnimationFrame(doLayout);
		const el = table.vnode.el;
		const tableHeader = table.refs.headerWrapper;
		if (props.flexible && el && el.parentElement) el.parentElement.style.minWidth = "0";
		resizeState.value = {
			width: tableWidth.value = el.offsetWidth,
			height: el.offsetHeight,
			headerHeight: props.showHeader && tableHeader ? tableHeader.offsetHeight : null
		};
		store.states.columns.value.forEach((column) => {
			if (column.filteredValue && column.filteredValue.length) table.store.commit("filterChange", {
				column,
				values: column.filteredValue,
				silent: true
			});
		});
		table.$ready = true;
	});
	const setScrollClassByEl = (el, className) => {
		if (!el) return;
		const classList = Array.from(el.classList).filter((item) => !item.startsWith("is-scrolling-"));
		classList.push(layout.scrollX.value ? className : "is-scrolling-none");
		el.className = classList.join(" ");
	};
	const setScrollClass = (className) => {
		const { tableWrapper } = table.refs;
		setScrollClassByEl(tableWrapper, className);
	};
	const hasScrollClass = (className) => {
		const { tableWrapper } = table.refs;
		return !!(tableWrapper && tableWrapper.classList.contains(className));
	};
	const syncPosition = function() {
		if (!table.refs.scrollBarRef) return;
		if (!layout.scrollX.value) {
			const scrollingNoneClass = "is-scrolling-none";
			if (!hasScrollClass(scrollingNoneClass)) setScrollClass(scrollingNoneClass);
			return;
		}
		const scrollContainer = table.refs.scrollBarRef.wrapRef;
		if (!scrollContainer) return;
		const { scrollLeft, offsetWidth, scrollWidth } = scrollContainer;
		const { headerWrapper, footerWrapper } = table.refs;
		if (headerWrapper) headerWrapper.scrollLeft = scrollLeft;
		if (footerWrapper) footerWrapper.scrollLeft = scrollLeft;
		if (scrollLeft >= scrollWidth - offsetWidth - 1) setScrollClass("is-scrolling-right");
		else if (scrollLeft === 0) setScrollClass("is-scrolling-left");
		else setScrollClass("is-scrolling-middle");
	};
	const bindEvents = () => {
		if (!table.refs.scrollBarRef) return;
		if (table.refs.scrollBarRef.wrapRef) useEventListener(table.refs.scrollBarRef.wrapRef, "scroll", syncPosition, { passive: true });
		if (props.fit) useResizeObserver(table.vnode.el, resizeListener);
		else useEventListener(window, "resize", resizeListener);
		useResizeObserver(table.refs.tableInnerWrapper, () => {
			resizeListener();
			table.refs?.scrollBarRef?.update();
		});
	};
	const resizeListener = () => {
		const el = table.vnode.el;
		if (!table.$ready || !el) return;
		let shouldUpdateLayout = false;
		const { width: oldWidth, height: oldHeight, headerHeight: oldHeaderHeight } = resizeState.value;
		const width = tableWidth.value = el.offsetWidth;
		if (oldWidth !== width) shouldUpdateLayout = true;
		const height = el.offsetHeight;
		if ((props.height || shouldUpdateHeight.value) && oldHeight !== height) shouldUpdateLayout = true;
		const tableHeader = props.tableLayout === "fixed" ? table.refs.headerWrapper : table.refs.tableHeaderRef?.$el;
		if (props.showHeader && tableHeader?.offsetHeight !== oldHeaderHeight) shouldUpdateLayout = true;
		tableScrollHeight.value = table.refs.tableWrapper?.scrollHeight || 0;
		headerScrollHeight.value = tableHeader?.scrollHeight || 0;
		footerScrollHeight.value = table.refs.footerWrapper?.offsetHeight || 0;
		appendScrollHeight.value = table.refs.appendWrapper?.offsetHeight || 0;
		bodyScrollHeight.value = tableScrollHeight.value - headerScrollHeight.value - footerScrollHeight.value - appendScrollHeight.value;
		if (shouldUpdateLayout) {
			resizeState.value = {
				width,
				height,
				headerHeight: props.showHeader && tableHeader?.offsetHeight || 0
			};
			doLayout();
		}
	};
	const tableSize = useFormSize();
	const bodyWidth = computed(() => {
		const { bodyWidth: bodyWidth_, scrollY, gutterWidth } = layout;
		return bodyWidth_.value ? `${bodyWidth_.value - (scrollY.value ? gutterWidth : 0)}px` : "";
	});
	const tableLayout = computed(() => {
		if (props.maxHeight) return "fixed";
		return props.tableLayout;
	});
	return {
		isHidden,
		renderExpanded,
		setDragVisible,
		isGroup,
		handleMouseLeave,
		handleHeaderFooterMousewheel,
		tableSize,
		emptyBlockStyle: computed(() => {
			if (props.data && props.data.length) return;
			let height = "100%";
			if (props.height && bodyScrollHeight.value) height = `${bodyScrollHeight.value}px`;
			const width = tableWidth.value;
			return {
				width: width ? `${width}px` : "",
				height
			};
		}),
		resizeProxyVisible,
		bodyWidth,
		resizeState,
		doLayout,
		tableBodyStyles,
		tableLayout,
		scrollbarViewStyle,
		scrollbarStyle: computed(() => {
			if (props.height) return { height: "100%" };
			if (props.maxHeight) if (!Number.isNaN(Number(props.maxHeight))) return { maxHeight: `${+props.maxHeight - headerScrollHeight.value - footerScrollHeight.value}px` };
			else return { maxHeight: `calc(${props.maxHeight} - ${headerScrollHeight.value + footerScrollHeight.value}px)` };
			return {};
		})
	};
}
//#endregion
//#region node_modules/element-plus/es/components/table/src/table/key-render-helper.mjs
function useKeyRender(table) {
	let observer;
	const initWatchDom = () => {
		const columnsWrapper = table.vnode.el.querySelector(".hidden-columns");
		const config = {
			childList: true,
			subtree: true
		};
		const updateOrderFns = table.store.states.updateOrderFns;
		observer = new MutationObserver(() => {
			updateOrderFns.forEach((fn) => fn());
		});
		observer.observe(columnsWrapper, config);
	};
	onMounted(() => {
		initWatchDom();
	});
	onUnmounted(() => {
		observer?.disconnect();
	});
}
//#endregion
//#region node_modules/element-plus/es/components/table/src/h-helper.mjs
function hColgroup(props) {
	const isAuto = props.tableLayout === "auto";
	let columns = props.columns || [];
	if (isAuto) {
		if (columns.every(({ width }) => isUndefined(width))) columns = [];
	}
	const getPropsData = (column) => {
		const propsData = {
			key: `${props.tableLayout}_${column.id}`,
			style: {},
			name: void 0
		};
		if (isAuto) propsData.style = { width: `${column.width}px` };
		else propsData.name = column.id;
		return propsData;
	};
	return h$1("colgroup", {}, columns.map((column) => h$1("col", getPropsData(column))));
}
hColgroup.props = ["columns", "tableLayout"];
//#endregion
//#region node_modules/element-plus/es/components/table/src/composables/use-scrollbar.mjs
var useScrollbar = () => {
	const scrollBarRef = /* @__PURE__ */ ref();
	const scrollTo = (options, yCoord) => {
		const scrollbar = scrollBarRef.value;
		if (scrollbar) scrollbar.scrollTo(options, yCoord);
	};
	const setScrollPosition = (position, offset) => {
		const scrollbar = scrollBarRef.value;
		if (scrollbar && isNumber(offset) && ["Top", "Left"].includes(position)) scrollbar[`setScroll${position}`](offset);
	};
	const setScrollTop = (top) => setScrollPosition("Top", top);
	const setScrollLeft = (left) => setScrollPosition("Left", left);
	return {
		scrollBarRef,
		scrollTo,
		setScrollTop,
		setScrollLeft
	};
};
//#endregion
//#region node_modules/element-plus/es/components/table/src/table.vue_vue_type_script_setup_true_lang.mjs
var _hoisted_1$2 = ["data-prefix"];
var _hoisted_2$2 = {
	ref: "hiddenColumns",
	class: "hidden-columns"
};
//#endregion
//#region node_modules/element-plus/es/components/table/src/table.mjs
var table_default = /* @__PURE__ */ defineComponent({
	name: "ElTable",
	__name: "table",
	props: tableProps,
	emits: [
		"select",
		"select-all",
		"selection-change",
		"cell-mouse-enter",
		"cell-mouse-leave",
		"cell-dblclick",
		"cell-contextmenu",
		"cell-click",
		"row-dblclick",
		"row-click",
		"row-contextmenu",
		"header-click",
		"header-contextmenu",
		"sort-change",
		"filter-change",
		"current-change",
		"header-dragend",
		"expand-change",
		"scroll"
	],
	setup(__props, { expose: __expose }) {
		const props = __props;
		const { t } = useLocale();
		const ns = useNamespace("table");
		const globalConfig = useGlobalConfig("table");
		const table = getCurrentInstance();
		provide(TABLE_INJECTION_KEY, table);
		const store = createStore(table, props);
		table.store = store;
		const layout = new TableLayout({
			store: table.store,
			table,
			fit: props.fit,
			showHeader: props.showHeader
		});
		table.layout = layout;
		const isEmpty = computed(() => (store.states.data.value || []).length === 0);
		/**
		* open functions
		*/
		const { setCurrentRow, getSelectionRows, getHalfSelectionRows, toggleRowSelection, clearSelection, clearFilter, toggleAllSelection, toggleRowExpansion, clearSort, sort, updateKeyChildren } = useUtils(store);
		const { isHidden, renderExpanded, setDragVisible, isGroup, handleMouseLeave, handleHeaderFooterMousewheel, tableSize, emptyBlockStyle, resizeProxyVisible, bodyWidth, resizeState, doLayout, tableBodyStyles, tableLayout, scrollbarViewStyle, scrollbarStyle } = useStyle(props, layout, store, table);
		const { scrollBarRef, scrollTo, setScrollLeft, setScrollTop } = useScrollbar();
		const debouncedUpdateLayout = debounce(doLayout, 50);
		const tableId = createTableId(ns.namespace.value);
		const context = table;
		table.tableId = tableId;
		table.state = {
			isGroup,
			resizeState,
			doLayout,
			debouncedUpdateLayout
		};
		const computedSumText = computed(() => props.sumText ?? t("el.table.sumText"));
		const computedEmptyText = computed(() => {
			return props.emptyText ?? t("el.table.emptyText");
		});
		const computedTooltipEffect = computed(() => props.tooltipEffect ?? globalConfig.value?.tooltipEffect);
		const computedTooltipOptions = computed(() => props.tooltipOptions ?? globalConfig.value?.tooltipOptions);
		const columns = computed(() => {
			return convertToRows(store.states.originColumns.value)[0];
		});
		useKeyRender(table);
		onBeforeUnmount(() => {
			debouncedUpdateLayout.cancel();
		});
		__expose({
			ns,
			layout,
			store,
			columns,
			handleHeaderFooterMousewheel,
			handleMouseLeave,
			tableId,
			tableSize,
			isHidden,
			isEmpty,
			renderExpanded,
			resizeProxyVisible,
			resizeState,
			isGroup,
			bodyWidth,
			tableBodyStyles,
			emptyBlockStyle,
			debouncedUpdateLayout,
			/**
			* @description used in single selection Table, set a certain row selected. If called without any parameter, it will clear selection
			*/
			setCurrentRow,
			/**
			* @description returns the currently selected rows
			*/
			getSelectionRows,
			/**
			* @description returns the currently half-selected rows
			*/
			getHalfSelectionRows,
			/**
			* @description used in multiple selection Table, toggle if a certain row is selected. With the second parameter, you can directly set if this row is selected
			*/
			toggleRowSelection,
			/**
			* @description used in multiple selection Table, clear user selection
			*/
			clearSelection,
			/**
			* @description clear filters of the columns whose `columnKey` are passed in. If no params, clear all filters
			*/
			clearFilter,
			/**
			* @description used in multiple selection Table, toggle select all and deselect all
			*/
			toggleAllSelection,
			/**
			* @description used in expandable Table or tree Table, toggle if a certain row is expanded. With the second parameter, you can directly set if this row is expanded or collapsed
			*/
			toggleRowExpansion,
			/**
			* @description clear sorting, restore data to the original order
			*/
			clearSort,
			/**
			* @description refresh the layout of Table. When the visibility of Table changes, you may need to call this method to get a correct layout
			*/
			doLayout,
			/**
			* @description sort Table manually. Property `prop` is used to set sort column, property `order` is used to set sort order
			*/
			sort,
			/**
			* @description used in lazy Table, must set `rowKey`, update key children
			*/
			updateKeyChildren,
			t,
			setDragVisible,
			context,
			computedSumText,
			computedEmptyText,
			computedTooltipEffect,
			computedTooltipOptions,
			tableLayout,
			scrollbarViewStyle,
			scrollbarStyle,
			scrollBarRef,
			/**
			* @description scrolls to a particular set of coordinates
			*/
			scrollTo,
			/**
			* @description set horizontal scroll position
			*/
			setScrollLeft,
			/**
			* @description set vertical scroll position
			*/
			setScrollTop,
			/**
			* @description whether to allow drag the last column
			*/
			allowDragLastColumn: props.allowDragLastColumn
		});
		return (_ctx, _cache) => {
			return openBlock(), createElementBlock("div", {
				ref: "tableWrapper",
				class: normalizeClass([
					{
						[unref(ns).m("fit")]: __props.fit,
						[unref(ns).m("striped")]: __props.stripe,
						[unref(ns).m("border")]: __props.border || unref(isGroup),
						[unref(ns).m("hidden")]: unref(isHidden),
						[unref(ns).m("group")]: unref(isGroup),
						[unref(ns).m("fluid-height")]: __props.maxHeight,
						[unref(ns).m("scrollable-x")]: unref(layout).scrollX.value,
						[unref(ns).m("scrollable-y")]: unref(layout).scrollY.value,
						[unref(ns).m("enable-row-hover")]: !unref(store).states.isComplex.value,
						[unref(ns).m("enable-row-transition")]: (unref(store).states.data.value || []).length !== 0 && (unref(store).states.data.value || []).length < 100,
						"has-footer": __props.showSummary
					},
					unref(ns).m(unref(tableSize)),
					__props.className,
					unref(ns).b(),
					unref(ns).m(`layout-${unref(tableLayout)}`)
				]),
				style: normalizeStyle(__props.style),
				"data-prefix": unref(ns).namespace.value,
				onMouseleave: _cache[1] || (_cache[1] = (...args) => unref(handleMouseLeave) && unref(handleMouseLeave)(...args))
			}, [createBaseVNode("div", {
				ref: "tableInnerWrapper",
				class: normalizeClass(unref(ns).e("inner-wrapper"))
			}, [
				createBaseVNode("div", _hoisted_2$2, [renderSlot(_ctx.$slots, "default")], 512),
				__props.showHeader && unref(tableLayout) === "fixed" ? withDirectives((openBlock(), createElementBlock("div", {
					key: 0,
					ref: "headerWrapper",
					class: normalizeClass(unref(ns).e("header-wrapper"))
				}, [createBaseVNode("table", {
					ref: "tableHeader",
					class: normalizeClass(unref(ns).e("header")),
					style: normalizeStyle(unref(tableBodyStyles)),
					border: "0",
					cellpadding: "0",
					cellspacing: "0"
				}, [createVNode(unref(hColgroup), {
					columns: unref(store).states.columns.value,
					"table-layout": unref(tableLayout)
				}, null, 8, ["columns", "table-layout"]), createVNode(unref(table_header_default), {
					ref: "tableHeaderRef",
					border: __props.border,
					"default-sort": __props.defaultSort,
					store: unref(store),
					"append-filter-panel-to": __props.appendFilterPanelTo,
					"allow-drag-last-column": __props.allowDragLastColumn,
					onSetDragVisible: unref(setDragVisible)
				}, null, 8, [
					"border",
					"default-sort",
					"store",
					"append-filter-panel-to",
					"allow-drag-last-column",
					"onSetDragVisible"
				])], 6)], 2)), [[unref(Mousewheel), unref(handleHeaderFooterMousewheel)]]) : createCommentVNode("v-if", true),
				createBaseVNode("div", {
					ref: "bodyWrapper",
					class: normalizeClass(unref(ns).e("body-wrapper"))
				}, [createVNode(unref(ElScrollbar), {
					ref_key: "scrollBarRef",
					ref: scrollBarRef,
					"view-style": unref(scrollbarViewStyle),
					"wrap-style": unref(scrollbarStyle),
					always: __props.scrollbarAlwaysOn,
					tabindex: __props.scrollbarTabindex,
					native: __props.nativeScrollbar,
					onScroll: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("scroll", $event))
				}, {
					default: withCtx(() => [
						createBaseVNode("table", {
							ref: "tableBody",
							class: normalizeClass(unref(ns).e("body")),
							cellspacing: "0",
							cellpadding: "0",
							border: "0",
							style: normalizeStyle({
								width: unref(bodyWidth),
								tableLayout: unref(tableLayout)
							})
						}, [
							createVNode(unref(hColgroup), {
								columns: unref(store).states.columns.value,
								"table-layout": unref(tableLayout)
							}, null, 8, ["columns", "table-layout"]),
							__props.showHeader && unref(tableLayout) === "auto" ? (openBlock(), createBlock(unref(table_header_default), {
								key: 0,
								ref: "tableHeaderRef",
								class: normalizeClass(unref(ns).e("body-header")),
								border: __props.border,
								"default-sort": __props.defaultSort,
								store: unref(store),
								"append-filter-panel-to": __props.appendFilterPanelTo,
								onSetDragVisible: unref(setDragVisible)
							}, null, 8, [
								"class",
								"border",
								"default-sort",
								"store",
								"append-filter-panel-to",
								"onSetDragVisible"
							])) : createCommentVNode("v-if", true),
							createVNode(unref(table_body_default), {
								context: unref(context),
								highlight: __props.highlightCurrentRow,
								"row-class-name": __props.rowClassName,
								"tooltip-effect": computedTooltipEffect.value,
								"tooltip-options": computedTooltipOptions.value,
								"row-style": __props.rowStyle,
								store: unref(store),
								stripe: __props.stripe
							}, null, 8, [
								"context",
								"highlight",
								"row-class-name",
								"tooltip-effect",
								"tooltip-options",
								"row-style",
								"store",
								"stripe"
							]),
							__props.showSummary && unref(tableLayout) === "auto" ? (openBlock(), createBlock(unref(table_footer_default), {
								key: 1,
								class: normalizeClass(unref(ns).e("body-footer")),
								border: __props.border,
								"default-sort": __props.defaultSort,
								store: unref(store),
								"sum-text": computedSumText.value,
								"summary-method": __props.summaryMethod
							}, null, 8, [
								"class",
								"border",
								"default-sort",
								"store",
								"sum-text",
								"summary-method"
							])) : createCommentVNode("v-if", true)
						], 6),
						isEmpty.value ? (openBlock(), createElementBlock("div", {
							key: 0,
							ref: "emptyBlock",
							style: normalizeStyle(unref(emptyBlockStyle)),
							class: normalizeClass(unref(ns).e("empty-block"))
						}, [createBaseVNode("span", { class: normalizeClass(unref(ns).e("empty-text")) }, [renderSlot(_ctx.$slots, "empty", {}, () => [createTextVNode(toDisplayString(computedEmptyText.value), 1)])], 2)], 6)) : createCommentVNode("v-if", true),
						_ctx.$slots.append ? (openBlock(), createElementBlock("div", {
							key: 1,
							ref: "appendWrapper",
							class: normalizeClass(unref(ns).e("append-wrapper"))
						}, [renderSlot(_ctx.$slots, "append")], 2)) : createCommentVNode("v-if", true)
					]),
					_: 3
				}, 8, [
					"view-style",
					"wrap-style",
					"always",
					"tabindex",
					"native"
				])], 2),
				__props.showSummary && unref(tableLayout) === "fixed" ? withDirectives((openBlock(), createElementBlock("div", {
					key: 1,
					ref: "footerWrapper",
					class: normalizeClass(unref(ns).e("footer-wrapper"))
				}, [createBaseVNode("table", {
					class: normalizeClass(unref(ns).e("footer")),
					cellspacing: "0",
					cellpadding: "0",
					border: "0",
					style: normalizeStyle(unref(tableBodyStyles))
				}, [createVNode(unref(hColgroup), {
					columns: unref(store).states.columns.value,
					"table-layout": unref(tableLayout)
				}, null, 8, ["columns", "table-layout"]), createVNode(unref(table_footer_default), {
					border: __props.border,
					"default-sort": __props.defaultSort,
					store: unref(store),
					"sum-text": computedSumText.value,
					"summary-method": __props.summaryMethod
				}, null, 8, [
					"border",
					"default-sort",
					"store",
					"sum-text",
					"summary-method"
				])], 6)], 2)), [[vShow, !isEmpty.value], [unref(Mousewheel), unref(handleHeaderFooterMousewheel)]]) : createCommentVNode("v-if", true),
				__props.border || unref(isGroup) ? (openBlock(), createElementBlock("div", {
					key: 2,
					class: normalizeClass(unref(ns).e("border-left-patch"))
				}, null, 2)) : createCommentVNode("v-if", true)
			], 2), withDirectives(createBaseVNode("div", {
				ref: "resizeProxy",
				class: normalizeClass(unref(ns).e("column-resize-proxy"))
			}, null, 2), [[vShow, unref(resizeProxyVisible)]])], 46, _hoisted_1$2);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/table/src/table-column/defaults.mjs
/**
* @deprecated Removed after 3.0.0, Use `TableColumnProps` instead.
*/
var tableColumnProps = {
	/**
	* @description type of the column. If set to `selection`, the column will display checkbox. If set to `index`, the column will display index of the row (staring from 1). If set to `expand`, the column will display expand icon
	*/
	type: {
		type: String,
		default: "default"
	},
	/**
	* @description column label
	*/
	label: String,
	/**
	* @description class name of cells in the column
	*/
	className: String,
	/**
	* @description class name of the label of this column
	*/
	labelClassName: String,
	/**
	* @description
	*/
	property: String,
	/**
	* @description field name. You can also use its alias: `property`
	*/
	prop: String,
	/**
	* @description column width
	*/
	width: {
		type: [String, Number],
		default: ""
	},
	/**
	* @description column minimum width. Columns with `width` has a fixed width, while columns with `min-width` has a width that is distributed in proportion
	*/
	minWidth: {
		type: [String, Number],
		default: ""
	},
	/**
	* @description render function for table header of this column
	*/
	renderHeader: Function,
	/**
	* @description whether column can be sorted. Remote sorting can be done by setting this attribute to 'custom' and listening to the `sort-change` event of Table
	*/
	sortable: {
		type: [Boolean, String],
		default: false
	},
	/**
	* @description sorting method, works when `sortable` is `true`. Should return a number, just like Array.sort
	*/
	sortMethod: Function,
	/**
	* @description specify which property to sort by, works when `sortable` is `true` and `sort-method` is `undefined`. If set to an Array, the column will sequentially sort by the next property if the previous one is equal
	*/
	sortBy: [
		String,
		Function,
		Array
	],
	/**
	* @description whether column width can be resized, works when `border` of `el-table` is `true`
	*/
	resizable: {
		type: Boolean,
		default: true
	},
	/**
	* @description column's key. If you need to use the filter-change event, you need this attribute to identify which column is being filtered
	*/
	columnKey: String,
	/**
	* @description alignment, the value should be 'left' \/ 'center' \/ 'right'
	*/
	align: String,
	/**
	* @description alignment of the table header. If omitted, the value of the above `align` attribute will be applied, the value should be 'left' \/ 'center' \/ 'right'
	*/
	headerAlign: String,
	/**
	* @description whether to hide extra content and show them in a tooltip when hovering on the cell
	*/
	showOverflowTooltip: {
		type: [Boolean, Object],
		default: void 0
	},
	/**
	* @description function that formats cell tooltip content, works when `show-overflow-tooltip` is `true`
	*/
	tooltipFormatter: Function,
	/**
	* @description whether column is fixed at left / right. Will be fixed at left if `true`
	*/
	fixed: [Boolean, String],
	/**
	* @description function that formats cell content
	*/
	formatter: Function,
	/**
	* @description function that determines if a certain row can be selected, works when `type` is 'selection'
	*/
	selectable: Function,
	/**
	* @description whether to reserve selection after data refreshing, works when `type` is 'selection'. Note that `row-key` is required for this to work
	*/
	reserveSelection: Boolean,
	/**
	* @description data filtering method. If `filter-multiple` is on, this method will be called multiple times for each row, and a row will display if one of the calls returns `true`
	*/
	filterMethod: Function,
	/**
	* @description filter value for selected data, might be useful when table header is rendered with `render-header`
	*/
	filteredValue: Array,
	/**
	* @description an array of data filtering options. For each element in this array, `text` and `value` are required
	*/
	filters: Array,
	/**
	* @description placement for the filter dropdown
	*/
	filterPlacement: String,
	/**
	* @description whether data filtering supports multiple options
	*/
	filterMultiple: {
		type: Boolean,
		default: true
	},
	/**
	* @description className for the filter dropdown
	*/
	filterClassName: String,
	/**
	* @description customize indices for each row, works on columns with `type=index`
	*/
	index: [Number, Function],
	/**
	* @description the order of the sorting strategies used when sorting the data, works when `sortable` is `true`. Accepts an array, as the user clicks on the header, the column is sorted in order of the elements in the array
	*/
	sortOrders: {
		type: Array,
		default: () => {
			return [
				"ascending",
				"descending",
				null
			];
		},
		validator: (val) => {
			return val.every((order) => [
				"ascending",
				"descending",
				null
			].includes(order));
		}
	}
};
//#endregion
//#region node_modules/element-plus/es/components/table/src/config.mjs
var defaultClassNames = {
	selection: "table-column--selection",
	expand: "table__expand-column"
};
var cellStarts = {
	default: { order: "" },
	selection: {
		width: 48,
		minWidth: 48,
		realWidth: 48,
		order: ""
	},
	expand: {
		width: 48,
		minWidth: 48,
		realWidth: 48,
		order: ""
	},
	index: {
		width: 48,
		minWidth: 48,
		realWidth: 48,
		order: ""
	}
};
var getDefaultClassName = (type) => {
	return defaultClassNames[type] || "";
};
var cellForced = {
	selection: {
		renderHeader({ store }) {
			function isDisabled() {
				return store.states.data.value && store.states.data.value.length === 0;
			}
			return h$1(ElCheckbox, {
				disabled: isDisabled(),
				size: store.states.tableSize.value,
				indeterminate: store.states.selection.value.length > 0 && !store.states.isAllSelected.value,
				"onUpdate:modelValue": store.toggleAllSelection ?? void 0,
				modelValue: store.states.isAllSelected.value,
				ariaLabel: store.t("el.table.selectAllLabel")
			});
		},
		renderCell({ row, column, store, $index }) {
			return h$1(ElCheckbox, {
				disabled: column.selectable ? !column.selectable.call(null, row, $index) : false,
				size: store.states.tableSize.value,
				onChange: () => {
					store.commit("rowSelectedChanged", row);
				},
				onClick: (event) => event.stopPropagation(),
				modelValue: store.isSelected(row),
				indeterminate: store.getRowIndeterminate(row),
				ariaLabel: store.t("el.table.selectRowLabel")
			});
		},
		sortable: false,
		resizable: false
	},
	index: {
		renderHeader({ column }) {
			return column.label || "#";
		},
		renderCell({ column, $index }) {
			let i = $index + 1;
			const index = column.index;
			if (isNumber(index)) i = $index + index;
			else if (isFunction$1(index)) i = index($index);
			return h$1("div", {}, [i]);
		},
		sortable: false
	},
	expand: {
		renderHeader({ column }) {
			return column.label || "";
		},
		renderCell({ column, row, store, expanded, $index }) {
			const { ns } = store;
			const classes = [ns.e("expand-icon")];
			if (!column.renderExpand && expanded) classes.push(ns.em("expand-icon", "expanded"));
			const callback = function(e) {
				e.stopPropagation();
				store.toggleRowExpansion(row);
			};
			const isRowExpandable = store.states.rowExpandable.value?.(row, $index) ?? true;
			if (!isRowExpandable) classes.push(ns.is("disabled"));
			return h$1("button", {
				type: "button",
				disabled: !isRowExpandable,
				"aria-label": store.t(expanded ? "el.table.collapseRowLabel" : "el.table.expandRowLabel"),
				"aria-expanded": expanded,
				class: classes,
				onClick: callback
			}, { default: () => {
				if (column.renderExpand) return [column.renderExpand({
					expanded,
					expandable: isRowExpandable
				})];
				return [h$1(ElIcon, null, { default: () => {
					return [h$1(arrow_right_default)];
				} })];
			} });
		},
		sortable: false,
		resizable: false
	}
};
function defaultRenderCell({ row, column, $index }) {
	const property = column.property;
	const value = property && getProp(row, property).value;
	if (column && column.formatter) return column.formatter(row, column, value, $index);
	return value?.toString?.() || "";
}
function treeCellPrefix({ row, treeNode, store }, createPlaceholder = false) {
	const { ns } = store;
	if (!treeNode) {
		if (createPlaceholder) return [h$1("span", { class: ns.e("placeholder") })];
		return null;
	}
	const ele = [];
	const callback = function(e) {
		e.stopPropagation();
		if (treeNode.loading) return;
		store.loadOrToggle(row);
	};
	if (treeNode.indent) ele.push(h$1("span", {
		class: ns.e("indent"),
		style: { "padding-left": `${treeNode.indent}px` }
	}));
	if (isBoolean(treeNode.expanded) && !treeNode.noLazyChildren) {
		const expandClasses = [ns.e("expand-icon"), treeNode.expanded ? ns.em("expand-icon", "expanded") : ""];
		let icon = arrow_right_default;
		if (treeNode.loading) icon = loading_default;
		ele.push(h$1("button", {
			type: "button",
			"aria-label": store.t(treeNode.expanded ? "el.table.collapseRowLabel" : "el.table.expandRowLabel"),
			"aria-expanded": treeNode.expanded,
			class: expandClasses,
			onClick: callback
		}, { default: () => {
			return [h$1(ElIcon, { class: ns.is("loading", treeNode.loading) }, { default: () => [h$1(icon)] })];
		} }));
	} else ele.push(h$1("span", { class: ns.e("placeholder") }));
	return ele;
}
//#endregion
//#region node_modules/element-plus/es/components/table/src/table-column/watcher-helper.mjs
function getAllAliases(props, aliases) {
	return props.reduce((prev, cur) => {
		prev[cur] = cur;
		return prev;
	}, aliases);
}
function useWatcher(owner, props_) {
	const instance = getCurrentInstance();
	const registerComplexWatchers = () => {
		const props = ["fixed"];
		const aliases = {
			realWidth: "width",
			realMinWidth: "minWidth"
		};
		const allAliases = getAllAliases(props, aliases);
		Object.keys(allAliases).forEach((key) => {
			const columnKey = aliases[key];
			if (hasOwn(props_, columnKey)) watch(() => props_[columnKey], (newVal) => {
				let value = newVal;
				if (columnKey === "width" && key === "realWidth") value = parseWidth(newVal);
				if (columnKey === "minWidth" && key === "realMinWidth") value = parseMinWidth(newVal);
				instance.columnConfig.value[columnKey] = value;
				instance.columnConfig.value[key] = value;
				const updateColumns = columnKey === "fixed";
				owner.value.store.scheduleLayout(updateColumns);
			});
		});
	};
	const registerNormalWatchers = () => {
		const props = [
			"label",
			"filters",
			"filterMultiple",
			"filteredValue",
			"sortable",
			"index",
			"formatter",
			"className",
			"labelClassName",
			"filterClassName",
			"showOverflowTooltip",
			"tooltipFormatter",
			"resizable"
		];
		const parentProps = ["showOverflowTooltip"];
		const aliases = {
			property: "prop",
			align: "realAlign",
			headerAlign: "realHeaderAlign"
		};
		const allAliases = getAllAliases(props, aliases);
		Object.keys(allAliases).forEach((key) => {
			const columnKey = aliases[key];
			if (hasOwn(props_, columnKey)) watch(() => props_[columnKey], (newVal) => {
				instance.columnConfig.value[key] = newVal;
				if (key === "filters" || key === "filterMethod") instance.columnConfig.value["filterable"] = !!(instance.columnConfig.value["filters"] || instance.columnConfig.value["filterMethod"]);
			});
		});
		parentProps.forEach((key) => {
			if (hasOwn(owner.value.props, key)) watch(() => owner.value.props[key], (newVal) => {
				if (instance.columnConfig.value.type === "selection") return;
				if (!isUndefined(props_[key])) return;
				instance.columnConfig.value[key] = newVal;
			});
		});
		const globalConfig = useGlobalConfig("table");
		if (globalConfig.value && hasOwn(globalConfig.value, "showOverflowTooltip")) watch(() => globalConfig.value?.showOverflowTooltip, (newVal) => {
			if (instance.columnConfig.value.type === "selection") return;
			if (!isUndefined(props_.showOverflowTooltip) || !isUndefined(owner.value.props.showOverflowTooltip)) return;
			instance.columnConfig.value.showOverflowTooltip = newVal;
		});
	};
	return {
		registerComplexWatchers,
		registerNormalWatchers
	};
}
//#endregion
//#region node_modules/element-plus/es/components/table/src/table-column/render-helper.mjs
function useRender(props, slots, owner) {
	const instance = getCurrentInstance();
	const columnId = /* @__PURE__ */ ref("");
	const isSubColumn = /* @__PURE__ */ ref(false);
	const realAlign = /* @__PURE__ */ ref();
	const realHeaderAlign = /* @__PURE__ */ ref();
	const ns = useNamespace("table");
	watchEffect(() => {
		realAlign.value = props.align ? `is-${props.align}` : null;
		realAlign.value;
	});
	watchEffect(() => {
		realHeaderAlign.value = props.headerAlign ? `is-${props.headerAlign}` : realAlign.value;
		realHeaderAlign.value;
	});
	const columnOrTableParent = computed(() => {
		let parent = instance.vnode.vParent || instance.parent;
		while (parent && !parent.tableId && !parent.columnId) parent = parent.vnode.vParent || parent.parent;
		return parent;
	});
	const hasTreeColumn = computed(() => {
		const { store } = instance.parent;
		if (!store) return false;
		const { treeData } = store.states;
		const treeDataValue = treeData.value;
		return treeDataValue && Object.keys(treeDataValue).length > 0;
	});
	const realWidth = /* @__PURE__ */ ref(parseWidth(props.width));
	const realMinWidth = /* @__PURE__ */ ref(parseMinWidth(props.minWidth));
	const setColumnWidth = (column) => {
		if (realWidth.value) column.width = realWidth.value;
		if (realMinWidth.value) column.minWidth = realMinWidth.value;
		if (!realWidth.value && realMinWidth.value) column.width = void 0;
		if (!column.minWidth) column.minWidth = 80;
		column.realWidth = Number(isUndefined(column.width) ? column.minWidth : column.width);
		return column;
	};
	const setColumnForcedProps = (column) => {
		const type = column.type;
		const source = cellForced[type] || {};
		Object.keys(source).forEach((prop) => {
			const value = source[prop];
			if (prop !== "className" && !isUndefined(value)) column[prop] = value;
		});
		const className = getDefaultClassName(type);
		if (className) {
			const forceClass = `${unref(ns.namespace)}-${className}`;
			column.className = column.className ? `${column.className} ${forceClass}` : forceClass;
		}
		return column;
	};
	const checkSubColumn = (children) => {
		if (isArray$1(children)) children.forEach((child) => check(child));
		else check(children);
		function check(item) {
			if (item?.type?.name === "ElTableColumn") item.vParent = instance;
		}
	};
	const setColumnRenders = (column) => {
		if (props.renderHeader) debugWarn("TableColumn", "Comparing to render-header, scoped-slot header is easier to use. We recommend users to use scoped-slot header.");
		else if (column.type !== "selection") column.renderHeader = (scope) => {
			instance.columnConfig.value["label"];
			if (slots.header) {
				const slotResult = slots.header(scope);
				if (ensureValidVNode(slotResult)) return h$1(Fragment, slotResult);
			}
			return createTextVNode(column.label);
		};
		if (slots["filter-icon"]) column.renderFilterIcon = (scope) => {
			return renderSlot(slots, "filter-icon", scope);
		};
		if (slots.expand) column.renderExpand = (scope) => {
			return renderSlot(slots, "expand", scope);
		};
		let originRenderCell = column.renderCell;
		if (column.type === "expand") {
			column.renderCell = (data) => h$1("div", { class: "cell" }, [originRenderCell(data)]);
			owner.value.renderExpanded = (row) => {
				return slots.default ? slots.default(row) : slots.default;
			};
		} else {
			originRenderCell = originRenderCell || defaultRenderCell;
			column.renderCell = (data) => {
				let children = null;
				if (slots.default) {
					const vnodes = slots.default(data);
					children = vnodes.some((v) => v.type !== Comment) ? vnodes : originRenderCell(data);
				} else children = originRenderCell(data);
				const { columns } = owner.value.store.states;
				const firstUserColumnIndex = columns.value.findIndex((item) => item.type === "default");
				const prefix = treeCellPrefix(data, hasTreeColumn.value && data.cellIndex === firstUserColumnIndex);
				const props = {
					class: "cell",
					style: {}
				};
				if (column.showOverflowTooltip) {
					props.class = `${props.class} ${unref(ns.namespace)}-tooltip`;
					props.style = { width: `${(data.column.realWidth || Number(data.column.width)) - 1}px` };
				}
				checkSubColumn(children);
				return h$1("div", props, [prefix, children]);
			};
		}
		return column;
	};
	const getPropsData = (...propsKey) => {
		return propsKey.reduce((prev, cur) => {
			if (isArray$1(cur)) cur.forEach((key) => {
				prev[key] = props[key];
			});
			return prev;
		}, {});
	};
	const getColumnElIndex = (children, child) => {
		return Array.prototype.indexOf.call(children, child);
	};
	const updateColumnOrder = () => {
		owner.value.store.commit("updateColumnOrder", instance.columnConfig.value);
	};
	return {
		columnId,
		realAlign,
		isSubColumn,
		realHeaderAlign,
		columnOrTableParent,
		setColumnWidth,
		setColumnForcedProps,
		setColumnRenders,
		getPropsData,
		getColumnElIndex,
		updateColumnOrder
	};
}
//#endregion
//#region node_modules/element-plus/es/components/table/src/tableColumn.mjs
var tableColumn_default = /* @__PURE__ */ defineComponent({
	name: "ElTableColumn",
	__name: "index",
	props: tableColumnProps,
	setup(__props) {
		const props = __props;
		const slots = useSlots();
		const instance = getCurrentInstance();
		const globalConfig = useGlobalConfig("table");
		const columnConfig = /* @__PURE__ */ ref({});
		const owner = computed(() => {
			let parent = instance.parent;
			while (parent && !parent.tableId) parent = parent.parent;
			return parent;
		});
		const { registerNormalWatchers, registerComplexWatchers } = useWatcher(owner, props);
		const { columnId, isSubColumn, realHeaderAlign, columnOrTableParent, setColumnWidth, setColumnForcedProps, setColumnRenders, getPropsData, getColumnElIndex, realAlign, updateColumnOrder } = useRender(props, slots, owner);
		const parent = columnOrTableParent.value;
		columnId.value = createTableColumnId("tableId" in parent ? parent.tableId : parent.columnId);
		onBeforeMount(() => {
			isSubColumn.value = owner.value !== parent;
			const type = props.type || "default";
			const sortable = props.sortable === "" ? true : props.sortable;
			const showOverflowTooltip = type === "selection" ? false : isUndefined(props.showOverflowTooltip) ? parent.props.showOverflowTooltip ?? globalConfig.value?.showOverflowTooltip : props.showOverflowTooltip;
			const tooltipFormatter = isUndefined(props.tooltipFormatter) ? parent.props.tooltipFormatter ?? globalConfig.value?.tooltipFormatter : props.tooltipFormatter;
			const defaults = {
				...cellStarts[type],
				id: columnId.value,
				type,
				property: props.prop || props.property,
				align: realAlign,
				headerAlign: realHeaderAlign,
				showOverflowTooltip,
				tooltipFormatter,
				filterable: props.filters || props.filterMethod,
				filteredValue: [],
				filterPlacement: "",
				filterClassName: "",
				isColumnGroup: false,
				isSubColumn: false,
				filterOpened: false,
				sortable,
				index: props.index,
				rawColumnKey: instance.vnode.key
			};
			let column = getPropsData([
				"columnKey",
				"label",
				"className",
				"labelClassName",
				"type",
				"renderHeader",
				"formatter",
				"fixed",
				"resizable"
			], [
				"sortMethod",
				"sortBy",
				"sortOrders"
			], ["selectable", "reserveSelection"], [
				"filterMethod",
				"filters",
				"filterMultiple",
				"filterOpened",
				"filteredValue",
				"filterPlacement",
				"filterClassName"
			]);
			column = mergeOptions(defaults, column);
			column = compose(setColumnRenders, setColumnWidth, setColumnForcedProps)(column);
			columnConfig.value = column;
			registerNormalWatchers();
			registerComplexWatchers();
		});
		onMounted(() => {
			const parent = columnOrTableParent.value;
			const children = isSubColumn.value ? parent.vnode.el?.children : parent.refs.hiddenColumns?.children;
			const getColumnIndex = () => getColumnElIndex(children || [], instance.vnode.el);
			columnConfig.value.getColumnIndex = getColumnIndex;
			getColumnIndex() > -1 && owner.value.store.commit("insertColumn", columnConfig.value, isSubColumn.value ? "columnConfig" in parent && parent.columnConfig.value : null, updateColumnOrder);
		});
		onBeforeUnmount(() => {
			const getColumnIndex = columnConfig.value.getColumnIndex;
			(getColumnIndex ? getColumnIndex() : -1) > -1 && owner.value.store.commit("removeColumn", columnConfig.value, isSubColumn.value ? "columnConfig" in parent && parent.columnConfig.value : null, updateColumnOrder);
		});
		instance.columnId = columnId.value;
		instance.columnConfig = columnConfig;
		const TableColumnRenderer = () => {
			try {
				const renderDefault = slots.default?.({
					row: {},
					column: {},
					$index: -1
				});
				const children = [];
				if (isArray$1(renderDefault)) {
					for (const childNode of renderDefault) if (childNode.type?.name === "ElTableColumn" || childNode.shapeFlag & 2) children.push(childNode);
					else if (childNode.type === Fragment && isArray$1(childNode.children)) childNode.children.forEach((vnode) => {
						if (vnode?.patchFlag !== 1024 && !isString(vnode?.children)) children.push(vnode);
					});
				}
				return h$1("div", children);
			} catch {
				return h$1("div", []);
			}
		};
		return (_ctx, _cache) => {
			return openBlock(), createBlock(TableColumnRenderer);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/table/index.mjs
var ElTable = withInstall(table_default, { TableColumn: tableColumn_default });
var ElTableColumn = withNoopInstall(tableColumn_default);
//#endregion
//#region node_modules/element-plus/es/components/loading/src/loading.mjs
function createLoadingComponent(options, appContext) {
	let afterLeaveTimer;
	const afterLeaveFlag = /* @__PURE__ */ ref(false);
	const data = /* @__PURE__ */ reactive({
		...options,
		originalPosition: "",
		originalOverflow: "",
		visible: false
	});
	function setText(text) {
		data.text = text;
	}
	function destroySelf() {
		const target = data.parent;
		const ns = vm.ns;
		if (!target.vLoadingAddClassList) {
			let loadingNumber = target.getAttribute("loading-number");
			loadingNumber = Number.parseInt(loadingNumber) - 1;
			if (!loadingNumber) {
				removeClass(target, ns.bm("parent", "relative"));
				target.removeAttribute("loading-number");
			} else target.setAttribute("loading-number", loadingNumber.toString());
			removeClass(target, ns.bm("parent", "hidden"));
		}
		removeElLoadingChild();
		loadingInstance.unmount();
	}
	function removeElLoadingChild() {
		vm.$el?.parentNode?.removeChild(vm.$el);
	}
	function close() {
		if (options.beforeClose && !options.beforeClose()) return;
		afterLeaveFlag.value = true;
		clearTimeout(afterLeaveTimer);
		afterLeaveTimer = setTimeout(handleAfterLeave, 400);
		data.visible = false;
		options.closed?.();
	}
	function handleAfterLeave() {
		if (!afterLeaveFlag.value) return;
		const target = data.parent;
		afterLeaveFlag.value = false;
		target.vLoadingAddClassList = void 0;
		destroySelf();
	}
	const loadingInstance = createApp(/* @__PURE__ */ defineComponent({
		name: "ElLoading",
		setup(_, { expose }) {
			const { ns, zIndex } = useGlobalComponentSettings("loading");
			expose({
				ns,
				zIndex
			});
			return () => {
				const svg = data.spinner || data.svg;
				const spinner = h$1("svg", {
					class: "circular",
					viewBox: data.svgViewBox ? data.svgViewBox : "0 0 50 50",
					...svg ? { innerHTML: svg } : {}
				}, [h$1("circle", {
					class: "path",
					cx: "25",
					cy: "25",
					r: "20",
					fill: "none"
				})]);
				const spinnerText = data.text ? h$1("p", { class: ns.b("text") }, [data.text]) : void 0;
				return h$1(Transition, {
					name: ns.b("fade"),
					onAfterLeave: handleAfterLeave
				}, { default: withCtx(() => [withDirectives(createVNode("div", {
					style: { backgroundColor: data.background || "" },
					class: [
						ns.b("mask"),
						data.customClass,
						ns.is("fullscreen", data.fullscreen)
					]
				}, [h$1("div", { class: ns.b("spinner") }, [spinner, spinnerText])]), [[vShow, data.visible]])]) });
			};
		}
	}));
	Object.assign(loadingInstance._context, appContext ?? {});
	const vm = loadingInstance.mount(document.createElement("div"));
	return {
		.../* @__PURE__ */ toRefs(data),
		setText,
		removeElLoadingChild,
		close,
		handleAfterLeave,
		vm,
		get $el() {
			return vm.$el;
		}
	};
}
//#endregion
//#region node_modules/element-plus/es/components/loading/src/service.mjs
var fullscreenInstance = void 0;
var Loading = function(options = {}, context) {
	if (!isClient) return void 0;
	const resolved = resolveOptions(options);
	if (resolved.fullscreen && fullscreenInstance) return fullscreenInstance;
	const instance = createLoadingComponent({
		...resolved,
		closed: () => {
			resolved.closed?.();
			if (resolved.fullscreen) fullscreenInstance = void 0;
		}
	}, context ?? Loading._context);
	addStyle(resolved, resolved.parent, instance);
	addClassList(resolved, resolved.parent, instance);
	resolved.parent.vLoadingAddClassList = () => addClassList(resolved, resolved.parent, instance);
	/**
	* add loading-number to parent.
	* because if a fullscreen loading is triggered when somewhere
	* a v-loading.body was triggered before and it's parent is
	* document.body which with a margin , the fullscreen loading's
	* destroySelf function will remove 'el-loading-parent--relative',
	* and then the position of v-loading.body will be error.
	*/
	let loadingNumber = resolved.parent.getAttribute("loading-number");
	if (!loadingNumber) loadingNumber = "1";
	else loadingNumber = `${Number.parseInt(loadingNumber) + 1}`;
	resolved.parent.setAttribute("loading-number", loadingNumber);
	resolved.parent.appendChild(instance.$el);
	nextTick(() => instance.visible.value = resolved.visible);
	if (resolved.fullscreen) fullscreenInstance = instance;
	return instance;
};
var resolveOptions = (options) => {
	let target;
	if (isString(options.target)) target = document.querySelector(options.target) ?? document.body;
	else target = options.target || document.body;
	return {
		parent: target === document.body || options.body ? document.body : target,
		background: options.background || "",
		svg: options.svg || "",
		svgViewBox: options.svgViewBox || "",
		spinner: options.spinner || false,
		text: options.text || "",
		fullscreen: target === document.body && (options.fullscreen ?? true),
		lock: options.lock ?? false,
		customClass: options.customClass || "",
		visible: options.visible ?? true,
		beforeClose: options.beforeClose,
		closed: options.closed,
		target
	};
};
var addStyle = async (options, parent, instance) => {
	const { nextZIndex } = instance.vm.zIndex || instance.vm._.exposed.zIndex;
	const maskStyle = {};
	if (options.fullscreen) {
		instance.originalPosition.value = getStyle(document.body, "position");
		instance.originalOverflow.value = getStyle(document.body, "overflow");
		maskStyle.zIndex = nextZIndex();
	} else if (options.parent === document.body) {
		instance.originalPosition.value = getStyle(document.body, "position");
		/**
		* await dom render when visible is true in init,
		* because some component's height maybe 0.
		* e.g. el-table.
		*/
		await nextTick();
		for (const property of ["top", "left"]) {
			const scroll = property === "top" ? "scrollTop" : "scrollLeft";
			maskStyle[property] = `${options.target.getBoundingClientRect()[property] + document.body[scroll] + document.documentElement[scroll] - Number.parseInt(getStyle(document.body, `margin-${property}`), 10)}px`;
		}
		for (const property of ["height", "width"]) maskStyle[property] = `${options.target.getBoundingClientRect()[property]}px`;
	} else instance.originalPosition.value = getStyle(parent, "position");
	for (const [key, value] of Object.entries(maskStyle)) instance.$el.style[key] = value;
};
var addClassList = (options, parent, instance) => {
	const ns = instance.vm.ns || instance.vm._.exposed.ns;
	if (![
		"absolute",
		"fixed",
		"sticky"
	].includes(instance.originalPosition.value)) addClass(parent, ns.bm("parent", "relative"));
	else removeClass(parent, ns.bm("parent", "relative"));
	if (options.fullscreen && options.lock) addClass(parent, ns.bm("parent", "hidden"));
	else removeClass(parent, ns.bm("parent", "hidden"));
};
Loading._context = null;
//#endregion
//#region node_modules/element-plus/es/components/loading/src/directive.mjs
var INSTANCE_KEY = Symbol("ElLoading");
var getAttributeName = (name) => {
	return `element-loading-${hyphenate$1(name)}`;
};
var createInstance = (el, binding) => {
	const vm = binding.instance;
	const getBindingProp = (key) => isObject$2(binding.value) ? binding.value[key] : void 0;
	const resolveExpression = (key) => {
		return /* @__PURE__ */ ref(isString(key) && vm?.[key] || key);
	};
	const getProp = (name) => resolveExpression(getBindingProp(name) || el.getAttribute(getAttributeName(name)));
	const fullscreen = getBindingProp("fullscreen") ?? binding.modifiers.fullscreen;
	const options = {
		text: getProp("text"),
		svg: getProp("svg"),
		svgViewBox: getProp("svgViewBox"),
		spinner: getProp("spinner"),
		background: getProp("background"),
		customClass: getProp("customClass"),
		fullscreen,
		target: getBindingProp("target") ?? (fullscreen ? void 0 : el),
		body: getBindingProp("body") ?? binding.modifiers.body,
		lock: getBindingProp("lock") ?? binding.modifiers.lock
	};
	const instance = Loading(options);
	instance._context = vLoading._context;
	el[INSTANCE_KEY] = {
		options,
		instance
	};
};
var updateOptions = (originalOptions, newOptions) => {
	for (const key of Object.keys(originalOptions)) if (/* @__PURE__ */ isRef(originalOptions[key])) originalOptions[key].value = newOptions[key];
};
var vLoading = {
	mounted(el, binding) {
		if (binding.value) createInstance(el, binding);
	},
	updated(el, binding) {
		const instance = el[INSTANCE_KEY];
		if (!binding.value) {
			instance?.instance.close();
			el[INSTANCE_KEY] = null;
			return;
		}
		if (!instance) createInstance(el, binding);
		else updateOptions(instance.options, isObject$2(binding.value) ? binding.value : {
			text: el.getAttribute(getAttributeName("text")),
			svg: el.getAttribute(getAttributeName("svg")),
			svgViewBox: el.getAttribute(getAttributeName("svgViewBox")),
			spinner: el.getAttribute(getAttributeName("spinner")),
			background: el.getAttribute(getAttributeName("background")),
			customClass: el.getAttribute(getAttributeName("customClass"))
		});
	},
	unmounted(el) {
		el[INSTANCE_KEY]?.instance.close();
		el[INSTANCE_KEY] = null;
	}
};
vLoading._context = null;
//#endregion
//#region node_modules/element-plus/es/components/message/src/message.mjs
var messageTypes = [
	"primary",
	"success",
	"info",
	"warning",
	"error"
];
var messagePlacement = [
	"top",
	"top-left",
	"top-right",
	"bottom",
	"bottom-left",
	"bottom-right"
];
var messageDefaults = mutable({
	customClass: "",
	dangerouslyUseHTMLString: false,
	duration: 3e3,
	icon: void 0,
	id: "",
	message: "",
	onClose: void 0,
	showClose: false,
	type: "info",
	plain: false,
	offset: 16,
	placement: void 0,
	zIndex: 0,
	grouping: false,
	repeatNum: 1,
	appendTo: isClient ? document.body : void 0
});
/**
* @deprecated Removed after 3.0.0, Use `MessageProps` instead.
*/
var messageProps = buildProps({
	/**
	* @description custom class name for Message
	*/
	customClass: {
		type: String,
		default: messageDefaults.customClass
	},
	/**
	* @description whether `message` is treated as HTML string
	*/
	dangerouslyUseHTMLString: {
		type: Boolean,
		default: messageDefaults.dangerouslyUseHTMLString
	},
	/**
	* @description display duration, millisecond. If set to 0, it will not turn off automatically
	*/
	duration: {
		type: Number,
		default: messageDefaults.duration
	},
	/**
	* @description custom icon component, overrides `type`
	*/
	icon: {
		type: iconPropType,
		default: messageDefaults.icon
	},
	/**
	* @description message dom id
	*/
	id: {
		type: String,
		default: messageDefaults.id
	},
	/**
	* @description message text
	*/
	message: {
		type: definePropType([
			String,
			Object,
			Function
		]),
		default: messageDefaults.message
	},
	/**
	* @description callback function when closed with the message instance as the parameter
	*/
	onClose: {
		type: definePropType(Function),
		default: messageDefaults.onClose
	},
	/**
	* @description whether to show a close button
	*/
	showClose: {
		type: Boolean,
		default: messageDefaults.showClose
	},
	/**
	* @description message type
	*/
	type: {
		type: String,
		values: messageTypes,
		default: messageDefaults.type
	},
	/**
	* @description whether message is plain
	*/
	plain: {
		type: Boolean,
		default: messageDefaults.plain
	},
	/**
	* @description set the distance to the top of viewport
	*/
	offset: {
		type: Number,
		default: messageDefaults.offset
	},
	/**
	* @description message placement position
	*/
	placement: {
		type: String,
		values: messagePlacement,
		default: messageDefaults.placement
	},
	/**
	* @description message element zIndex value
	*/
	zIndex: {
		type: Number,
		default: messageDefaults.zIndex
	},
	/**
	* @description merge messages with the same content, type of VNode message is not supported
	*/
	grouping: {
		type: Boolean,
		default: messageDefaults.grouping
	},
	/**
	* @description The number of repetitions, similar to badge, is used as the initial number when used with `grouping`
	*/
	repeatNum: {
		type: Number,
		default: messageDefaults.repeatNum
	}
});
var messageEmits = { destroy: () => true };
//#endregion
//#region node_modules/element-plus/es/components/message/src/instance.mjs
var placementInstances = /* @__PURE__ */ shallowReactive({});
var getOrCreatePlacementInstances = (placement) => {
	if (!placementInstances[placement]) placementInstances[placement] = /* @__PURE__ */ shallowReactive([]);
	return placementInstances[placement];
};
var getInstance = (id, placement) => {
	const instances = placementInstances[placement] || [];
	const idx = instances.findIndex((instance) => instance.id === id);
	const current = instances[idx];
	let prev;
	if (idx > 0) prev = instances[idx - 1];
	return {
		current,
		prev
	};
};
var getLastOffset = (id, placement) => {
	const { prev } = getInstance(id, placement);
	if (!prev) return 0;
	return prev.vm.exposed.bottom.value;
};
var getOffsetOrSpace = (id, offset, placement) => {
	return (placementInstances[placement] || []).findIndex((instance) => instance.id === id) > 0 ? 16 : offset;
};
//#endregion
//#region node_modules/element-plus/es/components/message/src/message.vue_vue_type_script_setup_true_lang.mjs
var _hoisted_1$1 = ["id"];
var _hoisted_2$1 = ["innerHTML"];
//#endregion
//#region node_modules/element-plus/es/components/message/src/message2.mjs
var message_default = /* @__PURE__ */ defineComponent({
	name: "ElMessage",
	__name: "message",
	props: messageProps,
	emits: messageEmits,
	setup(__props, { expose: __expose, emit: __emit }) {
		const { Close } = TypeComponents;
		const props = __props;
		const emit = __emit;
		const isStartTransition = /* @__PURE__ */ ref(false);
		const { ns, zIndex } = useGlobalComponentSettings("message");
		const { currentZIndex, nextZIndex } = zIndex;
		const messageRef = /* @__PURE__ */ ref();
		const visible = /* @__PURE__ */ ref(false);
		const height = /* @__PURE__ */ ref(0);
		let stopTimer = void 0;
		const badgeType = computed(() => props.type ? props.type === "error" ? "danger" : props.type : "info");
		const typeClass = computed(() => {
			const type = props.type;
			return { [ns.bm("icon", type)]: type && TypeComponentsMap[type] };
		});
		const iconComponent = computed(() => props.icon || TypeComponentsMap[props.type] || "");
		const placement = computed(() => props.placement || "top");
		const lastOffset = computed(() => getLastOffset(props.id, placement.value));
		const offset = computed(() => {
			return Math.max(getOffsetOrSpace(props.id, props.offset, placement.value) + lastOffset.value, props.offset);
		});
		const bottom = computed(() => height.value + offset.value);
		const horizontalClass = computed(() => {
			if (placement.value.includes("left")) return ns.is("left");
			if (placement.value.includes("right")) return ns.is("right");
			return ns.is("center");
		});
		const verticalProperty = computed(() => placement.value.startsWith("top") ? "top" : "bottom");
		const customStyle = computed(() => ({
			[verticalProperty.value]: `${offset.value}px`,
			zIndex: currentZIndex.value
		}));
		function startTimer() {
			if (props.duration === 0) return;
			({stop: stopTimer} = useTimeoutFn(() => {
				close();
			}, props.duration));
		}
		function clearTimer() {
			stopTimer?.();
		}
		function close() {
			visible.value = false;
			nextTick(() => {
				if (!isStartTransition.value) {
					props.onClose?.();
					emit("destroy");
				}
			});
		}
		function keydown(event) {
			if (getEventCode(event) === EVENT_CODE.esc) close();
		}
		onMounted(() => {
			startTimer();
			nextZIndex();
			visible.value = true;
		});
		watch(() => props.repeatNum, () => {
			clearTimer();
			startTimer();
		});
		useEventListener(document, "keydown", keydown);
		useResizeObserver(messageRef, () => {
			height.value = messageRef.value.getBoundingClientRect().height;
		});
		__expose({
			visible,
			bottom,
			close
		});
		return (_ctx, _cache) => {
			return openBlock(), createBlock(Transition, {
				name: unref(ns).b("fade"),
				onBeforeEnter: _cache[0] || (_cache[0] = ($event) => isStartTransition.value = true),
				onBeforeLeave: __props.onClose,
				onAfterLeave: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("destroy")),
				persisted: ""
			}, {
				default: withCtx(() => [withDirectives(createBaseVNode("div", {
					id: __props.id,
					ref_key: "messageRef",
					ref: messageRef,
					class: normalizeClass([
						unref(ns).b(),
						{ [unref(ns).m(__props.type)]: __props.type },
						unref(ns).is("closable", __props.showClose),
						unref(ns).is("plain", __props.plain),
						unref(ns).is("bottom", verticalProperty.value === "bottom"),
						horizontalClass.value,
						__props.customClass
					]),
					style: normalizeStyle(customStyle.value),
					role: "alert",
					onMouseenter: clearTimer,
					onMouseleave: startTimer
				}, [
					__props.repeatNum > 1 ? (openBlock(), createBlock(unref(ElBadge), {
						key: 0,
						value: __props.repeatNum,
						type: badgeType.value,
						class: normalizeClass(unref(ns).e("badge"))
					}, null, 8, [
						"value",
						"type",
						"class"
					])) : createCommentVNode("v-if", true),
					iconComponent.value ? (openBlock(), createBlock(unref(ElIcon), {
						key: 1,
						class: normalizeClass([unref(ns).e("icon"), typeClass.value])
					}, {
						default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(iconComponent.value)))]),
						_: 1
					}, 8, ["class"])) : createCommentVNode("v-if", true),
					!__props.dangerouslyUseHTMLString || _ctx.$slots.default ? (openBlock(), createElementBlock("p", {
						key: 2,
						class: normalizeClass(unref(ns).e("content"))
					}, [renderSlot(_ctx.$slots, "default", {}, () => [createTextVNode(toDisplayString(__props.message), 1)])], 2)) : (openBlock(), createElementBlock(Fragment, { key: 3 }, [createCommentVNode(" Caution here, message could've been compromised, never use user's input as message "), createBaseVNode("p", {
						class: normalizeClass(unref(ns).e("content")),
						innerHTML: __props.message
					}, null, 10, _hoisted_2$1)], 2112)),
					__props.showClose ? (openBlock(), createBlock(unref(ElIcon), {
						key: 4,
						class: normalizeClass(unref(ns).e("closeBtn")),
						onClick: withModifiers(close, ["stop"])
					}, {
						default: withCtx(() => [createVNode(unref(Close))]),
						_: 1
					}, 8, ["class"])) : createCommentVNode("v-if", true)
				], 46, _hoisted_1$1), [[vShow, visible.value]])]),
				_: 3
			}, 8, ["name", "onBeforeLeave"]);
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/message/src/method.mjs
var seed = 1;
var normalizeAppendTo = (normalized) => {
	if (!normalized.appendTo) normalized.appendTo = document.body;
	else if (isString(normalized.appendTo)) {
		let appendTo = document.querySelector(normalized.appendTo);
		if (!isElement(appendTo)) {
			debugWarn("ElMessage", "the appendTo option is not an HTMLElement. Falling back to document.body.");
			appendTo = document.body;
		}
		normalized.appendTo = appendTo;
	}
};
var normalizePlacement = (normalized) => {
	if (!normalized.placement && isString(messageConfig.placement) && messageConfig.placement) normalized.placement = messageConfig.placement;
	if (!normalized.placement) normalized.placement = "top";
	if (!messagePlacement.includes(normalized.placement)) {
		debugWarn("ElMessage", `Invalid placement: ${normalized.placement}. Falling back to 'top'.`);
		normalized.placement = "top";
	}
};
var normalizeOptions = (params) => {
	const options = !params || isString(params) || isVNode(params) || isFunction$1(params) ? { message: params } : params;
	const normalized = {
		...messageDefaults,
		...options
	};
	normalizeAppendTo(normalized);
	normalizePlacement(normalized);
	if (isBoolean(messageConfig.grouping) && !normalized.grouping) normalized.grouping = messageConfig.grouping;
	if (isNumber(messageConfig.duration) && normalized.duration === 3e3) normalized.duration = messageConfig.duration;
	if (isNumber(messageConfig.offset) && normalized.offset === 16) normalized.offset = messageConfig.offset;
	if (isBoolean(messageConfig.showClose) && !normalized.showClose) normalized.showClose = messageConfig.showClose;
	if (isBoolean(messageConfig.plain) && !normalized.plain) normalized.plain = messageConfig.plain;
	return normalized;
};
var closeMessage = (instance) => {
	const instances = placementInstances[instance.props.placement || "top"];
	const idx = instances.indexOf(instance);
	if (idx === -1) return;
	instances.splice(idx, 1);
	const { handler } = instance;
	handler.close();
};
var createMessage = ({ appendTo, ...options }, context) => {
	const id = `message_${seed++}`;
	const userOnClose = options.onClose;
	const container = document.createElement("div");
	const props = {
		...options,
		id,
		onClose: () => {
			userOnClose?.();
			closeMessage(instance);
		},
		onDestroy: () => {
			render(null, container);
		}
	};
	const vnode = createVNode(message_default, props, isFunction$1(props.message) || isVNode(props.message) ? { default: isFunction$1(props.message) ? props.message : () => props.message } : null);
	vnode.appContext = context || message._context;
	render(vnode, container);
	appendTo.appendChild(container.firstElementChild);
	const vm = vnode.component;
	const instance = {
		id,
		vnode,
		vm,
		handler: { close: () => {
			vm.exposed.close();
		} },
		props: vnode.component.props
	};
	return instance;
};
var message = (options = {}, context) => {
	if (!isClient) return { close: () => void 0 };
	const normalized = normalizeOptions(options);
	const instances = getOrCreatePlacementInstances(normalized.placement || "top");
	if (normalized.grouping && instances.length) {
		const instance = instances.find(({ vnode: vm }) => vm.props?.message === normalized.message);
		if (instance) {
			instance.props.repeatNum += 1;
			instance.props.type = normalized.type;
			return instance.handler;
		}
	}
	if (isNumber(messageConfig.max) && instances.length >= messageConfig.max) return { close: () => void 0 };
	const instance = createMessage(normalized, context);
	instances.push(instance);
	return instance.handler;
};
messageTypes.forEach((type) => {
	message[type] = (options = {}, appContext) => {
		return message({
			...normalizeOptions(options),
			type
		}, appContext);
	};
});
function closeAll(type) {
	for (const placement in placementInstances) if (hasOwn(placementInstances, placement)) {
		const instances = [...placementInstances[placement]];
		for (const instance of instances) if (!type || type === instance.props.type) instance.handler.close();
	}
}
function closeAllByPlacement(placement) {
	if (!placementInstances[placement]) return;
	[...placementInstances[placement]].forEach((instance) => instance.handler.close());
}
message.closeAll = closeAll;
message.closeAllByPlacement = closeAllByPlacement;
message._context = null;
//#endregion
//#region node_modules/element-plus/es/components/message/index.mjs
var ElMessage = withInstallFunction(message, "$message");
//#endregion
//#region node_modules/element-plus/es/components/message-box/src/index.vue_vue_type_script_lang.mjs
var index_vue_vue_type_script_lang_default = /* @__PURE__ */ defineComponent({
	name: "ElMessageBox",
	directives: { TrapFocus },
	components: {
		ElButton,
		ElFocusTrap: focus_trap_default$1,
		ElInput,
		ElOverlay,
		ElIcon,
		...TypeComponents
	},
	inheritAttrs: false,
	props: {
		buttonSize: {
			type: String,
			validator: isValidComponentSize
		},
		modal: {
			type: Boolean,
			default: true
		},
		lockScroll: {
			type: Boolean,
			default: true
		},
		showClose: {
			type: Boolean,
			default: true
		},
		closeOnClickModal: {
			type: Boolean,
			default: true
		},
		closeOnPressEscape: {
			type: Boolean,
			default: true
		},
		closeOnHashChange: {
			type: Boolean,
			default: true
		},
		center: Boolean,
		draggable: Boolean,
		overflow: Boolean,
		roundButton: Boolean,
		container: {
			type: String,
			default: "body"
		},
		boxType: {
			type: String,
			default: ""
		}
	},
	emits: ["vanish", "action"],
	setup(props, { emit }) {
		const { locale, zIndex, ns, size: btnSize } = useGlobalComponentSettings("message-box", computed(() => props.buttonSize));
		const { t } = locale;
		const { nextZIndex } = zIndex;
		const visible = /* @__PURE__ */ ref(false);
		const state = /* @__PURE__ */ reactive({
			autofocus: true,
			beforeClose: null,
			callback: null,
			cancelButtonText: "",
			cancelButtonClass: "",
			confirmButtonText: "",
			confirmButtonClass: "",
			cancelButtonType: "",
			confirmButtonType: "primary",
			customClass: "",
			customStyle: {},
			dangerouslyUseHTMLString: false,
			distinguishCancelAndClose: false,
			icon: "",
			closeIcon: "",
			inputPattern: null,
			inputPlaceholder: "",
			inputType: "text",
			inputValue: "",
			inputValidator: void 0,
			inputErrorMessage: "",
			message: "",
			modalFade: true,
			modalClass: "",
			showCancelButton: false,
			showConfirmButton: true,
			type: "",
			title: void 0,
			showInput: false,
			action: "",
			confirmButtonLoading: false,
			cancelButtonLoading: false,
			confirmButtonLoadingIcon: markRaw(loading_default),
			cancelButtonLoadingIcon: markRaw(loading_default),
			confirmButtonDisabled: false,
			editorErrorMessage: "",
			validateError: false,
			zIndex: nextZIndex()
		});
		const typeClass = computed(() => {
			const type = state.type;
			return { [ns.bm("icon", type)]: type && TypeComponentsMap[type] };
		});
		const contentId = useId();
		const inputId = useId();
		const iconComponent = computed(() => {
			const type = state.type;
			return state.icon || type && TypeComponentsMap[type] || "";
		});
		const hasMessage = computed(() => !!state.message);
		const rootRef = /* @__PURE__ */ ref();
		const headerRef = /* @__PURE__ */ ref();
		const focusStartRef = /* @__PURE__ */ ref();
		const inputRef = /* @__PURE__ */ ref();
		const confirmRef = /* @__PURE__ */ ref();
		const confirmButtonClasses = computed(() => state.confirmButtonClass);
		watch(() => state.inputValue, async (val) => {
			await nextTick();
			if (props.boxType === "prompt" && val) validate();
		}, { immediate: true });
		watch(() => visible.value, (val) => {
			if (val) {
				if (props.boxType !== "prompt") if (state.autofocus) focusStartRef.value = confirmRef.value?.$el ?? rootRef.value;
				else focusStartRef.value = rootRef.value;
				state.zIndex = nextZIndex();
			}
			if (props.boxType !== "prompt") return;
			if (val) nextTick().then(() => {
				if (inputRef.value && inputRef.value.$el) if (state.autofocus) focusStartRef.value = getInputElement() ?? rootRef.value;
				else focusStartRef.value = rootRef.value;
			});
			else {
				state.editorErrorMessage = "";
				state.validateError = false;
			}
		});
		const { isDragging } = useDraggable(rootRef, headerRef, computed(() => props.draggable), computed(() => props.overflow));
		onMounted(async () => {
			await nextTick();
			if (props.closeOnHashChange) window.addEventListener("hashchange", doClose);
		});
		onBeforeUnmount(() => {
			if (props.closeOnHashChange) window.removeEventListener("hashchange", doClose);
		});
		function doClose() {
			if (!visible.value) return;
			visible.value = false;
			nextTick(() => {
				if (state.action) emit("action", state.action);
			});
		}
		const handleWrapperClick = () => {
			if (props.closeOnClickModal) handleAction(state.distinguishCancelAndClose ? "close" : "cancel");
		};
		const overlayEvent = useSameTarget(handleWrapperClick);
		const handleInputEnter = (e) => {
			if (state.inputType !== "textarea" && !inputRef.value?.isComposing) {
				e.preventDefault();
				return handleAction("confirm");
			}
		};
		const handleAction = (action) => {
			if (props.boxType === "prompt" && action === "confirm" && !validate()) return;
			state.action = action;
			if (state.beforeClose) state.beforeClose?.(action, state, doClose);
			else doClose();
		};
		const validate = () => {
			if (props.boxType === "prompt") {
				const inputPattern = state.inputPattern;
				if (inputPattern && !inputPattern.test(state.inputValue || "")) {
					state.editorErrorMessage = state.inputErrorMessage || t("el.messagebox.error");
					state.validateError = true;
					return false;
				}
				const inputValidator = state.inputValidator;
				if (isFunction$1(inputValidator)) {
					const validateResult = inputValidator(state.inputValue);
					if (validateResult === false) {
						state.editorErrorMessage = state.inputErrorMessage || t("el.messagebox.error");
						state.validateError = true;
						return false;
					}
					if (isString(validateResult)) {
						state.editorErrorMessage = validateResult;
						state.validateError = true;
						return false;
					}
				}
			}
			state.editorErrorMessage = "";
			state.validateError = false;
			return true;
		};
		const getInputElement = () => {
			const inputRefs = inputRef.value?.$refs;
			return inputRefs?.input ?? inputRefs?.textarea;
		};
		const handleClose = () => {
			handleAction("close");
		};
		const onCloseRequested = () => {
			if (props.closeOnPressEscape) handleClose();
		};
		if (props.lockScroll) useLockscreen(visible, { ns });
		return {
			.../* @__PURE__ */ toRefs(state),
			ns,
			overlayEvent,
			visible,
			hasMessage,
			typeClass,
			contentId,
			inputId,
			btnSize,
			iconComponent,
			confirmButtonClasses,
			rootRef,
			focusStartRef,
			headerRef,
			inputRef,
			isDragging,
			confirmRef,
			doClose,
			handleClose,
			onCloseRequested,
			handleWrapperClick,
			handleInputEnter,
			handleAction,
			t
		};
	}
});
//#endregion
//#region node_modules/element-plus/es/components/message-box/src/index.mjs
var _hoisted_1 = ["aria-label", "aria-describedby"];
var _hoisted_2 = ["aria-label"];
var _hoisted_3 = ["id"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
	const _component_el_icon = resolveComponent("el-icon");
	const _component_el_input = resolveComponent("el-input");
	const _component_el_button = resolveComponent("el-button");
	const _component_el_focus_trap = resolveComponent("el-focus-trap");
	const _component_el_overlay = resolveComponent("el-overlay");
	return openBlock(), createBlock(Transition, {
		name: "fade-in-linear",
		onAfterLeave: _cache[11] || (_cache[11] = ($event) => _ctx.$emit("vanish")),
		persisted: ""
	}, {
		default: withCtx(() => [withDirectives(createVNode(_component_el_overlay, {
			"z-index": _ctx.zIndex,
			"overlay-class": [_ctx.ns.is("message-box"), _ctx.modalClass],
			mask: _ctx.modal
		}, {
			default: withCtx(() => [createBaseVNode("div", {
				role: "dialog",
				"aria-label": _ctx.title,
				"aria-modal": "true",
				"aria-describedby": !_ctx.showInput ? _ctx.contentId : void 0,
				class: normalizeClass(`${_ctx.ns.namespace.value}-overlay-message-box`),
				onClick: _cache[8] || (_cache[8] = (...args) => _ctx.overlayEvent.onClick && _ctx.overlayEvent.onClick(...args)),
				onMousedown: _cache[9] || (_cache[9] = (...args) => _ctx.overlayEvent.onMousedown && _ctx.overlayEvent.onMousedown(...args)),
				onMouseup: _cache[10] || (_cache[10] = (...args) => _ctx.overlayEvent.onMouseup && _ctx.overlayEvent.onMouseup(...args))
			}, [createVNode(_component_el_focus_trap, {
				loop: "",
				trapped: _ctx.visible,
				"focus-trap-el": _ctx.rootRef,
				"focus-start-el": _ctx.focusStartRef,
				onReleaseRequested: _ctx.onCloseRequested
			}, {
				default: withCtx(() => [createBaseVNode("div", {
					ref: "rootRef",
					class: normalizeClass([
						_ctx.ns.b(),
						_ctx.customClass,
						_ctx.ns.is("draggable", _ctx.draggable),
						_ctx.ns.is("dragging", _ctx.isDragging),
						{ [_ctx.ns.m("center")]: _ctx.center }
					]),
					style: normalizeStyle(_ctx.customStyle),
					tabindex: "-1",
					onClick: _cache[7] || (_cache[7] = withModifiers(() => {}, ["stop"]))
				}, [
					_ctx.title !== null && _ctx.title !== void 0 ? (openBlock(), createElementBlock("div", {
						key: 0,
						ref: "headerRef",
						class: normalizeClass([_ctx.ns.e("header"), { "show-close": _ctx.showClose }])
					}, [createBaseVNode("div", { class: normalizeClass(_ctx.ns.e("title")) }, [_ctx.iconComponent && _ctx.center ? (openBlock(), createBlock(_component_el_icon, {
						key: 0,
						class: normalizeClass([_ctx.ns.e("status"), _ctx.typeClass])
					}, {
						default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(_ctx.iconComponent)))]),
						_: 1
					}, 8, ["class"])) : createCommentVNode("v-if", true), createBaseVNode("span", null, toDisplayString(_ctx.title), 1)], 2), _ctx.showClose ? (openBlock(), createElementBlock("button", {
						key: 0,
						type: "button",
						class: normalizeClass(_ctx.ns.e("headerbtn")),
						"aria-label": _ctx.t("el.messagebox.close"),
						onClick: _cache[0] || (_cache[0] = ($event) => _ctx.handleAction(_ctx.distinguishCancelAndClose ? "close" : "cancel")),
						onKeydown: _cache[1] || (_cache[1] = withKeys(withModifiers(($event) => _ctx.handleAction(_ctx.distinguishCancelAndClose ? "close" : "cancel"), ["prevent"]), ["enter"]))
					}, [createVNode(_component_el_icon, { class: normalizeClass(_ctx.ns.e("close")) }, {
						default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(_ctx.closeIcon || "close")))]),
						_: 1
					}, 8, ["class"])], 42, _hoisted_2)) : createCommentVNode("v-if", true)], 2)) : createCommentVNode("v-if", true),
					createBaseVNode("div", {
						id: _ctx.contentId,
						class: normalizeClass(_ctx.ns.e("content"))
					}, [createBaseVNode("div", { class: normalizeClass(_ctx.ns.e("container")) }, [_ctx.iconComponent && !_ctx.center && _ctx.hasMessage ? (openBlock(), createBlock(_component_el_icon, {
						key: 0,
						class: normalizeClass([_ctx.ns.e("status"), _ctx.typeClass])
					}, {
						default: withCtx(() => [(openBlock(), createBlock(resolveDynamicComponent(_ctx.iconComponent)))]),
						_: 1
					}, 8, ["class"])) : createCommentVNode("v-if", true), _ctx.hasMessage ? (openBlock(), createElementBlock("div", {
						key: 1,
						class: normalizeClass(_ctx.ns.e("message"))
					}, [renderSlot(_ctx.$slots, "default", {}, () => [!_ctx.dangerouslyUseHTMLString ? (openBlock(), createBlock(resolveDynamicComponent(_ctx.showInput ? "label" : "p"), {
						key: 0,
						for: _ctx.showInput ? _ctx.inputId : void 0,
						textContent: toDisplayString(_ctx.message)
					}, null, 8, ["for", "textContent"])) : (openBlock(), createBlock(resolveDynamicComponent(_ctx.showInput ? "label" : "p"), {
						key: 1,
						for: _ctx.showInput ? _ctx.inputId : void 0,
						innerHTML: _ctx.message
					}, null, 8, ["for", "innerHTML"]))])], 2)) : createCommentVNode("v-if", true)], 2), withDirectives(createBaseVNode("div", { class: normalizeClass(_ctx.ns.e("input")) }, [createVNode(_component_el_input, {
						id: _ctx.inputId,
						ref: "inputRef",
						modelValue: _ctx.inputValue,
						"onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => _ctx.inputValue = $event),
						type: _ctx.inputType,
						placeholder: _ctx.inputPlaceholder,
						"aria-invalid": _ctx.validateError,
						class: normalizeClass({ invalid: _ctx.validateError }),
						onKeydown: withKeys(_ctx.handleInputEnter, ["enter"])
					}, null, 8, [
						"id",
						"modelValue",
						"type",
						"placeholder",
						"aria-invalid",
						"class",
						"onKeydown"
					]), createBaseVNode("div", {
						class: normalizeClass(_ctx.ns.e("errormsg")),
						style: normalizeStyle({ visibility: !!_ctx.editorErrorMessage ? "visible" : "hidden" })
					}, toDisplayString(_ctx.editorErrorMessage), 7)], 2), [[vShow, _ctx.showInput]])], 10, _hoisted_3),
					_ctx.showCancelButton || _ctx.showConfirmButton ? (openBlock(), createElementBlock("div", {
						key: 1,
						class: normalizeClass(_ctx.ns.e("btns"))
					}, [_ctx.showCancelButton ? (openBlock(), createBlock(_component_el_button, {
						key: 0,
						type: _ctx.cancelButtonType === "text" ? "" : _ctx.cancelButtonType,
						text: _ctx.cancelButtonType === "text",
						loading: _ctx.cancelButtonLoading,
						"loading-icon": _ctx.cancelButtonLoadingIcon,
						class: normalizeClass([_ctx.cancelButtonClass]),
						round: _ctx.roundButton,
						size: _ctx.btnSize,
						onClick: _cache[3] || (_cache[3] = ($event) => _ctx.handleAction("cancel")),
						onKeydown: _cache[4] || (_cache[4] = withKeys(withModifiers(($event) => _ctx.handleAction("cancel"), ["prevent"]), ["enter"]))
					}, {
						default: withCtx(() => [createTextVNode(toDisplayString(_ctx.cancelButtonText || _ctx.t("el.messagebox.cancel")), 1)]),
						_: 1
					}, 8, [
						"type",
						"text",
						"loading",
						"loading-icon",
						"class",
						"round",
						"size"
					])) : createCommentVNode("v-if", true), withDirectives(createVNode(_component_el_button, {
						ref: "confirmRef",
						type: _ctx.confirmButtonType === "text" ? "" : _ctx.confirmButtonType,
						text: _ctx.confirmButtonType === "text",
						loading: _ctx.confirmButtonLoading,
						"loading-icon": _ctx.confirmButtonLoadingIcon,
						class: normalizeClass([_ctx.confirmButtonClasses]),
						round: _ctx.roundButton,
						disabled: _ctx.confirmButtonDisabled,
						size: _ctx.btnSize,
						onClick: _cache[5] || (_cache[5] = ($event) => _ctx.handleAction("confirm")),
						onKeydown: _cache[6] || (_cache[6] = withKeys(withModifiers(($event) => _ctx.handleAction("confirm"), ["prevent"]), ["enter"]))
					}, {
						default: withCtx(() => [createTextVNode(toDisplayString(_ctx.confirmButtonText || _ctx.t("el.messagebox.confirm")), 1)]),
						_: 1
					}, 8, [
						"type",
						"text",
						"loading",
						"loading-icon",
						"class",
						"round",
						"disabled",
						"size"
					]), [[vShow, _ctx.showConfirmButton]])], 2)) : createCommentVNode("v-if", true)
				], 6)]),
				_: 3
			}, 8, [
				"trapped",
				"focus-trap-el",
				"focus-start-el",
				"onReleaseRequested"
			])], 42, _hoisted_1)]),
			_: 3
		}, 8, [
			"z-index",
			"overlay-class",
			"mask"
		]), [[vShow, _ctx.visible]])]),
		_: 3
	});
}
var src_default = /* @__PURE__ */ _plugin_vue_export_helper_default$1(index_vue_vue_type_script_lang_default, [["render", _sfc_render]]);
//#endregion
//#region node_modules/element-plus/es/components/message-box/src/messageBox.mjs
var messageInstance = /* @__PURE__ */ new Map();
var getAppendToElement = (props) => {
	let appendTo = document.body;
	if (props.appendTo) {
		if (isString(props.appendTo)) appendTo = document.querySelector(props.appendTo);
		if (isElement(props.appendTo)) appendTo = props.appendTo;
		if (!isElement(appendTo)) {
			debugWarn("ElMessageBox", "the appendTo option is not an HTMLElement. Falling back to document.body.");
			appendTo = document.body;
		}
	}
	return appendTo;
};
var handleAction = (vnode, action) => {
	const vm = vnode.component?.proxy;
	return () => vm.handleAction(action);
};
var initInstance = (props, container, appContext = null) => {
	const vnode = createVNode(src_default, props, isFunction$1(props.message) || isVNode(props.message) ? { default: isFunction$1(props.message) ? () => props.message({
		confirm: handleAction(vnode, "confirm"),
		cancel: handleAction(vnode, "cancel"),
		close: handleAction(vnode, "close")
	}) : () => props.message } : null);
	vnode.appContext = appContext;
	render(vnode, container);
	getAppendToElement(props).appendChild(container.firstElementChild);
	return vnode.component;
};
var genContainer = () => {
	return document.createElement("div");
};
var showMessage = (options, appContext) => {
	const container = genContainer();
	options.onVanish = () => {
		render(null, container);
		messageInstance.delete(vm);
	};
	options.onAction = (action) => {
		const currentMsg = messageInstance.get(vm);
		let resolve;
		if (options.showInput) resolve = {
			value: vm.inputValue,
			action
		};
		else resolve = action;
		if (options.callback) options.callback(resolve, instance.proxy);
		else if (action === "cancel" || action === "close") if (options.distinguishCancelAndClose && action !== "cancel") currentMsg.reject("close");
		else currentMsg.reject("cancel");
		else currentMsg.resolve(resolve);
	};
	const instance = initInstance(options, container, appContext);
	const vm = instance.proxy;
	for (const prop in options) if (hasOwn(options, prop) && !hasOwn(vm.$props, prop)) if (prop === "closeIcon" && isObject$2(options[prop])) vm[prop] = markRaw(options[prop]);
	else vm[prop] = options[prop];
	vm.visible = true;
	return vm;
};
function MessageBox(options, appContext = null) {
	if (!isClient) return Promise.reject();
	let callback;
	if (isString(options) || isVNode(options)) options = { message: options };
	else callback = options.callback;
	return new Promise((resolve, reject) => {
		const vm = showMessage(options, appContext ?? MessageBox._context);
		messageInstance.set(vm, {
			options,
			callback,
			resolve,
			reject
		});
	});
}
var MESSAGE_BOX_VARIANTS = [
	"alert",
	"confirm",
	"prompt"
];
var MESSAGE_BOX_DEFAULT_OPTS = {
	alert: {
		closeOnPressEscape: false,
		closeOnClickModal: false
	},
	confirm: { showCancelButton: true },
	prompt: {
		showCancelButton: true,
		showInput: true
	}
};
MESSAGE_BOX_VARIANTS.forEach((boxType) => {
	MessageBox[boxType] = messageBoxFactory(boxType);
});
function messageBoxFactory(boxType) {
	return (message, title, options, appContext) => {
		let titleOrOpts = "";
		if (isObject$2(title)) {
			options = title;
			titleOrOpts = "";
		} else if (isUndefined(title)) titleOrOpts = "";
		else titleOrOpts = title;
		return MessageBox(Object.assign({
			title: titleOrOpts,
			message,
			type: "",
			...MESSAGE_BOX_DEFAULT_OPTS[boxType]
		}, options, { boxType }), appContext);
	};
}
MessageBox.close = () => {
	messageInstance.forEach((_, vm) => {
		vm.doClose();
	});
	messageInstance.clear();
};
MessageBox._context = null;
//#endregion
//#region node_modules/element-plus/es/components/message-box/index.mjs
var _MessageBox = MessageBox;
_MessageBox.install = (app) => {
	_MessageBox._context = app._context;
	app.config.globalProperties.$msgbox = _MessageBox;
	app.config.globalProperties.$messageBox = _MessageBox;
	app.config.globalProperties.$alert = _MessageBox.alert;
	app.config.globalProperties.$confirm = _MessageBox.confirm;
	app.config.globalProperties.$prompt = _MessageBox.prompt;
};
var ElMessageBox = _MessageBox;
//#endregion
//#region src/renderer/api/bridge.ts
var wrappedApiCache = /* @__PURE__ */ new WeakMap();
/** 将 IPC 参数转换为不含 Vue Proxy 的纯 JSON 数据。 */
function normalizeIpcArguments(args) {
	if (args.length === 0) return args;
	return JSON.parse(JSON.stringify(args));
}
/**
* 创建 preload API 的普通对象门面，在参数穿过 contextBridge 前完成序列化。
* 返回值保持原始 API 类型，调用方不需要逐处处理 reactive 对象。
*/
function wrapIpcApi(target) {
	const cached = wrappedApiCache.get(target);
	if (cached) return cached;
	const wrapped = {};
	wrappedApiCache.set(target, wrapped);
	Reflect.ownKeys(target).forEach((property) => {
		const value = Reflect.get(target, property);
		if (typeof value === "function") {
			Reflect.set(wrapped, property, (...args) => {
				return Reflect.apply(value, void 0, normalizeIpcArguments(args));
			});
			return;
		}
		if (value !== null && typeof value === "object") {
			Reflect.set(wrapped, property, wrapIpcApi(value));
			return;
		}
		Reflect.set(wrapped, property, value);
	});
	return wrapped;
}
//#endregion
//#region src/renderer/api/index.ts
/**
* 渲染进程 API 封装 - 访问 preload 暴露的 window.api。
* 渲染进程不直接访问 Node.js、文件系统、SQLite 或 COS 密钥。
*/
var bridgeApi = window.api;
if (!bridgeApi) throw new Error("API 未注入，请检查 preload 脚本");
var api = wrapIpcApi(bridgeApi);
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
export { _plugin_vue_export_helper_default$1 as $, onDeactivated as $i, isFirefox as $n, isArrayLikeObject as $r, search_default as $t, tagProps as A, toRefs as Aa, Fragment as Ai, getEventCode as An, useAttrs as Ar, circle_close_filled_default as At, ElBadge as B, isPlainObject$1 as Ba, createVNode as Bi, cAF as Bn, isElement as Br, full_screen_default as Bt, ElOptionGroup as C, reactive as Ca, render as Ci, isFragment as Cn, isClient as Cr, calendar_default as Ct, useProps as D, shallowRef as Da, withKeys as Di, useIdInjection as Dn, useDebounceFn as Dr, circle_check_default as Dt, defaultProps$1 as E, shallowReactive as Ea, vShow as Ei, useId as En, refDebounced as Er, check_default as Et, ConfigProvider as F, hasOwn as Fa, createBlock as Fi, getScrollBarWidth as Fn, definePropType as Fr, delete_default as Ft, ElInput as G, normalizeStyle as Ga, hasInjectionContext as Gi, addUnit as Gn, isWindow as Gr, more_default as Gt, isGreaterThan as H, isString as Ha, getCurrentInstance as Hi, useNamespace as Hn, isNumber as Hr, list_default as Ht, provideGlobalConfig as I, isArray$1 as Ia, createCommentVNode as Ii, getScrollContainer as In, entriesOf as Ir, document_default as It, ElTooltip as J, mergeProps as Ji, removeClass as Jn, isUndefined$1 as Jr, plus_default as Jt, inputProps as K, toDisplayString as Ka, inject as Ki, getStyle as Kn, pick as Kr, notebook_default as Kt, useGlobalComponentSettings as L, isDate as La, createElementBlock as Li, getScrollElement as Ln, getProp as Lr, download_default as Lt, ElButton as M, triggerRef as Ma, cloneVNode as Mi, whenMouse as Mn, throwError as Mr, close_default as Mt, ElButtonGroup as N, unref as Na, computed as Ni, useLockscreen as Nn, buildProp as Nr, d_arrow_left_default as Nt, selectKey as O, toRaw as Oa, withModifiers as Oi, Ee as On, useThrottleFn as Or, circle_check_filled_default as Ot, TinyColor as P, NOOP as Pa, createBaseVNode as Pi, animateScrollTo as Pn, buildProps as Pr, d_arrow_right_default as Pt, focus_trap_default$1 as Q, onBeforeUpdate as Qi, isAndroid as Qn, findLastIndex as Qr, scale_to_original_default as Qt, useGlobalConfig as R, isFunction$1 as Ra, createSlots as Ri, getScrollTop as Rn, keysOf as Rr, expand_default as Rt, ElOption as S, onScopeDispose as Sa, createApp as Si, isComment as Sn, clamp as Sr, box_default as St, selectProps as T, ref as Ta, vModelText as Ti, useZIndex as Tn, reactiveComputed as Tr, caret_top_default as Tt, BAR_MAP as U, normalizeClass as Ua, guardReactiveProps as Ui, useLocale as Un, isPropAbsent as Ur, loading_default as Ut, ElScrollbar as V, isPromise as Va, defineComponent as Vi, rAF as Vn, isEmpty as Vr, info_filled_default as Vt, scrollbarEmits as W, normalizeProps as Wa, h$1 as Wi, addClass as Wn, isUndefined as Wr, minus_default as Wt, useTooltipContentProps as X, onActivated as Xi, capitalize as Xn, isEqual as Xr, refresh_left_default as Xt, useTooltipTriggerProps as Y, nextTick as Yi, setStyle as Yn, isNil as Yr, question_filled_default as Yt, ElPopper as Z, onBeforeUnmount as Zi, escapeStringRegexp as Zn, fromPairs as Zr, refresh_right_default as Zt, ElDescriptions as _, effectScope as _a, INPUT_EVENT as _i, useEmptyValuesProps as _n, useMutationObserver as _r, arrow_down_default as _t, vLoading as a, renderList as aa, Set$1 as ai, ticket_default as an, triggerEvent as ar, useFormDisabled as at, ElCheckboxButton as b, isRef as ba, Transition as bi, useSizeProp as bn, useWindowFocus as br, arrow_up_default as bt, ElTableColumn as c, resolveDirective as ca, flatten as ci, warning_filled_default as cn, onClickOutside as cr, formItemContextKey as ct, ElDialog as d, useAttrs$1 as da, memoize as di, withInstall as dn, useCssVar as dr, ElIcon as dt, onMounted as ea, debounce as ei, setting_default as en, focusElement as er, castArray as et, composeRefs as f, useSlots as fa, baseRest as fi, withInstallDirective as fn, useDocumentVisibility as fr, CloseComponents as ft, dialogProps as g, withDirectives as ga, CHANGE_EVENT as gi, useEmptyValues as gn, useIntersectionObserver as gr, iconPropType as gt, dialogEmits as h, withCtx as ha, componentSizes as hi, useAriaProps as hn, useEventListener as hr, ValidateComponentsMap as ht, ElMessage as i, provide as ia, baseClone as ii, star_filled_default as in, isLeaf as ir, useFormItemInputId as it, ClickOutside as j, toValue as ja, Teleport as ji, getEventKey as jn, debugWarn as jr, clock_default as jt, ElTag as k, toRef as ka, Comment as ki, composeEventHandlers as kn, useTimeoutFn as kr, circle_close_default as kt, isValidComponentSize as l, resolveDynamicComponent as la, baseFlatten as li, zoom_in_default as ln, unrefElement as lr, OnlyChild as lt, ElOverlay as m, watchEffect as ma, isObject$1 as mi, withNoopInstall as mn, useElementSize as mr, TypeComponentsMap as mt, api as n, onUpdated as na, cacheHas as ni, sort_up_default as nn, getSibling as nr, unique as nt, Loading as o, renderSlot as oa, clamp$1 as oi, upload_default as on, useDeprecated as or, useFormSize as ot, useDialog as p, watch as pa, baseFindIndex as pi, withInstallFunction as pn, useElementBounding as pr, TypeComponents as pt, mutable as q, toHandlerKey as qa, isVNode as qi, hasClass as qn, omit as qr, picture_filled_default as qt, ElMessageBox as r, openBlock as ra, SetCache as ri, star_default as rn, isFocusable as rr, useFormItem as rt, ElTable as s, resolveComponent as sa, castArray$1 as si, user_default as sn, useCalcInputWidth as sr, formContextKey as st, _plugin_vue_export_helper_default as t, onUnmounted as ta, setToArray as ti, sort_down_default as tn, focusNode as tr, extractFirst as tt, ElPagination as u, toHandlers as ua, get as ui, zoom_out_default as un, useActiveElement as ur, roleTypes as ut, ElDescriptionsItem as v, getCurrentScope as va, UPDATE_MODEL_EVENT as vi, useComposition as vn, useResizeObserver as vr, arrow_left_default as vt, ElSelect as w, readonly as wa, vModelRadio as wi, isValidElementNode as wn, isIOS as wr, caret_right_default as wt, ElCheckboxGroup as x, markRaw as xa, TransitionGroup as xi, flattedChildren as xn, useWindowSize as xr, back_default as xt, ElCheckbox as y, isReactive as ya, EVENT_CODE as yi, useFocusController as yn, useVModel as yr, arrow_right_default as yt, buttonTypes as z, isObject$2 as za, createTextVNode as zi, scrollIntoView as zn, isBoolean as zr, fold_default as zt };
