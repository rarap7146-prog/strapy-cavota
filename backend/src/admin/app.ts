export default {
  config: {
    locales: ['en'],
  },
  bootstrap(app: any) {
    // Simple approach: inject CSS and script directly
    const style = document.createElement('style');
    style.textContent = `
      .export-btn-container {
        margin-top: 8px;
        width: 100%;
      }
      .export-btn {
        background: #4945ff;
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        width: 100%;
        transition: background-color 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      .export-btn:hover {
        background: #3730a3;
      }
      .export-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `;
    document.head.appendChild(style);
    
    function createExportButton() {
      if (document.getElementById('inline-export-btn')) {
        return;
      }
      
      if (!window.location.href.includes('collection-types/api::page.page/')) {
        return;
      }
      
      // Find the Save button
      const allButtons = Array.from(document.querySelectorAll('button'));
      const saveButton = allButtons.find(btn => {
        const text = btn.textContent?.trim().toLowerCase();
        return text === 'save' || text === 'publish';
      });
      
      if (!saveButton) {
        return;
      }
      
      const container = document.createElement('div');
      container.className = 'export-btn-container';
      container.id = 'inline-export-btn';
      
      const btn = document.createElement('button');
      btn.className = 'export-btn';
      btn.type = 'button';
      btn.innerHTML = '<span>📥</span><span>Export Page</span>';
      
      btn.addEventListener('click', async () => {
        const pageId = window.location.pathname.split('/').pop();
        
        if (!pageId) {
          alert('Unable to determine page ID');
          return;
        }
        
        btn.disabled = true;
        btn.innerHTML = '<span>⏳</span><span>Exporting...</span>';
        
        try {
          const response = await fetch(`/api/pages/${pageId}?populate=deep`);
          const data = await response.json();
          
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `page-${pageId}-export.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          btn.disabled = false;
          btn.innerHTML = '<span>✅</span><span>Exported!</span>';
          setTimeout(() => {
            btn.innerHTML = '<span>📥</span><span>Export Page</span>';
          }, 2000);
        } catch (error) {
          alert('Export failed: ' + error);
          btn.disabled = false;
          btn.innerHTML = '<span>📥</span><span>Export Page</span>';
        }
      });
      
      container.appendChild(btn);
      
      if (saveButton.parentElement) {
        saveButton.parentElement.appendChild(container);
      }
    }
    
    // Try multiple times to ensure button appears
    setTimeout(createExportButton, 500);
    setTimeout(createExportButton, 1000);
    setTimeout(createExportButton, 2000);
    setTimeout(createExportButton, 3000);
    setTimeout(createExportButton, 5000);
    setTimeout(createExportButton, 7000);
    
    // Watch for navigation changes
    let lastUrl = window.location.href;
    const observer = new MutationObserver(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        const existing = document.getElementById('inline-export-btn');
        if (existing) existing.remove();
        setTimeout(createExportButton, 2000);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  },
};