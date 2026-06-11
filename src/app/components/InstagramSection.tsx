import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Instagram } from 'lucide-react';
import type { InstagramPost, SectionInstagram } from '../../lib/types';

const INSTAGRAM_PROFILE = 'https://www.instagram.com/pipocasgravata_oficial';

export default function InstagramSection() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);

  useEffect(() => {
    fetch('/api/sections.php?id=instagram')
      .then((r) => r.json())
      .then((data: SectionInstagram) => {
        if (data.posts?.length) setPosts(data.posts);
      })
      .catch(() => {});
  }, []);

  if (posts.length === 0) return null;

  return (
    <section
      id="instagram"
      className="py-20 bg-white"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Instagram className="w-7 h-7 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Siga-nos no Instagram
            </h2>
          </div>
          <p className="text-muted-foreground text-base">@pipocasgravata_oficial</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/20 to-primary/10 shadow-sm"
              style={{ aspectRatio: '1 / 1' }}
            >
              <iframe
                src={`https://www.instagram.com/${post.type === 'reel' ? 'reel' : 'p'}/${post.shortcode}/embed/`}
                style={{
                  width: '100%',
                  height: '540px',
                  border: 'none',
                  display: 'block',
                }}
                scrolling="no"
                allowTransparency
                loading="lazy"
                title={`Instagram post ${index + 1}`}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <a
            href={INSTAGRAM_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-3 rounded-full transition-colors shadow"
          >
            <Instagram size={18} />
            Ver mais no Instagram
          </a>
        </motion.div>

      </div>
    </section>
  );
}
