import React from 'react';
import Header from '../section/Header2';

const Project = () => {
  // Sample project data
  const projects = [
    {
      id: 1,
      title: 'Portfolio Website',
      description: 'A personal portfolio website built with React and Tailwind CSS.',
      image: 'https://via.placeholder.com/300x200',
      link: 'https://portfolio.example.com',
    },
    {
      id: 2,
      title: 'E-Commerce Platform',
      description: 'An e-commerce web app with shopping cart and payment integration.',
      image: 'https://via.placeholder.com/300x200',
      link: 'https://ecommerce.example.com',
    },
    {
      id: 3,
      title: 'Blog Website',
      description: 'A blog platform featuring markdown support and user authentication.',
      image: 'https://via.placeholder.com/300x200',
      link: 'https://blog.example.com',
    },
    {
      id: 4,
      title: 'Ticket Management System',
      description: 'A ticketing app to create, view, and manage tasks effectively.',
      image: 'https://via.placeholder.com/300x200',
      link: 'https://ticketing.example.com',
    },
    {
      id: 5,
      title: 'Another Project',
      description: 'A project description example.',
      image: 'https://via.placeholder.com/300x200',
      link: 'https://example.com',
    },
    {
      id: 6,
      title: 'Sample App',
      description: 'Another project sample for display.',
      image: 'https://via.placeholder.com/300x200',
      link: 'https://sampleapp.example.com',
    },
  ];

  return (
    <>
      <Header />
      <div className="p-8 bg-gray-100 min-h-screen" style={{ marginTop: '60px' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Project Image */}
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              {/* Project Details */}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {project.title}
                </h2>
                <p className="text-gray-600 mt-2">{project.description}</p>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                  View Project
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Project;
