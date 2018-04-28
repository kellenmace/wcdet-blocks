/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
	registerBlockType,
	RichText,
	InspectorControls,
	UrlInput,
	MediaUpload,
} = wp.blocks;

const {
	Button,
	Dashicon,
	PanelBody,
	PanelRow,
} = wp.components;

/**
 * Internal dependencies
 */
import './style.scss';
import './editor.scss';

/**
 * Register: Call to Action Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'wcdet/call-to-action', {
	title: __( 'Call to Action' ),
	icon: 'megaphone',
	category: 'common',
	keywords: [
		__( 'CTA' ),
	],

	attributes: {
		message: {
			type: 'array',
			source: 'children',
			selector: '.message',
		},
		linkUrl: {
			source: 'attribute',
			selector: '.link',
			attribute: 'src',
		},
		imgURL: {
			type: 'string',
			source: 'attribute',
			attribute: 'src',
			selector: '.image',
		},
		imgID: {
			type: 'number',
		},
		imgAlt: {
			type: 'string',
			source: 'attribute',
			attribute: 'alt',
			selector: '.image',
		},
	},

	// Markup to be rendered in the wp-admin
	edit( props ) {
		const { className, attributes, setAttributes, isSelected } = props;
		const { imgID, imgURL, imgAlt } = attributes;

		const onSelectImage = img => {
			setAttributes( {
				imgID: img.id,
				imgURL: img.url,
				imgAlt: img.alt,
			} );
		};

		const onRemoveImage = () => {
			setAttributes( {
				imgID: null,
				imgURL: null,
				imgAlt: null,
			} );
		};

		return (
			<div className={ className }>
				<div className="container">

					{ ! imgID ? ( // If an image has NOT been chosen

						<MediaUpload
							onSelect={ onSelectImage }
							type="image"
							value={ imgID }
							render={ ( { open } ) => (
								<Button
									className="button button-large"
									onClick={ open }
								>
									<Dashicon icon="admin-media" />
									{ __( ' Upload Image' ) }
								</Button>
							) }
						>
						</MediaUpload>

					) : ( // If an image HAS been chosen

						<div>
							<img
								src={ imgURL }
								alt={ imgAlt }
								className="image"
							/>

							{ isSelected && (
								<Button
									className="button button-large"
									onClick={ onRemoveImage }
								>
									<Dashicon icon="no" size="20" />
									{ __( 'Remove Image' ) }
								</Button>
							) }
						</div>

					) }

					<RichText
						tagName="div"
						multiline="p"
						placeholder={ __( 'Enter CTA message here...' ) }
						value={ attributes.message }
						onChange={ message => setAttributes( { message } ) }
					/>

					{ isSelected && (
						<InspectorControls>
							<PanelBody title={ __( 'Call to Action URL' ) }>
								<PanelRow>
									<form onSubmit={ event => event.preventDefault() }>
										<Dashicon icon="admin-links" size="20" />
										<UrlInput
											className="link-url"
											value={ attributes.linkUrl }
											onChange={ linkUrl => setAttributes( { linkUrl } ) }
										/>
									</form>
								</PanelRow>
							</PanelBody>
						</InspectorControls>
					) }
				</div>
			</div>
		);
	},

	// Markup saved to the database
	save( props ) {
		const { className, attributes } = props;
		const { message, linkUrl, imgURL, imgAlt } = attributes;

		return (
			<div className={ className }>
				<a href={ linkUrl } className="link">
					<div className="container">
						<img
							src={ imgURL }
							alt={ imgAlt }
							className="image"
						/>
						<div className="message">
							{ message }
						</div>
					</div>
				</a>
			</div>
		);
	},
} );
