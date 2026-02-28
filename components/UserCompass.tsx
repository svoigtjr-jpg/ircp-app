import CompassContent from './CompassContent';

type NorthStarPoint = { label: string; text: string };

type UserCompassProps = {
  northStar: {
    blurb: string;
    points: NorthStarPoint[];
  };
};

export default function UserCompass({ northStar }: UserCompassProps) {
  return (
    <div className="userCompassRoot" aria-label="User Compass">
      <CompassContent northStar={northStar} compact />
    </div>
  );
}
