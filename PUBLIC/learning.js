// This script runs AFTER auth.js
document.addEventListener('auth-check-complete', () => {
    const API_BASE_URL = 'http://localhost:8000/api';
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
            for (const courseId of currentUser.enrolledCourses) {
                try {
                    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
                    const course = await response.json();
                    
                    const courseCard = document.createElement('div');
                    courseCard.className = "group transform-gpu overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg";
                    courseCard.innerHTML = `
                        <div class="relative h-48 w-full">
                            <div class="h-full w-full bg-cover bg-center" style="background-image: url('${course.imageUrl}');"></div>
                            <div class="absolute inset-0 bg-black/20"></div>
                        </div>
                        <div class="p-4">
                            <h3 class="text-lg font-semibold text-neutral-900">${course.title}</h3>
                            <p class="mt-1 text-sm text-neutral-600">${course.description}</p>
                        </div>`;
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
            <div class="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
                <div class="h-48 w-full flex-shrink-0 rounded-md bg-cover bg-center sm:h-32 sm:w-48" style='background-image: url("https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=1974&auto=format&fit=crop");'></div>
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-neutral-900">Lesson 1: Understanding Ecosystems</h3>
                    <p class="mt-1 text-neutral-600">Watch this video to learn about the interconnectedness of ecosystems.</p>
                    <button class="mt-4 inline-flex items-center gap-2 rounded-md bg-green-100 px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-green-200">
                        <span class="material-symbols-outlined"> play_circle </span> Watch Now
                    </button>
                </div>
            </div>`;
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
            <div class="space-y-6">
                <div>
                    <div class="mb-2 flex items-baseline justify-between"><p class="text-base font-medium text-neutral-900">Overall Progress</p><p class="text-xl font-bold text-neutral-900">${overallProgress}%</p></div>
                    <div class="h-3 w-full rounded-full bg-neutral-200"><div class="h-3 rounded-full bg-green-500" style="width: ${overallProgress}%;"></div></div>
                    <p class="mt-2 text-sm text-neutral-600">Completed ${completedModulesCount} out of ${totalModulesInEnrolledCourses} modules</p>
                </div>
                <div>
                    <div class="mb-2 flex items-baseline justify-between"><p class="text-base font-medium text-neutral-900">Course Completion</p><p class="text-xl font-bold text-neutral-900">${courseCompletion}%</p></div>
                    <div class="h-3 w-full rounded-full bg-neutral-200"><div class="h-3 rounded-full bg-green-500" style="width: ${courseCompletion}%;"></div></div>
                    <p class="mt-2 text-sm text-neutral-600">Completed ${completedCoursesCount} out of ${allCourses.length} courses</p>
                </div>
            </div>`;
    }

    setTimeout(initializePage, 100); 
});