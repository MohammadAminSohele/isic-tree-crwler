(async function safeExpandTree(delay = 500) {
    
    // تابع برای پیدا کردن گره‌های بسته
    const getExpandable = () => {
        return Array.from(document.querySelectorAll('tr.fancytree-has-children')).filter(tr => {
            const isClosed = tr.classList.contains('fancytree-exp-cd') || 
                            tr.classList.contains('fancytree-exp-c') ||
                            tr.classList.contains('fancytree-exp-cdl');
            const isLoading = tr.classList.contains('fancytree-loading');
            return isClosed && !isLoading;
        });
    };
    
    // تابع برای کلیک روی گره
    const clickNode = (node) => {
        const clickable = node.querySelector('.fancytree-title, .fancytree-expander');
        if (clickable) {
            clickable.click();
        } else {
            node.click();
        }
    };
    
    // تابع برای منتظر ماندن تا لود شدن داده‌ها (کوتاه‌تر شده)
    const waitForLoad = () => {
        return new Promise((resolve) => {
            const checkLoading = () => {
                const loadingNodes = document.querySelectorAll('tr.fancytree-loading');
                return loadingNodes.length === 0;
            };
            
            if (!checkLoading()) {
                const observer = new MutationObserver((mutations, obs) => {
                    if (checkLoading()) {
                        obs.disconnect();
                        setTimeout(resolve, 150);
                    }
                });
                observer.observe(document.body, { 
                    childList: true, 
                    subtree: true, 
                    attributes: true,
                    attributeFilter: ['class']
                });
                setTimeout(() => {
                    observer.disconnect();
                    resolve();
                }, 3000);
            } else {
                setTimeout(resolve, 100);
            }
        });
    };
    
    console.log('🚀 شروع باز کردن درخت با سرعت بالا...');
    let clickCount = 0;
    let lastCount = -1;
    let noProgressCount = 0;
    
    while (true) {
        const nodes = getExpandable();
        
        if (nodes.length === 0) {
            console.log(`✨ کار تمام شد! ${clickCount} گره در ${(clickCount * delay / 1000).toFixed(1)} ثانیه باز شد.`);
            break;
        }
        
        if (nodes.length === lastCount) {
            noProgressCount++;
            if (noProgressCount >= 3) {
                console.log(`⚠️ پیشرفتی حاصل نشد.`);
                break;
            }
        } else {
            noProgressCount = 0;
        }
        
        lastCount = nodes.length;
        
        const node = nodes[0];
        const titleEl = node.querySelector('.fancytree-title');
        const nodeText = titleEl?.innerText?.trim()?.slice(0, 40) || 'گره';
        
        console.log(`🖱️ (${clickCount + 1}) باز کردن: ${nodeText} | باقیمانده: ${nodes.length - 1}`);
        
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await new Promise(r => setTimeout(r, 100));
        
        clickNode(node);
        clickCount++;
        
        await waitForLoad();
        await new Promise(r => setTimeout(r, delay));
    }
    
    console.log(`🎉 درخت کاملاً باز شد! مجموعاً ${clickCount} کلیک.`);
    
    const msg = document.createElement('div');
    msg.style.cssText = 'position:fixed; bottom:20px; right:20px; background:#4CAF50; color:white; padding:8px 16px; border-radius:8px; z-index:10000; font-family:inherit; direction:rtl; font-size:13px;';
    msg.innerHTML = `✅ باز شدن کامل | ${clickCount} کلیک در ${(clickCount * delay / 1000).toFixed(1)} ثانیه`;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 4000);
    
})();
