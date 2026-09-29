/* =========================================================
   روتيني الصحي
   Daily Health Routine
========================================================= */


/* =========================================================
   1) المهام اليومية
========================================================= */

const TASKS = [
    {
        id: "wake",
        time: "06:00",
        title: "صحّي من النوم",
        description: "ابدأ يومك بهدوء واشرب شوية مية."
    },
    {
        id: "breakfast",
        time: "06:30",
        title: "الفطار",
        description: "خد فطار متوازن قبل ما تبدأ يومك."
    },
    {
        id: "school",
        time: "07:00",
        title: "المدرسة",
        description: "ركز في يومك الدراسي وخلي المية معاك."
    },
    {
        id: "water1",
        time: "09:00",
        title: "اشرب مية",
        description: "خد كوب مية أثناء اليوم."
    },
    {
        id: "school_break",
        time: "11:00",
        title: "استراحة وحركة",
        description: "قوم اتحرك شوية بدل القعدة الطويلة."
    },
    {
        id: "lunch",
        time: "16:30",
        title: "الغدا",
        description: "وجبة متوازنة فيها مصدر بروتين وخضار ونشويات."
    },
    {
        id: "study",
        time: "17:30",
        title: "المذاكرة",
        description: "ذاكر على فترات وخد فواصل قصيرة للحركة."
    },
    {
        id: "movement",
        time: "19:00",
        title: "حركة أو رياضة",
        description: "اختار نشاط بتحبه وحرك جسمك."
    },
    {
        id: "dinner",
        time: "20:00",
        title: "العشا",
        description: "اختار وجبة مناسبة ومشبعة."
    },
    {
        id: "sleep",
        time: "22:30",
        title: "الاستعداد للنوم",
        description: "ابعد عن الشاشة وابدأ تستعد للنوم."
    }
];


/* =========================================================
   2) الصلوات
   مواعيد تجريبية قابلة للتعديل
========================================================= */

const PRAYERS = [
    {
        id: "fajr",
        name: "الفجر",
        time: "05:00"
    },
    {
        id: "dhuhr",
        name: "الظهر",
        time: "12:00"
    },
    {
        id: "asr",
        name: "العصر",
        time: "15:30"
    },
    {
        id: "maghrib",
        name: "المغرب",
        time: "18:00"
    },
    {
        id: "isha",
        name: "العشاء",
        time: "19:30"
    }
];


/* =========================================================
   3) الإعدادات
========================================================= */

const STORAGE_DATA = "healthyRoutineData";
const STORAGE_SETTINGS = "healthyRoutineSettings";
const STORAGE_NOTIFIED = "healthyRoutineNotified";

const MAX_WATER = 8;


/* =========================================================
   4) عناصر الصفحة
========================================================= */

const tasksContainer =
    document.getElementById("tasks");

const prayersContainer =
    document.getElementById("prayers");

const waterCount =
    document.getElementById("waterCount");

const waterBig =
    document.getElementById("waterBig");

const waterFill =
    document.getElementById("waterFill");

const doneCount =
    document.getElementById("doneCount");

const progressPercent =
    document.getElementById("progressPercent");

const notificationStatus =
    document.getElementById("notificationStatus");

const todayName =
    document.getElementById("todayName");

const todayDate =
    document.getElementById("todayDate");

const addWater =
    document.getElementById("addWater");

const resetBtn =
    document.getElementById("resetBtn");

const enableNotifications =
    document.getElementById("enableNotifications");

const remindersToggle =
    document.getElementById("remindersToggle");

const adhanToggle =
    document.getElementById("adhanToggle");

const toast =
    document.getElementById("toast");

const adhanAudio =
    document.getElementById("adhanAudio");


/* =========================================================
   5) بيانات اليوم
========================================================= */

function getDateKey() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(now.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(now.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function getDefaultData() {

    return {
        date: getDateKey(),
        completedTasks: [],
        completedPrayers: [],
        water: 0
    };

}


function loadData() {

    try {

        const saved =
            localStorage.getItem(STORAGE_DATA);

        if (!saved) {
            return getDefaultData();
        }

        const savedData =
            JSON.parse(saved);

        if (
            !savedData ||
            savedData.date !== getDateKey()
        ) {

            return getDefaultData();

        }

        return {
            date: getDateKey(),

            completedTasks:
                Array.isArray(
                    savedData.completedTasks
                )
                    ? savedData.completedTasks
                    : [],

            completedPrayers:
                Array.isArray(
                    savedData.completedPrayers
                )
                    ? savedData.completedPrayers
                    : [],

            water:
                Math.max(
                    0,
                    Math.min(
                        MAX_WATER,
                        Number(savedData.water) || 0
                    )
                )
        };

    } catch (error) {

        console.log(
            "تعذر تحميل بيانات اليوم:",
            error
        );

        return getDefaultData();

    }

}


let data = loadData();


/* =========================================================
   6) الإعدادات المحفوظة
========================================================= */

function loadSettings() {

    const defaults = {
        reminders: true,
        adhan: true
    };

    try {

        const saved =
            localStorage.getItem(
                STORAGE_SETTINGS
            );

        if (!saved) {
            return defaults;
        }

        const parsed =
            JSON.parse(saved);

        return {
            reminders:
                parsed.reminders !== false,

            adhan:
                parsed.adhan !== false
        };

    } catch (error) {

        return defaults;

    }

}


let settings = loadSettings();


/* =========================================================
   7) حفظ البيانات
========================================================= */

function saveData() {

    localStorage.setItem(
        STORAGE_DATA,
        JSON.stringify(data)
    );

}


function saveSettings() {

    localStorage.setItem(
        STORAGE_SETTINGS,
        JSON.stringify(settings)
    );

}


/* =========================================================
   8) التاريخ
========================================================= */

function updateDate() {

    const now = new Date();

    const dayName =
        now.toLocaleDateString(
            "ar-EG",
            {
                weekday: "long"
            }
        );

    const formattedDate =
        now.toLocaleDateString(
            "ar-EG",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

    if (todayName) {

        todayName.textContent =
            dayName;

    }

    if (todayDate) {

        todayDate.textContent =
            formattedDate;

    }

}


/* =========================================================
   9) التأكد إن اليوم الحالي هو اليوم المحفوظ
========================================================= */

function checkNewDay() {

    const currentDate =
        getDateKey();

    if (data.date !== currentDate) {

        data = {
            date: currentDate,
            completedTasks: [],
            completedPrayers: [],
            water: 0
        };

        saveData();

        renderTasks();

        renderPrayers();

        updateWater();

        updateProgress();

        updateDate();

        showToast(
            "بدأ يوم جديد 🌅"
        );

    }

}


/* =========================================================
   10) عرض المهام
========================================================= */

function renderTasks() {

    if (!tasksContainer) return;

    tasksContainer.innerHTML = "";

    TASKS.forEach(task => {

        const isDone =
            data.completedTasks.includes(
                task.id
            );

        const card =
            document.createElement("div");

        card.className =
            `task ${isDone ? "done" : ""}`;

        card.innerHTML = `

            <button
                type="button"
                class="task-check"
                data-task="${task.id}"
                aria-label="تحديد المهمة"
            >
                ${isDone ? "✓" : ""}
            </button>

            <div class="task-info">

                <strong>
                    ${task.title}
                </strong>

                <small>
                    ${task.description}
                </small>

            </div>

            <span class="task-time">
                ${task.time}
            </span>

        `;

        tasksContainer.appendChild(card);

    });

}


/* =========================================================
   11) عرض الصلوات
========================================================= */

function renderPrayers() {

    if (!prayersContainer) return;

    prayersContainer.innerHTML = "";

    PRAYERS.forEach(prayer => {

        const isDone =
            data.completedPrayers.includes(
                prayer.id
            );

        const card =
            document.createElement("div");

        card.className =
            `prayer-card ${isDone ? "done" : ""}`;

        card.innerHTML = `

            <button
                type="button"
                class="prayer-check"
                data-prayer="${prayer.id}"
                aria-label="تحديد الصلاة"
            >
                ${isDone ? "✓" : ""}
            </button>

            <div class="prayer-info">

                <strong>
                    🕌 صلاة ${prayer.name}
                </strong>

                <small>
                    اضغط عند أداء الصلاة
                </small>

            </div>

            <span class="prayer-time">
                ${prayer.time}
            </span>

        `;

        prayersContainer.appendChild(card);

    });

}


/* =========================================================
   12) حساب التقدم
========================================================= */

function updateProgress() {

    const total =
        TASKS.length + PRAYERS.length;

    const completed =
        data.completedTasks.length +
        data.completedPrayers.length;

    const percentage =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );

    if (doneCount) {

        doneCount.textContent =
            completed;

    }

    if (progressPercent) {

        progressPercent.textContent =
            `${percentage}%`;

    }

    const ring =
        document.querySelector(
            ".progress-ring"
        );

    if (ring) {

        const degrees =
            percentage * 3.6;

        ring.style.background =
            `
            radial-gradient(
                circle,
                #101828 57%,
                transparent 59%
            ),
            conic-gradient(
                #64e6a8 0deg,
                #64e6a8 ${degrees}deg,
                #26344a ${degrees}deg
            )
            `;

    }

}


/* =========================================================
   13) عرض المية
========================================================= */

function updateWater() {

    const amount =
        Math.max(
            0,
            Math.min(
                MAX_WATER,
                Number(data.water) || 0
            )
        );

    data.water = amount;

    const percentage =
        (amount / MAX_WATER) * 100;

    if (waterCount) {

        waterCount.textContent =
            amount;

    }

    if (waterBig) {

        waterBig.textContent =
            amount;

    }

    if (waterFill) {

        waterFill.style.width =
            `${percentage}%`;

    }

}


/* =========================================================
   14) رسالة صغيرة
========================================================= */

let toastTimer = null;


function showToast(message) {

    if (!toast) return;

    toast.textContent =
        message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2200);

}


/* =========================================================
   15) تحديد مهمة
========================================================= */

function toggleTask(taskId) {

    checkNewDay();

    const index =
        data.completedTasks.indexOf(
            taskId
        );

    if (index >= 0) {

        data.completedTasks.splice(
            index,
            1
        );

    } else {

        data.completedTasks.push(
            taskId
        );

    }

    saveData();

    renderTasks();

    updateProgress();

    showToast(
        index >= 0
            ? "تم إلغاء المهمة"
            : "تم إنجاز المهمة ✅"
    );

}


/* =========================================================
   16) تحديد الصلاة
========================================================= */

function togglePrayer(prayerId) {

    checkNewDay();

    const index =
        data.completedPrayers.indexOf(
            prayerId
        );

    if (index >= 0) {

        data.completedPrayers.splice(
            index,
            1
        );

    } else {

        data.completedPrayers.push(
            prayerId
        );

    }

    saveData();

    renderPrayers();

    updateProgress();

    showToast(
        index >= 0
            ? "تم إلغاء تحديد الصلاة"
            : "ربنا يتقبل منك 🤲"
    );

}


/* =========================================================
   17) إضافة كوب مية
========================================================= */

function addWaterCup() {

    checkNewDay();

    if (data.water >= MAX_WATER) {

        showToast(
            "وصلت للحد الموجود في المتابعة 💧"
        );

        return;

    }

    data.water += 1;

    saveData();

    updateWater();

    showToast(
        "تم إضافة كوب مية 💧"
    );

}


/* =========================================================
   18) إعادة اليوم
========================================================= */

function resetDay() {

    data = {
        date: getDateKey(),
        completedTasks: [],
        completedPrayers: [],
        water: 0
    };

    saveData();

    renderTasks();

    renderPrayers();

    updateWater();

    updateProgress();

    updateDate();

    showToast(
        "تم إعادة تعيين اليوم 🔄"
    );

}


/* =========================================================
   19) حالة الإشعارات
========================================================= */

function updateNotificationStatus() {

    if (!notificationStatus) {
        return;
    }

    if (
        typeof Notification === "undefined"
    ) {

        notificationStatus.textContent =
            "غير مدعومة";

        return;

    }

    if (
        Notification.permission ===
        "granted"
    ) {

        notificationStatus.textContent =
            "مفعلة";

        if (enableNotifications) {

            enableNotifications.textContent =
                "الإشعارات مفعلة ✓";

        }

        return;
    }

    if (
        Notification.permission ===
        "denied"
    ) {

        notificationStatus.textContent =
            "مرفوضة";

        if (enableNotifications) {

            enableNotifications.textContent =
                "السماح بالإشعارات";

        }

        return;
    }

    notificationStatus.textContent =
        "مقفولة";

    if (enableNotifications) {

        enableNotifications.textContent =
            "تفعيل الإشعارات 🔔";

    }

}


/* =========================================================
   20) طلب إذن الإشعارات
========================================================= */

async function requestNotifications() {

    if (
        typeof Notification === "undefined"
    ) {

        showToast(
            "المتصفح لا يدعم الإشعارات"
        );

        return;

    }

    try {

        const permission =
            await Notification.requestPermission();

        updateNotificationStatus();

        if (permission === "granted") {

            showToast(
                "تم تفعيل الإشعارات 🔔"
            );

            sendNotification(
                "روتيني الصحي",
                "تم تفعيل التذكيرات بنجاح ✅"
            );

        } else if (
            permission === "denied"
        ) {

            showToast(
                "الإشعارات مرفوضة من المتصفح"
            );

        } else {

            showToast(
                "لم يتم تفعيل الإشعارات"
            );

        }

    } catch (error) {

        console.log(
            "Notification error:",
            error
        );

        showToast(
            "حصل خطأ في تفعيل الإشعارات"
        );

    }

}


/* =========================================================
   21) إرسال إشعار
========================================================= */

function sendNotification(
    title,
    body
) {

    if (
        !settings.reminders
    ) {
        return;
    }

    if (
        typeof Notification === "undefined"
    ) {
        return;
    }

    if (
        Notification.permission !==
        "granted"
    ) {
        return;
    }

    try {

        new Notification(
            title,
            {
                body: body,
                icon: "",
                badge: ""
            }
        );

    } catch (error) {

        console.log(
            "Notification error:",
            error
        );

    }

}


/* =========================================================
   22) مفتاح منع تكرار الإشعار
========================================================= */

function getNotifiedData() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_NOTIFIED
            );

        if (!saved) {

            return {
                date: getDateKey(),
                items: []
            };

        }

        const parsed =
            JSON.parse(saved);

        if (
            !parsed ||
            parsed.date !== getDateKey()
        ) {

            return {
                date: getDateKey(),
                items: []
            };

        }

        return parsed;

    } catch (error) {

        return {
            date: getDateKey(),
            items: []
        };

    }

}


function saveNotifiedData(value) {

    localStorage.setItem(
        STORAGE_NOTIFIED,
        JSON.stringify(value)
    );

}


/* =========================================================
   23) فحص التذكيرات
========================================================= */

function checkReminders() {

    checkNewDay();

    if (!settings.reminders) {
        return;
    }

    if (
        typeof Notification === "undefined"
    ) {
        return;
    }

    if (
        Notification.permission !==
        "granted"
    ) {
        return;
    }

    const now = new Date();

    const hour =
        String(now.getHours())
            .padStart(2, "0");

    const minute =
        String(now.getMinutes())
            .padStart(2, "0");

    const currentTime =
        `${hour}:${minute}`;

    const notified =
        getNotifiedData();

    let changed = false;


    /* =========================
       المهام
    ========================== */

    TASKS.forEach(task => {

        if (
            task.time !== currentTime
        ) {
            return;
        }

        if (
            data.completedTasks.includes(
                task.id
            )
        ) {
            return;
        }

        const key =
            `task-${task.id}-${currentTime}`;

        if (
            notified.items.includes(key)
        ) {
            return;
        }

        sendNotification(
            "روتيني الصحي ⏰",
            `${task.title} — ${task.description}`
        );

        notified.items.push(key);

        changed = true;

    });


    /* =========================
       الصلوات
    ========================== */

    PRAYERS.forEach(prayer => {

        if (
            prayer.time !== currentTime
        ) {
            return;
        }

        const key =
            `prayer-${prayer.id}-${currentTime}`;

        if (
            notified.items.includes(key)
        ) {
            return;
        }

        sendNotification(
            `حان الآن وقت صلاة ${prayer.name} 🕌`,
            "ربنا يتقبل منك 🤲"
        );

        if (
            settings.adhan
        ) {

            playAdhan();

        }

        notified.items.push(key);

        changed = true;

    });


    if (changed) {

        saveNotifiedData(
            notified
        );

    }

}


/* =========================================================
   24) تشغيل الأذان
========================================================= */

function playAdhan() {

    if (
        !settings.adhan
    ) {
        return;
    }

    if (!adhanAudio) {
        return;
    }

    try {

        adhanAudio.currentTime = 0;

        const result =
            adhanAudio.play();

        if (
            result &&
            typeof result.catch ===
            "function"
        ) {

            result.catch(error => {

                console.log(
                    "تشغيل الأذان منع بواسطة المتصفح:",
                    error
                );

            });

        }

    } catch (error) {

        console.log(
            "Adhan error:",
            error
        );

    }

}


/* =========================================================
   25) إعداد الإشعارات
========================================================= */

function setupNotifications() {

    if (remindersToggle) {

        remindersToggle.checked =
            settings.reminders;

        remindersToggle.addEventListener(
            "change",
            () => {

                settings.reminders =
                    remindersToggle.checked;

                saveSettings();

                showToast(
                    settings.reminders
                        ? "تم تشغيل التذكيرات 🔔"
                        : "تم إيقاف التذكيرات"
                );

            }
        );

    }


    if (adhanToggle) {

        adhanToggle.checked =
            settings.adhan;

        adhanToggle.addEventListener(
            "change",
            () => {

                settings.adhan =
                    adhanToggle.checked;

                saveSettings();

                showToast(
                    settings.adhan
                        ? "تم تشغيل الأذان 🕌"
                        : "تم إيقاف الأذان"
                );

            }
        );

    }


    if (enableNotifications) {

        enableNotifications.addEventListener(
            "click",
            requestNotifications
        );

    }


    updateNotificationStatus();

}


/* =========================================================
   26) الأحداث
========================================================= */

function setupEvents() {

    if (tasksContainer) {

        tasksContainer.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-task]"
                    );

                if (!button) {
                    return;
                }

                toggleTask(
                    button.dataset.task
                );

            }
        );

    }


    if (prayersContainer) {

        prayersContainer.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-prayer]"
                    );

                if (!button) {
                    return;
                }

                togglePrayer(
                    button.dataset.prayer
                );

            }
        );

    }


    if (addWater) {

        addWater.addEventListener(
            "click",
            addWaterCup
        );

    }


    if (resetBtn) {

        resetBtn.addEventListener(
            "click",
            resetDay
        );

    }

}


/* =========================================================
   27) تشغيل الموقع
========================================================= */

function initializeApp() {

    data = loadData();

    updateDate();

    renderTasks();

    renderPrayers();

    updateWater();

    updateProgress();

    setupNotifications();

    setupEvents();

}


/* =========================================================
   28) بدء التطبيق
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp,
        {
            once: true
        }
    );

} else {

    initializeApp();

}


/* =========================================================
   29) فحص التذكيرات
========================================================= */

setInterval(
    checkReminders,
    30000
);


/* =========================================================
   30) فحص تغيير اليوم
========================================================= */

setInterval(
    checkNewDay,
    30000
);


/* =========================================================
   نهاية الملف
========================================================= */