import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { PlusIcon, EditIcon, CheckIcon } from "lucide-react";

type Tab = {
  title: string;
  value: string;
  content?: string | React.ReactNode | any;
};

const SortableTab = ({
  tab,
  isActive,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className,
  activeClassName,
  editMode,
}: {
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  className?: string;
  activeClassName?: string;
  editMode: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: tab.value });

  const style = editMode
    ? {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isActive ? 1 : 0,
      }
    : {};

  return (
    <motion.button
      ref={setNodeRef}
      style={style}
      {...(editMode ? { ...attributes, ...listeners } : {})}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out",
        isActive ? "text-primary" : "text-muted-foreground hover:text-primary",
        className,
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {(isActive || !editMode) && (
        <motion.div
          layoutId="activeTab"
          className={cn(
            "absolute inset-0 bg-background/50 border-2 border-primary rounded-full",
            activeClassName,
          )}
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          animate={{
            opacity: isActive ? 1 : 0,
            scale: isActive ? 1 : 0.95,
          }}
        />
      )}
      <span className="relative z-10">{tab.title}</span>
    </motion.button>
  );
};

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}) => {
  const [active, setActive] = useState<Tab>(propTabs[0]);
  const [tabs, setTabs] = useState<Tab[]>(propTabs);
  const [hovering, setHovering] = useState(false);
  const [newTabTitle, setNewTabTitle] = useState("");
  const [editMode, setEditMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTabs((items) => {
        const oldIndex = items.findIndex((item) => item.value === active.id);
        const newIndex = items.findIndex((item) => item.value === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleTabClick = (tab: Tab) => {
    if (!editMode) {
      setActive(tab);
    }
  };

  const addNewTab = () => {
    if (newTabTitle.trim() !== "") {
      const newTab = {
        title: newTabTitle,
        value: newTabTitle.toLowerCase().replace(/\s+/g, "-"),
        content: (
          <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
            <p>{newTabTitle} tab</p>
          </div>
        ),
      };
      setTabs([...tabs, newTab]);
      setNewTabTitle("");
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  return (
    <div className="flex flex-col w-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tabs.map((tab) => tab.value)}
          strategy={horizontalListSortingStrategy}
        >
          <div
            className={cn(
              "flex flex-row items-center justify-start overflow-x-auto py-2 px-4 rounded-lg",
              containerClassName,
            )}
          >
            {tabs.map((tab) => (
              <SortableTab
                key={tab.value}
                tab={tab}
                isActive={active.value === tab.value}
                onClick={() => handleTabClick(tab)}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                className={cn("mr-2", tabClassName)}
                activeClassName={activeTabClassName}
                editMode={editMode}
              />
            ))}
            <div className="flex-grow"></div>
            {editMode && (
              <div className="flex items-center ml-2">
                <Input
                  type="text"
                  placeholder="New tab name"
                  value={newTabTitle}
                  onChange={(e) => setNewTabTitle(e.target.value)}
                  className="w-32 h-8 text-sm"
                />
                <Button
                  onClick={addNewTab}
                  variant="ghost"
                  size="icon"
                  className="ml-1"
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Button
              onClick={toggleEditMode}
              variant="ghost"
              size="icon"
              className="ml-2"
            >
              {editMode ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <EditIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </SortableContext>
      </DndContext>
      <div className={cn("mt-4", contentClassName)}>
        <FadeInDiv
          tabs={tabs}
          active={active}
          key={active.value}
          hovering={hovering}
        />
      </div>
    </div>
  );
};

const FadeInDiv = ({
  tabs,
  active,
  hovering,
}: {
  tabs: Tab[];
  active: Tab;
  hovering?: boolean;
}) => {
  return (
    <div className="relative w-full h-full">
      {tabs.map((tab, idx) => (
        <motion.div
          key={tab.value}
          layoutId={tab.value}
          style={{
            zIndex: tab.value === active.value ? 10 : tabs.length - idx,
            opacity: tab.value === active.value ? 1 : 0,
            pointerEvents: tab.value === active.value ? "auto" : "none",
          }}
          animate={{
            scale: tab.value === active.value ? 1 : 0.9,
            y: tab.value === active.value ? 0 : 20,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-0 w-full h-full"
        >
          {tab.content}
        </motion.div>
      ))}
    </div>
  );
};
