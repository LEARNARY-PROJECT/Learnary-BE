import { autoDeleteUnverifiedAccounts } from '../services/user.service';
import { autoDeleteRejectedCourseVideos } from '../services/course.service';

export const startCronJobs = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('⏸️  Cronjobs disabled in test environment');
    return;
  }
  startAutoDeleteUnverifiedAccountsJob();
  startAutoDeleteRejectedCourseVideosJob();
  console.log('✅ All cronjobs initialized successfully');
};
const startAutoDeleteUnverifiedAccountsJob = () => {
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24 giờ
  autoDeleteUnverifiedAccounts().then(result => {
      if (result.deletedCount > 0) {
        console.log(`🗑️  [Cronjob] Đã xóa ${result.deletedCount} tài khoản chưa xác thực`);
      } else {
        console.log(`✅ [Cronjob] Không có tài khoản nào cần xóa`);
      }
    })
    .catch(err => console.error('❌ [Cronjob Error - Auto Delete Unverified Accounts]:', err));
  // lặp lại mỗi 24 giờ
  setInterval(() => {
    autoDeleteUnverifiedAccounts().then(result => {
        if (result.deletedCount > 0) {
          console.log(`🗑️  [Cronjob] Đã xóa ${result.deletedCount} tài khoản chưa xác thực`);
        }
      })
      .catch(err => console.error('❌ [Cronjob Error - Auto Delete Unverified Accounts]:', err));
  }, TWENTY_FOUR_HOURS);
  console.log('✅Cronjob: Auto-delete unverified accounts enabled (runs every 24h)');
};

const startAutoDeleteRejectedCourseVideosJob = () => {
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24 giờ

  // Chạy ngay khi khởi động
  autoDeleteRejectedCourseVideos()
    .then(result => {
      if (result.deletedVideosCount > 0) {
        console.log(`🗑️  [Cronjob] ${result.message}`);
        console.log(`📋 [Cronjob] Các khóa học đã xóa video: ${result.courses?.join(', ')}`);
      } else {
        console.log(`✅ [Cronjob] ${result.message}`);
      }
    })
    .catch(err => console.error('❌ [Cronjob Error - Auto Delete Rejected Course Videos]:', err));

  // Lặp lại mỗi 24 giờ
  setInterval(() => {
    autoDeleteRejectedCourseVideos()
      .then(result => {
        if (result.deletedVideosCount > 0) {
          console.log(`🗑️  [Cronjob] ${result.message}`);
          console.log(`📋 [Cronjob] Các khóa học đã xóa video: ${result.courses?.join(', ')}`);
        }
      })
      .catch(err => console.error('❌ [Cronjob Error - Auto Delete Rejected Course Videos]:', err));
  }, TWENTY_FOUR_HOURS);

  console.log('✅ Cronjob: Auto-delete rejected course videos enabled (runs every 24h)');
};
