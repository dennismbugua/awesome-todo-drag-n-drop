import { Droppable } from "react-beautiful-dnd";
import ListItem from "./ListItem";
import React from "react";
import styled from "styled-components";

const DroppableStyles = styled.div`
  background: var(--bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  min-height: 500px;
  display: flex;
  flex-direction: column;
  border: 2px solid ${props => {
    switch(props.prefix) {
      case 'todo': return 'var(--primary-200)';
      case 'inProgress': return 'var(--warning-200)';
      case 'done': return 'var(--secondary-200)';
      default: return 'var(--gray-200)';
    }
  }};
  transition: all var(--transition-base);
  
  &:hover {
    border-color: ${props => {
      switch(props.prefix) {
        case 'todo': return 'var(--primary-400)';
        case 'inProgress': return 'var(--warning-400)';
        case 'done': return 'var(--secondary-400)';
        default: return 'var(--gray-400)';
      }
    }};
    box-shadow: var(--shadow-lg);
  }
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 2px solid var(--gray-200);
`;

const ColumnTitle = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const ColumnIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  background: ${props => {
    switch(props.prefix) {
      case 'todo': return 'var(--primary-100)';
      case 'inProgress': return 'var(--warning-100)';
      case 'done': return 'var(--secondary-100)';
      default: return 'var(--gray-100)';
    }
  }};
`;

const ColumnName = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: capitalize;
  letter-spacing: -0.01em;
`;

const TaskCount = styled.div`
  background: ${props => {
    switch(props.prefix) {
      case 'todo': return 'var(--primary-500)';
      case 'inProgress': return 'var(--warning-500)';
      case 'done': return 'var(--secondary-500)';
      default: return 'var(--gray-500)';
    }
  }};
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-full);
  min-width: 28px;
  text-align: center;
`;

const DroppableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
  
  /* Custom scrollbar for drop zone */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--gray-300);
    border-radius: var(--radius-full);
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: var(--gray-400);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--spacing-2xl) var(--spacing-md);
  color: var(--text-tertiary);
  font-size: 0.875rem;
  font-weight: 500;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
  opacity: 0.3;
`;

const getColumnConfig = (prefix) => {
  const configs = {
    todo: {
      icon: '📋',
      displayName: 'To Do'
    },
    inProgress: {
      icon: '⚡',
      displayName: 'In Progress'
    },
    done: {
      icon: '✅',
      displayName: 'Done'
    }
  };
  return configs[prefix] || { icon: '📝', displayName: prefix };
};

const DraggableElement = ({ prefix, elements }) => {
  const config = getColumnConfig(prefix);
  
  return (
    <DroppableStyles prefix={prefix}>
      <ColumnHeader>
        <ColumnTitle>
          <ColumnIcon prefix={prefix}>{config.icon}</ColumnIcon>
          <ColumnName>{config.displayName}</ColumnName>
        </ColumnTitle>
        <TaskCount prefix={prefix}>{elements.length}</TaskCount>
      </ColumnHeader>
      
      <Droppable droppableId={`${prefix}`}>
        {(provided, snapshot) => (
          <DroppableContainer
            {...provided.droppableProps}
            ref={provided.innerRef}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {elements.length === 0 ? (
              <EmptyState>
                <EmptyIcon>📭</EmptyIcon>
                <div>No tasks yet</div>
              </EmptyState>
            ) : (
              elements.map((item, index) => (
                <ListItem key={item.id} item={item} index={index} />
              ))
            )}
            {provided.placeholder}
          </DroppableContainer>
        )}
      </Droppable>
    </DroppableStyles>
  );
};

export default DraggableElement;

