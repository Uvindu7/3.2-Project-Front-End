import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState(null);

  const close = () => setModalState(null);

  // type = 'info' | 'success' | 'error'
  const showAlert = (title, message, type = 'info') => {
    setModalState({ type: 'alert', alertType: type, title, message });
  };

  const showConfirm = (title, message, onConfirm, confirmText = 'Confirm') => {
    setModalState({ type: 'confirm', title, message, onConfirm, confirmText });
  };

  const renderIcon = () => {
    if (modalState?.type === 'confirm' || modalState?.alertType === 'error') {
      return (
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 mx-auto">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
      );
    }
    if (modalState?.alertType === 'success') {
      return (
        <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4 mx-auto">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    }
    // info
    return (
      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 mx-auto">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    );
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm, close }}>
      {children}

      {modalState && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="text-center">
              {renderIcon()}
              <h3 className="text-lg font-bold text-zinc-900 mb-2">{modalState.title}</h3>
              <p className="text-zinc-500 text-sm mb-6">{modalState.message}</p>
            </div>
            
            <div className="flex gap-3 w-full">
              {modalState.type === 'confirm' ? (
                <>
                  <button
                    onClick={close}
                    className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm tracking-wide text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      modalState.onConfirm();
                      close();
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm tracking-wide text-white bg-red-600 hover:bg-red-700 transition-colors"
                  >
                    {modalState.confirmText}
                  </button>
                </>
              ) : (
                <button
                  onClick={close}
                  className="w-full px-4 py-2.5 rounded-xl font-bold text-sm tracking-wide text-white bg-black hover:bg-zinc-800 transition-colors"
                >
                  Okay
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
