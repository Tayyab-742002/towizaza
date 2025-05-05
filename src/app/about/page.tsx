export default function AboutPage() {
  return (
    <div className="min-h-screen bg-dark text-light">
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold mb-10">About Towizaza</h1>
        
        {/* Artist Bio Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="aspect-[4/5] bg-mid/20 rounded-lg relative overflow-hidden">
                {/* Artist image will go here */}
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">The Journey</h2>
              <p className="text-light/80 mb-6 text-lg">
                Born in the digital age yet nostalgic for analog warmth, Towizaza emerged from the fusion of classical training and electronic experimentation. With roots in both traditional composition and cutting-edge production techniques, the artist crafts soundscapes that defy conventional genre boundaries.
              </p>
              <p className="text-light/80 mb-8 text-lg">
                Since debuting in 2018, Towizaza has pushed the boundaries of sonic innovation while maintaining an emotional core that resonates with listeners worldwide. The music combines intricate layering with minimalist restraint, creating signature sounds that feel both familiar and revolutionary.
              </p>
              <blockquote className="border-l-4 border-accent pl-6 py-2 mb-6 italic accent-text text-xl">
                "Music is not just what I do—it's the lens through which I experience the world."
              </blockquote>
            </div>
          </div>
        </section>
        
        {/* Timeline Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">The Story So Far</h2>
          
          <div className="relative border-l-2 border-light/20 pl-8 ml-4 md:ml-[calc(50%-2px)] md:pl-0">
            {[
              {
                year: '2018',
                title: 'First EP Release',
                description: 'Debut EP "Digital Dreams" introduced Towizaza to the world with a blend of ambient textures and rhythmic innovation.'
              },
              {
                year: '2019',
                title: 'Breakthrough Single',
                description: 'The single "Neon Echo" reached top streaming charts and established Towizaza as an emerging voice in electronic music.'
              },
              {
                year: '2020',
                title: 'Studio Album Debut',
                description: 'First full-length album "Synthetic Memories" received critical acclaim for its emotional depth and technical brilliance.'
              },
              {
                year: '2021',
                title: 'World Tour',
                description: 'Performed across 15 countries, bringing the immersive audio-visual experience to fans worldwide.'
              },
              {
                year: '2022',
                title: 'Collaboration Album',
                description: 'Partnership with legendary artists resulted in the boundary-pushing "Harmonic Convergence" project.'
              },
              {
                year: '2023',
                title: 'Award-Winning Innovation',
                description: 'Received multiple awards for innovation in music production and live performance technology.'
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className={`relative mb-12 md:w-[45%] ${index % 2 === 0 ? 'md:ml-[55%]' : 'md:mr-[55%] md:-left-8'}`}
              >
                <div className="absolute -left-14 md:-left-6 top-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-light font-bold">{item.year}</span>
                </div>
                <div className="glass p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-light/80">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Press Kit Section */}
        <section className="glass-dark p-10 rounded-lg">
          <h2 className="text-3xl font-bold mb-8 text-center">Press Kit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Official Bio</h3>
              <p className="text-light/80 mb-4">
                Download the official artist biography, press photos, and media assets for promotional use.
              </p>
              <button className="bg-accent hover:bg-accent/90 text-light py-2 px-6 rounded-full flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Press Kit
              </button>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Media Inquiries</h3>
              <p className="text-light/80 mb-4">
                For interview requests, press features, and collaborative opportunities, please contact our management team.
              </p>
              <a 
                href="mailto:press@towizaza.com" 
                className="bg-primary hover:bg-primary/90 text-light py-2 px-6 rounded-full inline-block"
              >
                Contact for Media
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 