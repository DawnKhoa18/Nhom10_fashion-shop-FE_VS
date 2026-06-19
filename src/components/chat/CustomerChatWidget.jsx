import React, { useEffect, useRef, useState } from 'react';
import { createChatSocket } from '../../services/chatSocket';

const CustomerChatWidget = () => {
  const customerId = localStorage.getItem('customerId');
  const fullName = localStorage.getItem('fullName') || 'Khách hàng';
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('disconnected');
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const openRef = useRef(false);

  const readStorageKey = customerId ? `chatCustomerLastRead:${customerId}` : '';

  const markAdminMessagesAsRead = (nextMessages) => {
    if (!customerId) return;
    const adminMessages = (nextMessages || []).filter((item) => item.senderRole === 'ADMIN');
    const latestId = adminMessages.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
    if (latestId) localStorage.setItem(readStorageKey, String(latestId));
    setUnreadCount(0);
  };

  const updateCustomerUnread = (nextMessages) => {
    const lastRead = Number(localStorage.getItem(readStorageKey) || 0);
    const count = (nextMessages || []).filter(
      (item) => item.senderRole === 'ADMIN' && Number(item.id) > lastRead
    ).length;
    setUnreadCount(count);
  };

  useEffect(() => {
    if (!customerId) return undefined;
    socketRef.current = createChatSocket({
      role: 'CUSTOMER',
      userId: customerId,
      name: fullName,
      onStatus: setStatus,
      onEvent: (event) => {
        if (event.type === 'HISTORY') {
          const nextMessages = event.messages || [];
          setMessages(nextMessages);
          if (openRef.current) markAdminMessagesAsRead(nextMessages);
          else updateCustomerUnread(nextMessages);
        }
        if (event.type === 'MESSAGE') {
          setMessages((old) => {
            const nextMessages = [...old.filter((item) => item.id !== event.message.id), event.message];
            if (openRef.current) markAdminMessagesAsRead(nextMessages);
            else updateCustomerUnread(nextMessages);
            return nextMessages;
          });
        }
      }
    });
    return () => socketRef.current?.close();
  }, [customerId, fullName]);

  useEffect(() => {
    openRef.current = open;
    if (open) {
      markAdminMessagesAsRead(messages);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const submit = (event) => {
    event.preventDefault();
    const value = content.trim();
    if (!value) return;
    if (socketRef.current?.send({ type: 'MESSAGE', content: value })) setContent('');
  };

  return (
    <div className="customer-chat">
      {open && (
        <div className="customer-chat-panel shadow-lg">
          <div className="customer-chat-header">
            <div>
              <strong>Hỗ trợ trực tuyến</strong>
              <small>{status === 'connected' ? 'Đang hoạt động' : 'Đang kết nối...'}</small>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Đóng"><i className="bi bi-x-lg" /></button>
          </div>

          {!customerId ? (
            <div className="customer-chat-login">
              <i className="bi bi-person-lock fs-2" />
              <p>Vui lòng đăng nhập để trò chuyện với cửa hàng.</p>
              <a href="/login" className="btn btn-dark btn-sm btn-view fw-bold">Đăng nhập</a>
            </div>
          ) : (
            <>
              <div className="customer-chat-messages">
                {messages.length === 0 && <div className="chat-empty">Xin chào! Shop có thể giúp gì cho bạn?</div>}
                {messages.map((message) => (
                  <div key={message.id} className={`chat-message ${message.senderRole === 'CUSTOMER' ? 'mine' : 'theirs'}`}>
                    <div>{message.content}</div>
                    <small>{message.senderRole === 'ADMIN' ? 'Nhân viên' : 'Bạn'}</small>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <form className="customer-chat-form" onSubmit={submit}>
                <input value={content} onChange={(event) => setContent(event.target.value)} placeholder="Nhập tin nhắn..." maxLength={1000} />
                <button type="submit" disabled={status !== 'connected'}><i className="bi bi-send-fill" /></button>
              </form>
            </>
          )}
        </div>
      )}

      <button type="button" className="customer-chat-button shadow" onClick={() => setOpen((value) => !value)}>
        <i className={`bi ${open ? 'bi-x-lg' : 'bi-chat-dots-fill'}`} />
        {!open && unreadCount > 0 && (
          <span className="chat-unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>
    </div>
  );
};

export default CustomerChatWidget;
