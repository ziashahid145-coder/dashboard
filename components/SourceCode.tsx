
import React, { useState } from 'react';
import { Database, Server, Code, FileCode, Check, Copy, Layout, BookOpen, ExternalLink } from 'lucide-react';

const SourceCode: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'BACKEND' | 'WORDPRESS' | 'GUIDE'>('BACKEND');

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const sqlCode = `-- SkyPeak System Schema (MySQL)
CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    seo_score INT DEFAULT 80,
    hosting_expiry DATE,
    maint_price DECIMAL(10,2) DEFAULT 100.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE maintenance_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    task_name VARCHAR(255),
    status ENUM('Completed', 'Active', 'Scheduled'),
    task_date VARCHAR(50),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);`;

  const wpTemplate = `<?php
/**
 * Template Name: SkyPeak Client Portal
 * Description: Use this template to embed the React Dashboard.
 */

get_header(); ?>

<style>
    /* Prevent WordPress theme styles from leaking into the dashboard */
    #root { all: initial; font-family: 'Inter', sans-serif; }
    .site-content { padding: 0 !important; max-width: 100% !important; }
</style>

<div id="portal-wrapper" style="min-height: 100vh; background: #f8fafc;">
    <!-- The React Dashboard will mount here -->
    <div id="root"></div>
</div>

<!-- Import React & Dashboard Logic -->
<script type="module" src="<?php echo get_stylesheet_directory_uri(); ?>/portal/index.js"></script>

<?php get_footer(); ?>`;

  const phpCode = `<?php
// api/get-client-data.php
require_once('../wp-load.php'); // Optional: Use WP session if integrated

header('Content-Type: application/json');

$db = new PDO("mysql:host=localhost;dbname=agency_db", "user", "pass");

if ($_GET['action'] === 'fetch') {
    $stmt = $db->prepare("SELECT * FROM clients WHERE username = ?");
    $stmt->execute([$_GET['user']]);
    $client = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Add logic to fetch tasks and invoices
    echo json_encode($client);
}
?>`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div className="text-center">
        <div className="inline-flex p-3 bg-slate-900 rounded-2xl mb-4">
          <Code className="w-8 h-8 text-orange-500" />
        </div>
        <h2 className="text-3xl font-black text-slate-900">Deployment Engine</h2>
        <p className="text-slate-500 mt-2">Integrate this dashboard directly into your Agency's WordPress site.</p>
      </div>

      <div className="flex justify-center border-b border-slate-200">
        <button onClick={() => setActiveTab('BACKEND')} className={`px-8 py-4 text-sm font-black uppercase tracking-widest relative ${activeTab === 'BACKEND' ? 'text-orange-500' : 'text-slate-400'}`}>
          Backend Logic
          {activeTab === 'BACKEND' && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full"></div>}
        </button>
        <button onClick={() => setActiveTab('WORDPRESS')} className={`px-8 py-4 text-sm font-black uppercase tracking-widest relative ${activeTab === 'WORDPRESS' ? 'text-orange-500' : 'text-slate-400'}`}>
          WordPress Wrapper
          {activeTab === 'WORDPRESS' && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full"></div>}
        </button>
        <button onClick={() => setActiveTab('GUIDE')} className={`px-8 py-4 text-sm font-black uppercase tracking-widest relative ${activeTab === 'GUIDE' ? 'text-orange-500' : 'text-slate-400'}`}>
          Step-by-Step Guide
          {activeTab === 'GUIDE' && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full"></div>}
        </button>
      </div>

      {activeTab === 'BACKEND' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-left-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-bold text-slate-800"><Database className="w-5 h-5 text-blue-500" /> database.sql</h3>
              <button onClick={() => copyToClipboard('sql', sqlCode)} className="text-[10px] font-black text-slate-400 hover:text-orange-500 uppercase tracking-widest flex items-center gap-1">
                {copied === 'sql' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copied === 'sql' ? 'Copied' : 'Copy SQL'}
              </button>
            </div>
            <div className="bg-slate-900 rounded-3xl p-6 overflow-hidden">
              <pre className="text-[11px] text-orange-400 font-mono overflow-x-auto">{sqlCode}</pre>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-bold text-slate-800"><FileCode className="w-5 h-5 text-purple-500" /> agency_api.php</h3>
              <button onClick={() => copyToClipboard('php', phpCode)} className="text-[10px] font-black text-slate-400 hover:text-orange-500 uppercase tracking-widest flex items-center gap-1">
                {copied === 'php' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copied === 'php' ? 'Copied' : 'Copy PHP'}
              </button>
            </div>
            <div className="bg-slate-900 rounded-3xl p-6 overflow-hidden">
              <pre className="text-[11px] text-blue-400 font-mono overflow-x-auto">{phpCode}</pre>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'WORDPRESS' && (
        <div className="space-y-6 animate-in slide-in-from-left-4">
          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl flex items-center gap-4">
            <Layout className="w-10 h-10 text-indigo-500" />
            <div>
              <h4 className="font-bold text-indigo-900">Custom Page Template</h4>
              <p className="text-sm text-indigo-800 opacity-80">This allows you to load the Dashboard inside your theme header/footer.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-bold text-slate-800"><FileCode className="w-5 h-5 text-indigo-500" /> page-portal.php</h3>
              <button onClick={() => copyToClipboard('wp', wpTemplate)} className="text-[10px] font-black text-slate-400 hover:text-orange-500 uppercase tracking-widest flex items-center gap-1">
                {copied === 'wp' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copied === 'wp' ? 'Copied' : 'Copy Template'}
              </button>
            </div>
            <div className="bg-slate-900 rounded-3xl p-8 overflow-hidden">
              <pre className="text-xs text-indigo-300 font-mono overflow-x-auto leading-relaxed">{wpTemplate}</pre>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'GUIDE' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black">1</div>
            <h4 className="font-bold text-slate-900">Upload Files</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Create a folder named <code className="bg-slate-100 px-1 font-mono">portal</code> in your WordPress theme directory. Upload your Dashboard assets (JS, CSS) there.
            </p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black">2</div>
            <h4 className="font-bold text-slate-900">Install Template</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Copy the <code className="bg-slate-100 px-1 font-mono">page-portal.php</code> code and save it in your theme root. WordPress will automatically detect it as a template.
            </p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black">3</div>
            <h4 className="font-bold text-slate-900">Create Page</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              In WordPress, create a new Page. Set the "Template" to <code className="bg-slate-100 px-1 font-mono">SkyPeak Client Portal</code>. Your dashboard is now live!
            </p>
          </div>
        </div>
      )}

      <div className="bg-[#0f172a] p-10 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center gap-8 shadow-2xl">
        <div className="p-5 bg-white/5 rounded-3xl"><BookOpen className="w-10 h-10 text-orange-500" /></div>
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-xl font-bold mb-2">Need a White-Glove Installation?</h4>
          <p className="text-sm text-slate-400 font-medium">We can handle the PHP/SQL integration for you, including connecting to your existing Stripe or PayPal API for live billing.</p>
        </div>
        <button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all">
          Contact DevOps Support
        </button>
      </div>
    </div>
  );
};

export default SourceCode;
