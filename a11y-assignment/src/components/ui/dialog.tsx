import * as React from "react"

export function Dialog({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { isOpen, setIsOpen })
        }
        return child
      })}
    </>
  )
}

export function DialogTrigger({ children, isOpen, setIsOpen }: any) {
  return React.cloneElement(children, {
    onClick: (e: any) => {
      children.props.onClick?.(e)
      setIsOpen(true)
    }
  })
}

export function DialogContent({ children, isOpen, setIsOpen }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 text-white p-6 rounded-xl shadow-2xl max-w-lg w-full relative animate-in fade-in zoom-in-95 duration-200">
        {children}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-slate-800 p-1.5 rounded-full transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 space-y-1.5">{children}</div>
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold tracking-tight">{children}</h2>
}

export function DialogDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-400">{children}</p>
}