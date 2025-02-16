/**
 * +----------------------------------------------------------------------
 * | 「e家宜业」 —— 助力物业服务升级，用心服务万千业主
 * +----------------------------------------------------------------------
 * | Copyright (c) 2020~2021 https://www.chowa.com All rights reserved.
 * +----------------------------------------------------------------------
 * | Licensed 未经许可不能去掉「e家宜业」和「卓瓦科技」相关版权
 * +----------------------------------------------------------------------
 * | Author: jixuecong@chowa.cn
 * +----------------------------------------------------------------------
 */

import { CwComponent } from '../common/component';
import { useChildren } from '../common/relation';
import { addUnit, getRect, getSystemInfoSync } from '../common/utils';
let ARRAY = [];
CwComponent({
    field: true,
    relation: useChildren('dropdown-item', function() {
        this.updateItemListData();
    }),
    props: {
        activeColor: {
            type: String,
            observer: 'updateChildrenData'
        },
        overlay: {
            type: Boolean,
            value: true,
            observer: 'updateChildrenData'
        },
        zIndex: {
            type: Number,
            value: 10
        },
        duration: {
            type: Number,
            value: 200,
            observer: 'updateChildrenData'
        },
        direction: {
            type: String,
            value: 'down',
            observer: 'updateChildrenData'
        },
        closeOnClickOverlay: {
            type: Boolean,
            value: true,
            observer: 'updateChildrenData'
        },
        closeOnClickOutside: {
            type: Boolean,
            value: true
        }
    },
    data: {
        itemListData: []
    },
    beforeCreate() {
        const { windowHeight } = getSystemInfoSync();
        this.windowHeight = windowHeight;
        ARRAY.push(this);
    },
    destroyed() {
        ARRAY = ARRAY.filter(item => item !== this);
    },
    methods: {
        updateItemListData() {
            this.setData({
                itemListData: this.children.map(child => child.data)
            });
        },
        updateChildrenData() {
            this.children.forEach(child => {
                child.updateDataFromParent();
            });
        },
        toggleItem(active) {
            this.children.forEach((item, index) => {
                const { showPopup } = item.data;
                if (index === active) {
                    item.toggle();
                } else if (showPopup) {
                    item.toggle(false, { immediate: true });
                }
            });
        },
        close() {
            this.children.forEach(child => {
                child.toggle(false, { immediate: true });
            });
        },
        getChildWrapperStyle() {
            const { zIndex, direction } = this.data;
            return getRect(this, '.cw-dropdown-menu').then(rect => {
                const { top = 0, bottom = 0 } = rect;
                const offset = direction === 'down' ? bottom : this.windowHeight - top;
                let wrapperStyle = `z-index: ${zIndex};`;
                if (direction === 'down') {
                    wrapperStyle += `top: ${addUnit(offset)};`;
                } else {
                    wrapperStyle += `bottom: ${addUnit(offset)};`;
                }
                return wrapperStyle;
            });
        },
        onTitleTap(event) {
            const { index } = event.currentTarget.dataset;
            const child = this.children[index];
            if (!child.data.disabled) {
                ARRAY.forEach(menuItem => {
                    if (menuItem && menuItem.data.closeOnClickOutside && menuItem !== this) {
                        menuItem.close();
                    }
                });
                this.toggleItem(index);
            }
        }
    }
});
