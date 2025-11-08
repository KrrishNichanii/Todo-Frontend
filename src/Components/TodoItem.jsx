import React, { useState , useEffect } from 'react'

 const STATUSES = {
        PENDING: 'pending',
        IN_PROGRESS: 'in-progress',
        COMPLETED: 'completed',
      };
      
    const getStatusStyles = (status) => {
        switch (status) {
            case STATUSES.PENDING:
                // Soft Red/Pink for Pending
                return {
                    card: 'bg-red-100 border-red-300', 
                    text: 'text-red-800 font-semibold',
                    badge: 'bg-red-500 text-white shadow-red-700/50',
                };
            case STATUSES.IN_PROGRESS:
                // Soft Yellow/Orange for In Progress
                return {
                    card: 'bg-yellow-100 border-yellow-400', 
                    text: 'text-yellow-800 font-semibold',
                    badge: 'bg-amber-500 text-gray-800 shadow-amber-700/50',
                };
            case STATUSES.COMPLETED:
                // Soft Green for Completed
                return {
                    card: 'bg-green-200 border-green-500', 
                    text: 'text-green-800 font-semibold',
                    badge: 'bg-green-700 text-white shadow-green-900/50',
                };
            default:
                return {
                    card: 'bg-gray-100 border-gray-300', 
                    text: 'text-gray-800 font-semibold',
                    badge: 'bg-gray-400 text-white',
                };
        }
    };


function TodoItem({ todo, onUpdate, onDelete }) {
    // Local state for editing inputs
    const [isEditable, setIsEditable] = useState(false);
    const [titleText, setTitleText] = useState(todo.title);
    const [descriptionText, setDescriptionText] = useState(todo.description);
    const [currentStatus, setCurrentStatus] = useState(todo.status);

    // Sync local state when external todo object changes
    useEffect(() => {
        setTitleText(todo.title);
        setDescriptionText(todo.description);
        setCurrentStatus(todo.status);
    }, [todo]);
    
    const styles = getStatusStyles(currentStatus);

    // The handler for the Edit/Save button
    const handleSave = () => {
        if (!isEditable) {
            // Enter edit mode
            setIsEditable(true);
            return;
        }

        // Save mode: call parent update function
        if (titleText.trim() === "") {
            // Using console.error as a non-breaking notification alternative to alert()
            console.error("Title cannot be empty!");
            return;
        }
        
        onUpdate(todo._id, {
            title: titleText,
            description: descriptionText,
            status: currentStatus,
        });

        setIsEditable(false);
    };

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setCurrentStatus(newStatus);
    };
    
    const isCompleted = currentStatus === STATUSES.COMPLETED;

    return (
        <div className={`flex flex-col border-4 rounded-xl p-4 gap-y-3 shadow-2xl duration-300 w-full 
            ${styles.card} transition-colors
        `}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-y-2 sm:gap-x-3">
                
                <div className="flex items-center">
                    <span className="text-sm font-semibold mr-2 text-gray-600 hidden sm:inline">Status:</span>
                    {!isEditable ? (
                        <span 
                            className={`text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md ${styles.badge} transition-all duration-300`}
                        >
                            {currentStatus.replace('-', ' ')}
                        </span>
                    ) : (
                        <select
                            value={currentStatus}
                            onChange={handleStatusChange}
                            className={`p-1.5 rounded-lg border text-sm font-semibold outline-none shadow-inner cursor-pointer
                                ${styles.card} ${styles.text} border-gray-500`}
                        >
                            {Object.values(STATUSES).map(status => (
                                <option key={status} value={status} className="bg-white text-gray-800">
                                    {status.replace('-', ' ')}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                

                {/* Title Input */}
                <input
                    type="text"
                    value={titleText}
                    className={`
                        w-full text-xl font-extrabold bg-transparent outline-none transition-all duration-300 py-1
                        ${isCompleted ? "line-through opacity-70" : "opacity-100"} 
                        ${isEditable ? "border-b border-gray-600 px-1" : "border-transparent cursor-default"}
                        ${styles.text}
                    `}
                    readOnly={!isEditable}
                    onChange={(e) => setTitleText(e.target.value)}
                    placeholder="Task Title"
                />
            </div>
            
            {/* Description Input */}
            <div className="mt-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Description</label>
                <textarea
                    value={descriptionText}
                    rows={isEditable ? 3 : 1}
                    className={`
                        w-full text-sm bg-transparent resize-none outline-none transition-all duration-300
                        ${isCompleted ? "line-through opacity-60" : "opacity-90"} 
                        ${isEditable ? "border rounded-lg p-2 border-gray-400" : "border-transparent cursor-default overflow-hidden h-auto"}
                        ${styles.text}
                    `}
                    readOnly={!isEditable}
                    onChange={(e) => setDescriptionText(e.target.value)}
                    placeholder="Details about the task..."
                />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-x-3 pt-3 border-t border-gray-300/50">
                {/* Edit/Save Button */}
                <button 
                    className='rounded-lg p-2 px-4 bg-indigo-500 text-white font-bold hover:bg-indigo-600 transition-colors duration-150 shadow-lg shadow-indigo-500/50 disabled:opacity-50'
                    onClick={handleSave}
                >
                    {isEditable ? "📁 Save Changes" : "✏️ Edit Task"}
                </button>

                {/* Delete Button */}
                <button 
                    className='rounded-lg p-2 px-4 bg-red-500 text-white font-bold hover:bg-red-600 transition-colors duration-150 shadow-lg shadow-red-500/50'
                    onClick={() => onDelete(todo.id)}
                >
                    ❌ Delete
                </button>
            </div>
        </div>
    );
}




export default TodoItem