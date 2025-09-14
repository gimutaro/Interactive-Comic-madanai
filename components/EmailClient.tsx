'use client';

import React, { useState } from 'react';
import { Mail, MailOpen, Paperclip, Search, ChevronLeft, Trash2 } from 'lucide-react';

const EmailClient: React.FC = () => {
  // メールデータ（20件）の初期値
  const initialEmails = [
    {
      id: 1,
      from: 'SecondWave株式会社',
      company: '契約管理部',
      subject: '【ご報告/今後のご契約に関しまして】SecondWave株式会社田中でございます',
      preview: '平素より格別のご高配を賜り、厚く御礼申し上げます。誠に恐れ入りますが...',
      body: `お世話になっております。
SecondWave株式会社 契約管理部の田中と申します。

平素より格別のご高配を賜り、厚く御礼申し上げます。

さて、誠に恐れ入りますが、弊社とのサービス契約につきまして、
2024年3月31日をもちまして期間満了とさせていただきたく、
ご連絡を差し上げました。

これまで長きにわたり、貴社には多大なるご支援とご協力を
いただきましたこと、心より感謝申し上げます。

弊社の事業方針の見直しに伴い、サービス提供体制を
再構築することとなりました。貴社には大変ご迷惑を
おかけすることとなり、誠に申し訳ございません。

つきましては、以下の点についてご確認をお願いいたします。

1. 契約終了日：2024年3月31日
2. データ移行：必要に応じてサポートさせていただきます
3. 最終請求：3月分は日割り計算にて精算いたします

引き継ぎ等でご不明な点がございましたら、
お気軽にお問い合わせください。

今後とも何卒よろしくお願い申し上げます。

━━━━━━━━━━━━━━━━━━━━━
SecondWave株式会社
契約管理部 田中 健一
Email: tanaka@secondwave.co.jp
Tel: 03-1234-5678
━━━━━━━━━━━━━━━━━━━━━`,
      time: '10:23',
      unread: true,
      hasAttachment: false,
      isDeleted: false
    },
    {
      id: 2,
      from: 'Zoom',
      company: 'ミーティング通知',
      subject: '会議の招待状',
      preview: '明日14:00からのWeb会議にご招待します。参加リンクは...',
      body: 'Zoomミーティングへの招待\n\n明日14:00からのWeb会議にご招待します。\n\nトピック: 月次定例会議\n時間: 14:00-15:00\n\nミーティングID: 123-456-789\nパスコード: abc123\n\n参加リンクはこちらから:\nhttps://zoom.us/j/123456789',
      time: '9:45',
      unread: false,
      hasAttachment: true,
      isDeleted: false
    },
    {
      id: 3,
      from: 'Amazon Web Services',
      company: 'AWS',
      subject: '月次利用料金のお知らせ',
      preview: '2月のAWS利用料金が確定しました。請求額は...',
      body: 'お客様各位\n\n2月のAWS利用料金が確定しました。\n\n請求額: ¥125,480\n主な利用サービス:\n- EC2: ¥85,230\n- S3: ¥25,100\n- RDS: ¥15,150\n\n詳細はAWSコンソールからご確認ください。',
      time: '昨日',
      unread: false,
      hasAttachment: true,
      isDeleted: false
    },
    {
      id: 4,
      from: 'Microsoft 365',
      company: 'セキュリティ',
      subject: 'セキュリティアラート',
      preview: '不審なサインイン試行を検出しました。アカウントの確認を...',
      body: 'Microsoft アカウントのセキュリティアラート\n\n不審なサインイン試行を検出しました。\n\n場所: 東京, 日本\n時刻: 2024/03/15 23:45\nIPアドレス: 192.168.1.1\n\nこのアクティビティに心当たりがない場合は、\nすぐにパスワードを変更してください。',
      time: '昨日',
      unread: false,
      hasAttachment: false,
      isDeleted: false
    },
    {
      id: 5,
      from: 'PayPay銀行',
      company: '振込通知',
      subject: '振込完了のお知らせ',
      preview: '振込が完了しました。振込先：〇〇商事 金額：500,000円...',
      body: 'PayPay銀行をご利用いただきありがとうございます。\n\n振込が完了しました。\n\n振込先：〇〇商事株式会社\n金額：500,000円\n振込日時：2024/03/14 10:30\n\n残高：2,345,678円',
      time: '2日前',
      unread: false,
      hasAttachment: true,
      isDeleted: false
    },
    {
      id: 6,
      from: 'Slack',
      company: 'ワークスペース',
      subject: '新しいメッセージが5件あります',
      preview: '#general チャンネルで新しいメッセージがあります...',
      body: 'Slackワークスペースの更新\n\n#general チャンネル\n田中: プロジェクトの進捗を共有します\n鈴木: 了解です！\n\n#dev-team チャンネル\n開発チーム: バグ修正が完了しました\n\n未読メッセージを確認してください。',
      time: '2日前',
      unread: false,
      hasAttachment: false,
      isDeleted: false
    },
    {
      id: 7,
      from: 'GitHub',
      company: 'Pull Request',
      subject: 'PR #234がマージされました',
      preview: 'feature/new-dashboardブランチがmainにマージされました...',
      body: 'Pull Request #234: 新しいダッシュボード機能\n\nfeature/new-dashboardブランチがmainにマージされました。\n\nコミット数: 15\n変更ファイル: 23\n追加: +1,245行\n削除: -342行\n\nレビュワー: @yamada, @sato\nマージ実行者: @tanaka',
      time: '3日前',
      unread: false,
      hasAttachment: false,
      isDeleted: false
    },
    {
      id: 8,
      from: 'Google Ads',
      company: 'キャンペーン',
      subject: '広告キャンペーンのパフォーマンスレポート',
      preview: '先週のキャンペーン実績：クリック率3.2%、コンバージョン...',
      body: 'Google Ads週次レポート\n\n先週のキャンペーン実績：\n\nインプレッション: 125,000\nクリック数: 4,000\nクリック率: 3.2%\nコンバージョン: 85\nコンバージョン率: 2.1%\n\n予算消化率: 78%\n残り予算: ¥220,000',
      time: '3日前',
      unread: false,
      hasAttachment: true,
      isDeleted: false
    },
    {
      id: 9,
      from: 'Netflix',
      company: 'お知らせ',
      subject: '新作コンテンツが追加されました',
      preview: 'お気に入りのジャンルに新作が追加されました...',
      body: 'Netflixからのお知らせ\n\nお気に入りのジャンルに新作が追加されました：\n\n・ドキュメンタリー「AI革命」\n・ドラマシリーズ「東京2025」\n・映画「サイバーパンク・ナイト」\n\n今すぐ視聴を開始できます。',
      time: '4日前',
      unread: false,
      hasAttachment: false,
      isDeleted: false
    },
    {
      id: 10,
      from: 'Dropbox',
      company: '共有通知',
      subject: 'フォルダが共有されました',
      preview: '「プロジェクト資料」フォルダへのアクセス権限が付与されました...',
      body: 'Dropbox共有通知\n\n「プロジェクト資料」フォルダへのアクセス権限が付与されました。\n\n共有者: project-admin@company.com\nファイル数: 45\nサイズ: 2.3GB\n権限: 編集可能\n\nDropboxアプリから今すぐアクセスできます。',
      time: '5日前',
      unread: false,
      hasAttachment: true,
      isDeleted: false
    },
    {
      id: 11,
      from: 'Adobe Creative Cloud',
      company: 'ライセンス',
      subject: 'サブスクリプション更新のお知らせ',
      preview: 'Creative Cloudの年間プランが自動更新されます...',
      body: 'Adobe Creative Cloud\n\nサブスクリプション更新のお知らせ\n\n年間プランが来週自動更新されます。\n\n更新日: 2024/03/20\n料金: ¥72,336/年\n含まれるアプリ: 全Creative Cloudアプリ\n\nキャンセルする場合は更新日の24時間前までにお手続きください。',
      time: '1週間前',
      unread: false,
      hasAttachment: false,
      isDeleted: false
    },
    {
      id: 12,
      from: 'ChatGPT',
      company: 'OpenAI',
      subject: 'APIクレジットが残りわずかです',
      preview: 'APIクレジットの残高が$10を下回りました...',
      body: 'OpenAI APIアラート\n\nAPIクレジットの残高が$10を下回りました。\n\n現在の残高: $8.42\n今月の使用量: $91.58\n主な使用モデル: GPT-4\n\n継続的な利用のため、クレジットの追加購入をご検討ください。',
      time: '1週間前',
      unread: false,
      hasAttachment: true,
      isDeleted: false
    },
    {
      id: 13,
      from: 'Cloudflare',
      company: 'ステータス',
      subject: 'DDos攻撃をブロックしました',
      preview: 'あなたのサイトへのDDos攻撃を検出しブロックしました...',
      body: 'Cloudflareセキュリティレポート\n\nDDos攻撃を検出しブロックしました。\n\n攻撃元: 複数の国から\nリクエスト数: 1,250,000\nブロック率: 99.8%\n影響: なし（全てブロック）\n\nサイトは正常に稼働しています。',
      time: '1週間前',
      unread: false,
      hasAttachment: false,
      isDeleted: false
    },
    {
      id: 14,
      from: 'Figma',
      company: 'デザイン',
      subject: 'デザインファイルにコメントが追加されました',
      preview: 'UIデザインv2.0に3件の新しいコメントがあります...',
      body: 'Figma通知\n\nUIデザインv2.0に3件の新しいコメントがあります。\n\nコメント1: ボタンの色を変更してください\nコメント2: このレイアウトは素晴らしいです！\nコメント3: モバイル版も作成お願いします\n\nFigmaで確認して返信してください。',
      time: '2週間前',
      unread: false,
      hasAttachment: true,
      isDeleted: false
    },
    {
      id: 15,
      from: 'Stripe',
      company: '決済',
      subject: '本日の売上サマリー',
      preview: '本日の決済件数：42件、売上：¥856,320...',
      body: 'Stripe日次レポート\n\n本日の売上サマリー：\n\n決済件数：42件\n総売上：¥856,320\n平均単価：¥20,388\n成功率：98.5%\n返金：1件（¥12,000）\n\n詳細はダッシュボードでご確認ください。',
      time: '2週間前',
      unread: false,
      hasAttachment: false,
      isDeleted: false
    },
    {
      id: 16,
      from: 'Discord',
      company: 'サーバー',
      subject: 'サーバーに10人の新メンバーが参加',
      preview: 'Tech Communityサーバーが活発になっています...',
      body: 'Discord サーバー通知\n\nTech Communityサーバーが活発になっています！\n\n新メンバー：10人\n今日のメッセージ数：234\nアクティブユーザー：45人\n人気チャンネル：#general, #dev-talk\n\nコミュニティに参加して交流しましょう。',
      time: '2週間前',
      unread: false,
      hasAttachment: true,
      isDeleted: false
    },
    {
      id: 17,
      from: 'Notion',
      company: 'ワークスペース',
      subject: 'チームワークスペースの容量が上限に近づいています',
      preview: 'ストレージ使用率が90%を超えました...',
      body: 'Notionからのお知らせ\n\nチームワークスペースのストレージ使用率が90%を超えました。\n\n現在の使用量：4.5GB / 5GB\n主な使用内容：\n- ドキュメント：2.1GB\n- 画像：1.8GB\n- データベース：0.6GB\n\nプランのアップグレードをご検討ください。',
      time: '3週間前',
      unread: false,
      hasAttachment: true,
      isDeleted: false
    },
    {
      id: 18,
      from: 'Spotify',
      company: 'プレイリスト',
      subject: 'あなたの2024年トップソング',
      preview: '今年最も再生した楽曲をまとめました...',
      body: 'Spotify Wrapped 2024\n\nあなたの今年のトップソング：\n\n1. アーティストA - 楽曲名1（234回再生）\n2. アーティストB - 楽曲名2（189回再生）\n3. アーティストC - 楽曲名3（156回再生）\n\n総再生時間：34,567分\nお気に入りジャンル：J-POP, Rock\n\n特別プレイリストを作成しました！',
      time: '3週間前',
      unread: false,
      hasAttachment: false,
      isDeleted: false
    },
    {
      id: 19,
      from: 'Vercel',
      company: 'デプロイ',
      subject: 'デプロイが正常に完了しました',
      preview: 'Production環境へのデプロイが成功しました...',
      body: 'Vercelデプロイ通知\n\nProduction環境へのデプロイが成功しました。\n\nプロジェクト：my-next-app\nコミット：fix: update homepage layout\nビルド時間：45秒\nURL：https://my-app.vercel.app\n\n変更内容：\n- ホームページのレイアウト更新\n- パフォーマンス改善\n- バグ修正3件',
      time: '1ヶ月前',
      unread: false,
      hasAttachment: true,
      isDeleted: false
    },
    {
      id: 20,
      from: 'LinkedIn',
      company: 'プロフィール',
      subject: 'プロフィールが50回閲覧されました',
      preview: '今週あなたのプロフィールへの関心が高まっています...',
      body: 'LinkedIn週次サマリー\n\nプロフィール閲覧数：50回\n投稿のインプレッション：1,234回\n新しいコネクション：5人\n\nあなたを閲覧した企業：\n- テック企業A\n- スタートアップB\n- 大手商社C\n\nプロフィールを更新して、さらに注目を集めましょう。',
      time: '1ヶ月前',
      unread: false,
      hasAttachment: false,
      isDeleted: false
    }
  ];

  // State定義
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [emails, setEmails] = useState(initialEmails);
  const [currentView, setCurrentView] = useState<'inbox' | 'trash'>('inbox');
  const [searchQuery, setSearchQuery] = useState('');

  // メールをクリックして開く時の処理
  const handleEmailClick = (email: any) => {
    setSelectedEmail(email);
    if (email.unread) {
      setEmails(prevEmails => prevEmails.map(e => e.id === email.id ? { ...e, unread: false } : e));
    }
  };

  // メールを削除する処理
  const handleDeleteEmail = (emailId: number) => {
    setEmails(prevEmails => prevEmails.map(e => e.id === emailId ? { ...e, isDeleted: true } : e));
    setSelectedEmail(null);
  };

  // 表示用フィルタ
  const displayedEmails = emails.filter(email => {
    const inView = currentView === 'inbox' ? !email.isDeleted : email.isDeleted;
    if (!inView) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return [email.from, email.company, email.subject, email.preview]
      .some((s: string) => s.toLowerCase().includes(q));
  });

  const unreadCount = emails.filter(e => !e.isDeleted && e.unread).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8">
      <div className="relative" style={{ perspective: '1000px' }}>
        <div className="relative transform" style={{ transformStyle: 'preserve-3d' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-4" style={{ width: '1200px', height: '750px' }}>
            <div className="bg-black rounded-lg p-2 h-full relative">
              <div className="bg-white h-full rounded overflow-hidden">
                <div className="h-full flex flex-col">
                  <div className="bg-gray-800 h-8 relative">
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
                      <button className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"></button>
                      <button className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"></button>
                      <button className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"></button>
                    </div>
                  </div>

                  <div className="flex-1 flex overflow-hidden">
                    <div className="w-56 bg-gray-50 border-r border-gray-200 p-4">
                      <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 mb-4 hover:border-gray-400 transition-colors">
                        <Search className="w-4 h-4 mr-2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="検索..."
                          className="outline-none text-sm flex-1 bg-transparent"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                          <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">×</button>
                        )}
                      </div>
                      <button className="w-full bg-blue-500 text-white rounded-lg py-2 px-4 mb-4 hover:bg-blue-600 transition-colors">新規作成</button>
                      <div className="space-y-2">
                        <div
                          className={`flex items-center gap-2 p-2 rounded cursor-pointer ${currentView === 'inbox' ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
                          onClick={() => { setCurrentView('inbox'); setSelectedEmail(null); setSearchQuery(''); }}
                        >
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">受信トレイ</span>
                          {unreadCount > 0 && (
                            <span className="ml-auto text-xs bg-blue-500 text-white rounded-full px-2">{unreadCount}</span>
                          )}
                        </div>
                        <div
                          className={`flex items-center gap-2 p-2 rounded cursor-pointer ${currentView === 'trash' ? 'bg-blue-50' : 'hover:bg-gray-100'}`}
                          onClick={() => { setCurrentView('trash'); setSelectedEmail(null); setSearchQuery(''); }}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm">ゴミ箱</span>
                        </div>
                      </div>
                    </div>

                    {selectedEmail ? (
                      <div className="flex-1 flex flex-col bg-white">
                        <div className="border-b border-gray-200 p-4">
                          <button onClick={() => setSelectedEmail(null)} className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-4">
                            <ChevronLeft className="w-4 h-4" />
                            <span>{currentView === 'inbox' ? '受信トレイに戻る' : 'ゴミ箱に戻る'}</span>
                          </button>
                          <div className="flex items-start justify-between mb-2">
                            <h2 className="text-xl font-semibold">{selectedEmail.subject}</h2>
                            {!selectedEmail.isDeleted && (
                              <button onClick={() => handleDeleteEmail(selectedEmail.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded transition-colors ml-2" title="ゴミ箱に移動">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="font-medium">{selectedEmail.from}</span>
                            <span>{selectedEmail.company}</span>
                            <span className="ml-auto">{selectedEmail.time}</span>
                          </div>
                        </div>
                        <div className="flex-1 p-6 overflow-auto">
                          <pre className="whitespace-pre-wrap font-sans text-gray-700">{selectedEmail.body}</pre>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col bg-white">
                        {searchQuery && displayedEmails.length > 0 && (
                          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-sm text-gray-600">「{searchQuery}」の検索結果: {displayedEmails.length}件</div>
                        )}
                        <div className="flex-1 overflow-auto">
                          {displayedEmails.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                              {searchQuery ? (
                                <>
                                  <Search className="w-16 h-16 mb-4" />
                                  <p className="text-lg">検索結果が見つかりません</p>
                                  <p className="text-sm mt-2">「{searchQuery}」に一致するメールはありません</p>
                                </>
                              ) : (
                                <>
                                  <Trash2 className="w-16 h-16 mb-4" />
                                  <p className="text-lg">{currentView === 'trash' ? 'ゴミ箱は空です' : 'メールがありません'}</p>
                                </>
                              )}
                            </div>
                          ) : (
                            displayedEmails.map((email) => (
                              <div key={email.id} onClick={() => handleEmailClick(email)} className={`border-b border-gray-100 p-4 hover:bg-gray-50 cursor-pointer transition-colors ${email.unread && !email.isDeleted ? 'bg-blue-50' : ''}`}>
                                <div className="flex items-start gap-3">
                                  <div className="pt-1">
                                    {email.unread && !email.isDeleted ? (
                                      <Mail className="w-5 h-5 text-blue-500" />
                                    ) : (
                                      <MailOpen className="w-5 h-5 text-gray-400" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className={`text-sm ${email.unread && !email.isDeleted ? 'font-semibold' : ''}`}>{email.from}</span>
                                      <span className="text-xs text-gray-500">{email.company}</span>
                                      {email.hasAttachment && <Paperclip className="w-3 h-3 text-gray-400" />}
                                      <span className="ml-auto text-xs text-gray-500">{email.time}</span>
                                    </div>
                                    <div className={`text-sm mb-1 ${email.unread && !email.isDeleted ? 'font-semibold' : ''}`}>{email.subject}</div>
                                    <div className="text-xs text-gray-600 truncate">{email.preview}</div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-600 rounded-full"></div>
            </div>
          </div>
          <div className="flex flex-col items-center mt-2">
            <div className="w-20 h-16 bg-gray-300 rounded-t-lg"></div>
            <div className="w-40 h-2 bg-gray-400 rounded-b-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailClient;

