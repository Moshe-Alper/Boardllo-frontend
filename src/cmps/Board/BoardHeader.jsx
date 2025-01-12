import React from 'react'
import { svgService } from '../../services/svg.service'

export function BoardHeader({ board }) {
    const demoWorkspace = {
        name: "Marketing Team",
        visibility: "Workspace visible"
    }

    const demoPowerUps = [
        { id: 1, name: "Calendar" },
        { id: 2, name: "Automation" }
    ]

    return (
        <section className="board-header">
            <div className="board-header-left">
                <h1>{board.title}</h1>
                <button className="star-btn">
                    <img src={svgService.starIcon} alt="Star" />
                </button>
                <div className="workspace-info">
                    <span className="workspace-name">{demoWorkspace.name}</span>
                    <span className="visibility">{demoWorkspace.visibility}</span>
                </div>
            </div>

            <div className="board-header-right">
                <div className="power-ups">
                    <button className="header-btn">
                        <img src={svgService.powerUpsIcon} alt="Power-Ups" />
                        <span>Power-Ups</span>
                        <span className="power-up-count">{demoPowerUps.length}</span>
                    </button>
                </div>

                <div className="automation">
                    <button className="header-btn">
                        <img src={svgService.highlightIcon} alt="Automation" />
                        <span>Automation</span>
                    </button>
                </div>

                <div className="filters">
                    <button className="header-btn">
                        <img src={svgService.filterIcon} alt="Filter" />
                        <span>Filters</span>
                    </button>
                </div>

                <div className="share">
                    <button className="header-btn share-btn">
                        <img src={svgService.shareIcon} alt="Share" />
                        <span>Share</span>
                    </button>
                </div>

                <div className="members">
                    <button className="header-btn members-btn">
                        <img src={svgService.membersIcon} alt="Members" />
                    </button>
                </div>
            </div>
        </section>
    )
}