/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { Component } = wp.element;

const {
	registerBlockType,
	InspectorControls,
} = wp.blocks;

const {
	PanelBody,
	RangeControl,
} = wp.components;

/**
 * Internal dependencies
 */
import icon from './icon';
// import './style.scss';
// import './editor.scss';

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
registerBlockType( 'wcdet/latest-posts', {
	title: __( 'WCDET Latest Posts' ),
	icon,
	category: 'common',
	keywords: [
		__( 'Recent Posts' ),
	],

	attributes: {
		numberOfPosts: {
			type: 'number',
		},
	},

	edit: class extends Component {
		constructor() {
			super( ...arguments );

			this.fetchPosts = this.fetchPosts.bind( this );

			this.state = {
				posts: [],
				error: false,
				fetching: false,
			};
		}

		componentWillMount() {
			const { attributes, setAttributes } = this.props;
			const { numberOfPosts } = attributes;

			// If no number of posts has been saved, default to 5
			if ( ! numberOfPosts ) {
				setAttributes( { numberOfPosts: 5 } );
			}

			this.fetchPosts();
		}

		fetchPosts() {
			const numberOfPosts = this.props.attributes.numberOfPosts || 5;

			this.setState( { posts: [], fetching: true } );

			window.fetch( `https://2018.detroit.wordcamp.org/wp-json/wp/v2/posts/?per_page=${ numberOfPosts }` )
				.then( response => {
					return response.json();
				} )
				.then( posts => {
					this.setState( { posts, fetching: false } );
				} )
				.catch( () => {
					this.setState( { error: true, fetching: false } );
				} );
		}

		// Markup to be rendered in the wp-admin
		render() {
			const { attributes, setAttributes } = this.props;
			const { posts, fetching, error } = this.state;

			const handleNumberOfPostsChange = numberOfPosts => {
				setAttributes( { numberOfPosts } );
				this.fetchPosts();
			};

			return (
				<div>
					{ fetching &&
						<p>Fetching posts...</p>
					}
					{ error &&
						<p>Sorry, an error occurred. Please try again.</p>
					}
					{ !! posts.length && (
						posts.map( post =>
							<p key={ post.id }>
								<a href={ post.link }>{ post.title.rendered }</a>
							</p>
						)
					) }
					<InspectorControls>
						<PanelBody title={ __( 'Display Options' ) }>
							<RangeControl
								beforeIcon="arrow-left-alt2"
								afterIcon="arrow-right-alt2"
								label={ __( 'Range Control' ) }
								value={ attributes.numberOfPosts }
								onChange={ handleNumberOfPostsChange }
								min={ 1 }
								max={ 30 }
							/>
						</PanelBody>
					</InspectorControls>
				</div>
			);
		}
	},

	// Markup saved to the database
	save: () => null,
} );
