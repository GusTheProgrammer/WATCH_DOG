import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableTabButton({ id, title, isActive, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  // Calculate the styles for the button
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: isActive ? "#222222" : "", // Active and inactive tab background color
    color: "#fff", // Text color based on active state
    cursor: 'move', // Shows drag cursor when hovering
    userSelect: 'none', // Prevent text selection while dragging
    border: isActive ? '1px solid #000' : 'none', // Active tab border
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`px-4 py-2 rounded text-sm focus:outline-none transition duration-100`}
      onClick={(e) => {
        e.stopPropagation(); // Prevent event propagation
        onClick(); // Call the onClick handler
      }}
    >
      {title}
    </button>
  );
}
