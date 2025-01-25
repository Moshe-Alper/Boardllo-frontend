import { useSelector } from "react-redux"
import { onToggleModal } from "../store/actions/app.actions"

export function DynamicModal() {
	const modalData = useSelector((storeState) => storeState.appModule.modalData)

	function onCloseModal() {
		onToggleModal()
	}

	if (!modalData) return <></>
	const Cmp = modalData.cmp
	return (
		<div className="dynamic-modal-overlay" onClick={onCloseModal}>
			<div className="dynamic-modal" onClick={(ev) => ev.stopPropagation()}>
				<section className="content">
					{Cmp && <Cmp {...modalData.props} />}
				</section>
			</div>
		</div>
	)
}
