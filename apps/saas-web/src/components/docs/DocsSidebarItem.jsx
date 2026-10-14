export function DocsSidebarItem({ id, label, activeId, onClick, icon: Icon }) {
  return (
    <li>
      <button
        onClick={() => onClick(id)}
        className={`group flex w-full cursor-pointer items-center rounded-md px-3.5 py-2 text-left text-xs font-semibold transition-all duration-150 sm:text-sm ${
          activeId === id
            ? "bg-blue-50/80 font-bold text-[#2f5bf5]"
            : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
        }`}
      >
        {Icon && (
          <Icon
            className={`mr-3 h-4.5 w-4.5 shrink-0 ${
              activeId === id
                ? "text-[#2f5bf5]"
                : "text-slate-400 group-hover:text-slate-600"
            }`}
          />
        )}
        <span>{label}</span>
      </button>
    </li>
  );
}
