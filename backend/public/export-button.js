(function() {
    'use strict';
    
    function addExportButton() {
        // Check if we're on a page edit screen
        if (!window.location.href.includes('collection-types/api::page.page/')) {
            return;
        }
        
        // Check if button already exists
        if (document.getElementById('export-page-btn')) {
            return;
        }
        
        console.log('Adding export button...');
        
        // Find the ENTRY sidebar (right panel)
        const entryPanel = document.querySelector('[data-testid="informations"]') || 
                          document.querySelector('div:has(> div:contains("ENTRY"))') ||
                          document.querySelector('aside') ||
                          document.querySelector('.sc-eDWCr.hEwyGE');
        
        if (entryPanel) {
            // Create export button container
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                padding: 16px;
                border-bottom: 1px solid #dcdce4;
                background: #32324d;
            `;
            
            // Create export button
            const exportBtn = document.createElement('button');
            exportBtn.id = 'export-page-btn';
            exportBtn.innerHTML = '📥 EXPORT THIS PAGE';
            exportBtn.style.cssText = `
                width: 100%;
                background: #4945ff;
                color: white;
                border: none;
                padding: 12px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            `;
            
            exportBtn.addEventListener('click', function() {
                const url = window.location.href;
                const pageMatch = url.match(/collection-types\/api::page\.page\/([^\/\?]+)/);
                const localeMatch = url.match(/locale=([^&]+)/);
                
                if (pageMatch && pageMatch[1]) {
                    const documentId = pageMatch[1];
                    const locale = localeMatch ? localeMatch[1] : 'id';
                    
                    exportBtn.innerHTML = '⏳ EXPORTING...';
                    exportBtn.disabled = true;
                    
                    // Get page data first to find the slug
                    fetch(`/api/pages/${documentId}?locale=${locale}&populate=*`)
                        .then(res => res.json())
                        .then(data => {
                            if (data.data && data.data.slug) {
                                const exportUrl = `/api/content-export/${data.data.slug}?locale=${locale}`;
                                const link = document.createElement('a');
                                link.href = exportUrl;
                                link.download = `${data.data.slug}-${locale}-export.json`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                
                                exportBtn.innerHTML = '✅ EXPORTED!';
                                setTimeout(() => {
                                    exportBtn.innerHTML = '📥 EXPORT THIS PAGE';
                                    exportBtn.disabled = false;
                                }, 2000);
                            } else {
                                alert('Could not export this page. Make sure it has a slug.');
                                exportBtn.innerHTML = '📥 EXPORT THIS PAGE';
                                exportBtn.disabled = false;
                            }
                        })
                        .catch(err => {
                            console.error('Export error:', err);
                            alert('Export failed: ' + err.message);
                            exportBtn.innerHTML = '❌ EXPORT FAILED';
                            setTimeout(() => {
                                exportBtn.innerHTML = '📥 EXPORT THIS PAGE';
                                exportBtn.disabled = false;
                            }, 2000);
                        });
                } else {
                    alert('Please open a page to export it.');
                }
            });
            
            buttonContainer.appendChild(exportBtn);
            
            // Insert at the top of the entry panel
            entryPanel.insertBefore(buttonContainer, entryPanel.firstChild);
            console.log('Export button added successfully!');
        } else {
            console.log('Could not find entry panel');
            // Try to add to any sidebar
            const sidebar = document.querySelector('aside');
            if (sidebar) {
                const exportBtn = document.createElement('button');
                exportBtn.innerHTML = '📥 EXPORT PAGE';
                exportBtn.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: #4945ff;
                    color: white;
                    border: none;
                    padding: 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    z-index: 9999;
                    font-weight: bold;
                `;
                document.body.appendChild(exportBtn);
            }
        }
    }
    
    // Multiple attempts to add the button
    setTimeout(addExportButton, 1000);
    setTimeout(addExportButton, 3000);
    setTimeout(addExportButton, 5000);
    
    // Watch for page changes
    let lastUrl = window.location.href;
    const observer = new MutationObserver(() => {
        if (window.location.href !== lastUrl) {
            lastUrl = window.location.href;
            setTimeout(addExportButton, 2000);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
})();