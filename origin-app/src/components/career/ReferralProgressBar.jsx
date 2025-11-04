import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';

const STAGES = [
    { id: 'sent', label: 'נשלח', color: 'blue' },
    { id: 'interview', label: 'ראיון', color: 'purple' },
    { id: 'in_progress', label: 'בהמשך טיפול', color: 'orange' },
    { id: 'accepted', label: 'התקבלה', color: 'green' }
];

const getStageFromStatus = (status) => {
    const statusMap = {
        'ממתין': 'sent',
        'זומנתי לראיון': 'interview',
        'בתהליך': 'in_progress',
        'קיבלתי הצעה': 'accepted',
        'התחלתי לעבוד': 'accepted',
        'הושלם': 'accepted',
        'נדחיתי': 'sent' // נדחיתי יישאר בשלב הראשון
    };
    return statusMap[status] || 'sent';
};

const getStageIndex = (stageId) => {
    return STAGES.findIndex(stage => stage.id === stageId);
};

const getStageColor = (color, isActive, isCompleted) => {
    if (!isActive && !isCompleted) {
        return 'bg-gray-200 text-gray-400';
    }
    
    const colors = {
        blue: isCompleted ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600 border-2 border-blue-500',
        purple: isCompleted ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-600 border-2 border-purple-500',
        orange: isCompleted ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600 border-2 border-orange-500',
        green: isCompleted ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600 border-2 border-green-500'
    };
    
    return colors[color] || 'bg-gray-200 text-gray-400';
};

const getLineColor = (isCompleted) => {
    return isCompleted ? 'bg-gradient-to-l from-green-400 to-blue-400' : 'bg-gray-200';
};

export default function ReferralProgressBar({ status }) {
    const currentStage = getStageFromStatus(status);
    const currentStageIndex = getStageIndex(currentStage);
    
    // Special handling for rejected status
    const isRejected = status === 'נדחיתי';
    
    return (
        <div className="py-4">
            <div className="flex items-center justify-between">
                {STAGES.map((stage, index) => {
                    const isCompleted = index < currentStageIndex;
                    const isActive = index === currentStageIndex;
                    const isLast = index === STAGES.length - 1;
                    
                    return (
                        <React.Fragment key={stage.id}>
                            <div className="flex flex-col items-center flex-1">
                                {/* Circle */}
                                <div className={`
                                    w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
                                    transition-all duration-300 shadow-md
                                    ${getStageColor(stage.color, isActive, isCompleted)}
                                    ${isRejected && index === 0 ? 'bg-red-500 text-white' : ''}
                                `}>
                                    {isCompleted ? (
                                        <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
                                    ) : isActive ? (
                                        <Clock className="w-5 h-5 md:w-6 md:h-6" />
                                    ) : (
                                        <Circle className="w-5 h-5 md:w-6 md:h-6" />
                                    )}
                                </div>
                                
                                {/* Label */}
                                <span className={`
                                    text-xs md:text-sm mt-2 font-medium text-center
                                    ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-400'}
                                    ${isRejected && index === 0 ? 'text-red-600' : ''}
                                `}>
                                    {isRejected && index === 0 ? 'נדחיתי' : stage.label}
                                </span>
                            </div>
                            
                            {/* Connecting Line */}
                            {!isLast && (
                                <div className={`
                                    flex-1 h-1 mx-2 rounded-full transition-all duration-300
                                    ${getLineColor(isCompleted)}
                                    ${isRejected ? 'bg-gray-200' : ''}
                                `}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
            
            {isRejected && (
                <div className="mt-3 text-center">
                    <span className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded-full">
                        ההפנייה נדחתה - אל תתייאשי! המסע נמשך
                    </span>
                </div>
            )}
        </div>
    );
}