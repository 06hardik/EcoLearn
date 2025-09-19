// This script runs AFTER auth.js
document.addEventListener('auth-check-complete', () => {
    const API_BASE_URL = 'https://ecolearn-8436.onrender.com/api';
    const currentUser = window.currentUser;
    const initializePage = () => {
        if (!currentUser) {
            window.location.href = './index.html';
            return;
        }

        loadMyCourses();
        loadFeaturedLessons();
        loadProgressOverview();
    };

    async function loadMyCourses() {
        const container = document.getElementById('my-courses-container');
        container.innerHTML = '';
        
        if (currentUser && currentUser.enrolledCourses.length > 0) {
            for (const [i, courseId] of currentUser.enrolledCourses.entries()) {
                try {
                    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
                    const course = await response.json();
                    
                    const courseCard = document.createElement('div');
                    courseCard.className = `card-animated rounded-xl p-6 bg-green-50 border border-green-100 animate-scaleUp delay-${i+2} fade-scroll`;
                    courseCard.innerHTML = `
                        <div class="flex items-center gap-3 mb-2">
                            <span class="material-symbols-outlined text-xl animate-pulse">menu_book</span>
                            <span class="text-green-800 text-lg font-medium">${course.title}</span>
                        </div>
                        <p class="text-green-600 tracking-light text-base font-bold leading-tight mb-2">Progress: ${course.progress || '0'}%</p>
                        <p class="text-gray-500 text-sm">${course.description}</p>
                    `;
                    container.appendChild(courseCard);
                } catch(error) { console.error(`Failed to load course ${courseId}`, error) }
            }
        } else {
            container.innerHTML = '<p>You have not enrolled in any courses yet.</p>';
        }
    }

    async function loadFeaturedLessons() {
        const container = document.getElementById('featured-lessons-container');
        container.innerHTML = `
            <div class="card-animated rounded-xl p-6 bg-white border border-green-100 shadow-md animate-scaleUp delay-4 fade-scroll">
                <p class="text-green-700 text-lg font-semibold leading-normal flex items-center gap-2"><span class="material-symbols-outlined text-xl animate-pulse">lightbulb</span>Lesson Title</p>
                <p class="text-gray-500 text-sm font-normal leading-normal">Discover practical tips for sustainable living.</p>
            </div>
            <div class="card-animated rounded-xl p-6 bg-white border border-green-100 shadow-md animate-scaleUp delay-5 fade-scroll">
                <p class="text-green-700 text-lg font-semibold leading-normal flex items-center gap-2"><span class="material-symbols-outlined text-xl animate-pulse">lightbulb</span>Lesson Title</p>
                <p class="text-gray-500 text-sm font-normal leading-normal">Learn about renewable energy sources.</p>
            </div>
        `;
    }

    async function loadProgressOverview() {
        const container = document.getElementById('progress-overview-container');
        const totalCoursesResponse = await fetch(`${API_BASE_URL}/courses`);
        const allCourses = await totalCoursesResponse.json();
        
        const totalModulesInEnrolledCourses = currentUser.enrolledCourses.reduce((acc, courseId) => {
            const course = allCourses.find(c => c._id === courseId);
            return acc + (course ? course.modules.length : 0);
        }, 0);

        const completedModulesCount = currentUser.completedModules.length;
        const overallProgress = totalModulesInEnrolledCourses > 0 ? Math.round((completedModulesCount / totalModulesInEnrolledCourses) * 100) : 0;
        
        const completedCoursesCount = currentUser.enrolledCourses.filter(enrolledCourse => {
            const course = allCourses.find(c => c._id === enrolledCourse);
            if (!course || course.modules.length === 0) return false;
            return course.modules.every(module => currentUser.completedModules.includes(module._id));
        }).length;
        
        const courseCompletion = allCourses.length > 0 ? Math.round((completedCoursesCount / allCourses.length) * 100) : 0;

        container.innerHTML = `
            <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm card-animated animate-scaleUp delay-5 fade-scroll">
                <p class="text-green-700 text-lg font-semibold leading-normal flex items-center gap-2"><span class="material-symbols-outlined text-xl animate-pulse">trending_up</span>Your overall progress: <span class="font-bold text-green-600 ml-2">${overallProgress}%</span></p>
                <div class="mt-4">
                    <div class="mb-2 flex items-baseline justify-between"><p class="text-base font-medium text-neutral-900">Course Completion</p><p class="text-xl font-bold text-neutral-900">${courseCompletion}%</p></div>
                    <div class="h-3 w-full rounded-full bg-neutral-200"><div class="h-3 rounded-full bg-green-500" style="width: ${courseCompletion}%;"></div></div>
                    <p class="mt-2 text-sm text-neutral-600">Completed ${completedCoursesCount} out of ${allCourses.length} courses</p>
                </div>
            </div>
        `;
    }

    setTimeout(initializePage, 100); 
});