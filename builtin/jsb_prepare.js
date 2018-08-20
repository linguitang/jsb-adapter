/*
 * Copyright (c) 2014-2016 Chukong Technologies Inc.
 * Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

jsb.__obj_ref_id = 0;

jsb.registerNativeRef = function (owner, target) {
    if (owner && target && owner !== target) {
        let targetID = target.__jsb_ref_id;
        if (targetID === undefined)
            targetID = target.__jsb_ref_id = jsb.__obj_ref_id++;

        let refs = owner.__nativeRefs;
        if (!refs) {
            refs = owner.__nativeRefs = {};
        }

        refs[targetID] = target;
    }
};

jsb.unregisterNativeRef = function (owner, target) {
    if (owner && target && owner !== target) {
        let targetID = target.__jsb_ref_id;
        if (targetID === undefined)
            return;

        let refs = owner.__nativeRefs;
        if (!refs) {
            return;
        }

        delete refs[targetID];
    }
};

jsb.unregisterAllNativeRefs = function (owner) {
    if (!owner) return;
    delete owner.__nativeRefs;
};

jsb.unregisterChildRefsForNode = function (node, recursive) {
    if (!(node instanceof cc.Node)) return;
    recursive = !!recursive;
    let children = node.getChildren(), i, l, child;
    for (i = 0, l = children.length; i < l; ++i) {
        child = children[i];
        jsb.unregisterNativeRef(node, child);
        if (recursive) {
            jsb.unregisterChildRefsForNode(child, recursive);
        }
    }
};