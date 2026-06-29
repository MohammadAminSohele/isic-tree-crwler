(async function runBehinyabClicks() {
  // تنظیمات
  const STORAGE_KEY = 'behinyab_progress_v1';
  const BATCH_SIZE = 10; // تعداد آیتمی که در هر اجرا کلیک می‌شود
  const CLICK_DELAY_MS = 800; // تاخیر بین کلیک‌ها
  const EXPAND_DELAY_MS = 300; // تاخیر بعد از باز کردن هر گره

  // کمک‌افزار تاخیر
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // خواندن/نوشتن ایندکس از localStorage
  const getIndex = () => {
    const v = localStorage.getItem(STORAGE_KEY);
    return v ? parseInt(v, 10) : 0;
  };
  const setIndex = i => localStorage.setItem(STORAGE_KEY, String(i));

  // تابعی که اجداد یک عنصر fancytree را باز می‌کند
  async function ensureAncestorsExpanded(el) {
    // پیدا کردن نزدیک‌ترین node
    let node = el.closest('.fancytree-node');
    // صعود در DOM به سمت بالا و کلیک روی expander هر گره
    while (node) {
      // expander معمولاً داخل node و قبل از title است
      const exp = node.querySelector(':scope > .fancytree-expander, :scope .fancytree-expander');
      if (exp) {
        // اگر aria-expanded موجود است و false است یا صفت وجود ندارد، سعی می‌کنیم کلیک کنیم
        const aria = exp.getAttribute('aria-expanded');
        if (aria !== 'true') {
          try { exp.click(); } catch(e) { exp.dispatchEvent(new MouseEvent('click', {bubbles:true})); }
          await sleep(EXPAND_DELAY_MS);
        }
      }
      // حرکت به گره والد (صعود یک سطح)
      const parent = node.parentElement;
      if (!parent) break;
      node = parent.closest('.fancytree-node');
    }
  }

  // گرفتن همه لینک‌های اطلاعات داخل صفحه (ترتیب DOM)
  const allAnchors = Array.from(document.querySelectorAll('a.jsPanelsV4'));
  if (!allAnchors.length) {
    console.warn('هیچ عنصری با selector a.jsPanelsV4 پیدا نشد.');
    return;
  }

  let start = getIndex();
  if (start >= allAnchors.length) {
    console.log('همه آیتم‌ها قبلاً پردازش شده‌اند. برای شروع مجدد setIndex را صفر کنید.');
    return;
  }

  console.log(`شروع از ایندکس ${start} از ${allAnchors.length} آیتم. اجرای حداکثر ${BATCH_SIZE} کلیک.`);

  let processed = 0;
  for (let i = start; i < allAnchors.length && processed < BATCH_SIZE; i++) {
    const a = allAnchors[i];
    try {
      // باز کردن اجداد تا لینک قابل کلیک شود
      await ensureAncestorsExpanded(a);
      // اسکرول به لینک برای اطمینان از قابل مشاهده بودن
      a.scrollIntoView({behavior: 'smooth', block: 'center'});
      await sleep(200);
      // کلیک روی لینک (باز کردن پنل اطلاعات)
      try { a.click(); } catch(e) { a.dispatchEvent(new MouseEvent('click', {bubbles:true})); }
      console.log(`کلیک شد روی آیتم ${i}`, a);
      processed++;
      setIndex(i + 1); // ذخیره پیشرفت (بعد از کلیک)
      await sleep(CLICK_DELAY_MS);
    } catch (err) {
      console.error('خطا هنگام پردازش آیتم', i, err);
      // در صورت خطا، باز هم ایندکس را ذخیره می‌کنیم تا از همانجا ادامه دهیم
      setIndex(i);
      break;
    }
  }

  if (start + processed >= allAnchors.length) {
    console.log('تمام آیتم‌ها پردازش شدند.');
  } else {
    console.log(`پایان اجرا: ${processed} آیتم پردازش شد. برای ادامه دوباره اسکریپت را اجرا کنید.`);
  }
})();
