import { cn } from '@/lib/utils';
import Image from 'next/image';

const Avatar = ({ avatarImgSrc, size = 96, className }) => {
  const emptyAvatar = "https://www.gosfordpark-coventry.org.uk/wp-content/uploads/blank-avatar.png"
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-full border border-gray-300',
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src={avatarImgSrc || emptyAvatar}
        alt="Avatar"
        fill={true}
        className="object-cover object-center"
      />
    </div>
  );
};

export default Avatar;
