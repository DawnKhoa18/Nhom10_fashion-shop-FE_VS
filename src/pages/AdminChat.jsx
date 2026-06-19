import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createChatSocket } from '../services/chatSocket';

const AdminChat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('disconnected');
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    socketRef.current = createChatSocket({
      role: 'ADMIN',
      userId: localStorage.getItem('employeeId') || 'admin',
      name: localStorage.getItem('fullName') || 'Nhân viên',
      onStatus: setStatus,
      onEvent: (event) => {
        if (event.type === 'SNAPSHOT') {
          setConversations(event.conversations || []);
          setSelectedId((current) => current || event.conversations?.[0]?.customerId || '');
        }
      }
    });
    return () => socketRef.current?.close();
  }, []);

  const selected = useMemo(
    () => conversations.find((item) => item.customerId === selectedId),
    [conversations, selectedId]
  );

  useEffect(() => {
    if (!selected) return;
    const latestCustomerMessageId = (selected.messages || [])
      .filter((message) => message.senderRole === 'CUSTOMER')
      .reduce((max, message) => Math.max(max, Number(message.id) || 0), 0);
    if (!latestCustomerMessageId) return;

    const readMap = JSON.parse(localStorage.getItem('adminChatLastRead') || '{}');
    readMap[selected.customerId] = latestCustomerMessageId;
    localStorage.setItem('adminChatLastRead', JSON.stringify(readMap));
    window.dispatchEvent(new Event('chatReadUpdated'));
  }, [selected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected?.messages]);

  const submit = (event) => {
    event.preventDefault();
    const value = content.trim();
    if (!value || !selectedId) return;
    if (socketRef.current?.send({ type: 'MESSAGE', conversationId: selectedId, content: value })) setContent('');
  };

  return (
    <div className="admin-chat-page">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="fw-bold mb-1">Trò chuyện với khách hàng</h2>
          <span className={`admin-chat-status ${status}`}>{status === 'connected' ? 'Realtime đang hoạt động' : 'Đang kết nối lại...'}</span>
        </div>
      </div>

      <div className="admin-chat-card">
        <aside className="admin-chat-list">
          <div className="admin-chat-list-title">Cuộc trò chuyện ({conversations.length})</div>
          {conversations.length === 0 && <div className="p-4 text-muted text-center">Chưa có khách nhắn tin</div>}
          {conversations.map((item) => {
            const last = item.messages?.[item.messages.length - 1];
            const readMap = JSON.parse(localStorage.getItem('adminChatLastRead') || '{}');
            const unread = (item.messages || []).filter(
              (message) => message.senderRole === 'CUSTOMER'
                && Number(message.id) > Number(readMap[item.customerId] || 0)
            ).length;
            return (
              <button key={item.customerId} type="button" className={selectedId === item.customerId ? 'active' : ''} onClick={() => setSelectedId(item.customerId)}>
                <span className="admin-chat-avatar"><i className="bi bi-person-fill" /></span>
                <span className="text-start overflow-hidden">
                  <strong>{item.customerName}</strong>
                  <small>{last?.content || 'Bắt đầu trò chuyện'}</small>
                </span>
                {unread > 0 && <span className="admin-conversation-unread">{unread > 99 ? '99+' : unread}</span>}
              </button>
            );
          })}
        </aside>

        <section className="admin-chat-room">
          {!selected ? (
            <div className="admin-chat-placeholder"><i className="bi bi-chat-square-dots" /><p>Chọn một khách hàng để trả lời</p></div>
          ) : (
            <>
              <header><strong>{selected.customerName}</strong><small>Mã khách hàng: {selected.customerId}</small></header>
              <div className="admin-chat-messages">
                {(selected.messages || []).map((message) => (
                  <div key={message.id} className={`chat-message ${message.senderRole === 'ADMIN' ? 'mine' : 'theirs'}`}>
                    <div>{message.content}</div>
                    <small>{message.senderRole === 'ADMIN' ? 'Bạn' : selected.customerName}</small>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={submit}>
                <input value={content} onChange={(event) => setContent(event.target.value)} placeholder="Nhập nội dung trả lời..." maxLength={1000} />
                <button type="submit" className="btn btn-dark" disabled={status !== 'connected'}><i className="bi bi-send-fill me-2" />Gửi</button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminChat;
