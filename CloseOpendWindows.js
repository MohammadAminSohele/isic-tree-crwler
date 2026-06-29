(function() {
    'use strict';
    
    console.log('=== شروع عملیات بستن کامل پنجره ===');
    
    // تابع برای پیدا کردن و کلیک روی دکمه بستن
    function tryToClose() {
        var selectors = [
            '.jsPanel-btn-close',
            '.jsPanel-btn.jsPanel-btn-close',
            '[data-control="close"]',
            '[aria-label="Close"]',
            '.jsPanel-close',
            '.close',
            '.btn-close',
            '.jsPanel-headerbar .jsPanel-btn:last-child'
        ];
        
        for (var i = 0; i < selectors.length; i++) {
            var btn = document.querySelector(selectors[i]);
            if (btn && btn.offsetParent !== null) {
                console.log('✅ دکمه بستن با سلکتور "' + selectors[i] + '" پیدا شد');
                btn.click();
                return true;
            }
        }
        
        return false;
    }
    
    // تابع برای بستن کامل با متدهای jsPanel
    function tryJsPanelClose() {
        if (typeof window.jsp === 'undefined' && typeof window.JsPanel === 'undefined') {
            return false;
        }
        
        var panels = document.querySelectorAll('.jsPanel');
        var closed = 0;
        
        for (var i = 0; i < panels.length; i++) {
            var panel = panels[i];
            var id = panel.id;
            
            // بررسی در jsp
            if (window.jsp && window.jsp[id]) {
                try {
                    window.jsp[id].close(); // متد close واقعی
                    closed++;
                    console.log('✅ بسته شد با jsp[' + id + ']');
                } catch(e) {}
            }
            
            // بررسی در JsPanel
            if (window.JsPanel && window.JsPanel[id]) {
                try {
                    window.JsPanel[id].close(); // متد close واقعی
                    closed++;
                    console.log('✅ بسته شد با JsPanel[' + id + ']');
                } catch(e) {}
            }
        }
        
        return closed > 0;
    }
    
    // روش اصلی: حذف کامل عناصر از DOM
    function tryRemovePanels() {
        var panels = document.querySelectorAll('.jsPanel');
        
        if (panels.length === 0) {
            return false;
        }
        
        var removed = 0;
        for (var i = panels.length - 1; i >= 0; i--) {
            var panel = panels[i];
            
            // اول سعی می‌کنیم با متد close ببندیم
            if (typeof panel.close === 'function') {
                try {
                    panel.close();
                    removed++;
                    console.log('✅ بسته شد با متد close');
                    continue;
                } catch(e) {}
            }
            
            // اگر close کار نکرد، عنصر رو حذف می‌کنیم
            if (panel.parentNode) {
                panel.parentNode.removeChild(panel);
                removed++;
                console.log('✅ حذف شد از DOM');
            }
        }
        
        return removed > 0;
    }
    
    // اجرای روش‌ها به ترتیب
    setTimeout(function() {
        console.log('🔄 روش اول: تلاش برای پیدا کردن دکمه بستن...');
        if (!tryToClose()) {
            console.log('🔄 روش دوم: تلاش با jsPanel API...');
            if (!tryJsPanelClose()) {
                console.log('🔄 روش سوم: حذف مستقیم از DOM...');
                if (!tryRemovePanels()) {
                    console.log('⚠️ هیچ پنجره‌ای پیدا نشد!');
                }
            }
        }
    }, 500);
    
    // بررسی نهایی: اگر هنوز پنجره مونده، حذفش کن
    setTimeout(function() {
        var panels = document.querySelectorAll('.jsPanel');
        if (panels.length > 0) {
            console.log('🔄 حذف نهایی ' + panels.length + ' پنجره باقیمانده...');
            for (var i = panels.length - 1; i >= 0; i--) {
                if (panels[i].parentNode) {
                    panels[i].parentNode.removeChild(panels[i]);
                    console.log('✅ حذف شد');
                }
            }
        } else {
            console.log('✅ همه پنجره‌ها با موفقیت بسته شدند');
        }
    }, 2000);
    
})();
