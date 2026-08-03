interface ModalProps {
    aberto: boolean;
    titulo: string;
    onClose: () => void;
    children: React.ReactNode;
}

export default function Modal({
    aberto,
    titulo,
    onClose,
    children
}: ModalProps) {

    if (!aberto) {
        return null;
    }

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

                <div className="flex items-center justify-between border-b px-6 py-4">

                    <h3 className="text-lg font-semibold text-slate-800">
                        {titulo}
                    </h3>

                    <button
                        onClick={onClose}
                        className="text-2xl text-slate-400 hover:text-slate-700"
                    >
                        ×
                    </button>

                </div>

                <div className="p-6">

                    {children}

                </div>

            </div>

        </div>

    );
}