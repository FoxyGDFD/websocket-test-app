import { createFileRoute } from '@tanstack/react-router';
import CursorTracker from '@widgets/CursorTracker';

export const Route = createFileRoute('/')({
  component: IndexPage,
});

export default function IndexPage() {
  return <CursorTracker />;
}
