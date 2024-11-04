import { TradingDataService } from './trading-data.service';

describe('TradingDataService', () => {
  let service: TradingDataService;

  beforeEach(() => {
    service = new TradingDataService();
  });

  describe('set()', () => {

    it('should set a simple property', () => {
      const key = 'name';
      const value = 'Alice'
      service.set(key, value);
      expect(service['data']).toEqual({[key]: value});
    });

    it('should set a nested object property', () => {
      const nestedKey = `user.profile.age`;
      const value = 30;
      const expectedValue = {
        user: {
          profile: {
            age: value
          }
        }
      }
      service.set(nestedKey, value);
      expect(service['data']).toEqual(expectedValue);
    });

    it('should set an array element', () => {
      const keyWithArray = 'users.[0]';
      const value = { name: 'Bob' };
      const expectedValue = {
        users: [
          { name: 'Bob' }
        ]
      }
      service.set(keyWithArray, value);
      expect(service['data']).toEqual(expectedValue);
    });

    it('should push to the end of an array', () => {

      const keyWithArray = 'users.[]';
      const value1 = { name: 'Charlie' };
      const value2 = { name: 'David' };
      const expectedValue = {
        users: [
          value1,
          value2
        ]
      }

      service.set(keyWithArray, value1);
      service.set(keyWithArray, value2);
      expect(service['data']).toEqual(expectedValue);

    });

    it('should handle mixed object and array paths', () => {

      const key = 'company.departments.[].employees.[].position';
      const value = 'Manager';
      const expectedValue = {
        company: {
          departments: [
            {
              employees: [
                { position: 'Manager' }
              ]
            }
          ]
        }
      };

      service.set(key, value);
      expect(service['data']).toEqual(expectedValue);
    });
  });

  describe('get()', () => {
    beforeEach(() => {
      service['data'] = {
        users: [
          { name: 'Alice', age: 30 },
          { name: 'Bob', age: 25 }
        ],
        settings: {
          theme: {
            darkMode: true
          }
        },
        company: {
          departments: [
            { name: 'IT' }
          ]
        },
        nestedArray: [
          [
            [
              [123]
            ]
          ]
        ]
      };
    });

    // TODO move this section array items to "Combinations testing" section
    describe('object properties', () => {
      describe('first level properties', () => {

        beforeEach(() => {
          service['data'] = { name: 'Alice' };
        });

        it('should get a first level property', () => {
          expect(service.get('name')).toBe('Alice');
        });

        it('should return undefined for a non-existent first level property', () => {
          expect(service.get('nonexistent')).toBeUndefined();
        });

        it('should return a default value for a non-existent first level property', () => {
          expect(service.get('nonexistent', 'default')).toBe('default');
        });
      });

      describe('nested properties', () => {
        beforeEach(() => {
          service['data'] = {
            settings: {
              theme: {
                mode: {
                  type: 'dark'
                }
              }
            }
          };
        });

        it('should get a nested property', () => {
          expect(service.get('settings.theme.mode.type')).toBe('dark');
        });

        it('should return undefined for a non-existent nested property', () => {
          expect(service.get('settings.theme.mode.nonexistent')).toBeUndefined();
          expect(service.get('nonexistent.nonexistentToo.andThisOneToo.andTheLastOne')).toBeUndefined();
        });
        
        it('should return a default value for a non-existent nested property', () => {
          expect(service.get('settings.theme.mode.nonexistent', 'default')).toBe('default');
          expect(service.get('nonexistent.nonexistentToo.andThisOneToo.andTheLastOne', 'default')).toBe('default');
        });

      });

      describe('property paths with array at the top level', () => {

        describe('first level is array', () => {
          describe('one level deep', () => {
            beforeEach(() => {
              service['data'] = [
                { value: 8 },
                { value: 14 },
                { value: "text" },
                { value: true },
                { value: null }
              ];
            });

            it('should get existed elements according rules', () => {
              expect(service.get('[0].value')).toBe(8);
              expect(service.get('[1].value')).toBe(14);
              expect(service.get('[2].value')).toBe("text");
              expect(service.get('[3].value')).toBe(true);
              expect(service.get('[4].value')).toBe(null);
              expect(service.get('[].value')).toBe(null);
              // check if default value as argument affects result. It shouldn't.            
              expect(service.get('[0].value', 'some_default')).toBe(8);
              expect(service.get('[1].value', 'some_default')).toBe(14);
              expect(service.get('[2].value', 'some_default')).toBe("text");
              expect(service.get('[3].value', 'some_default')).toBe(true);
              expect(service.get('[4].value', 'some_default')).toBe(null);
              expect(service.get('[].value', 'some_default')).toBe(null);
            });

            it('should return undefined for a non-existent element', () => {
              expect(service.get('[5].value')).toBeUndefined();
              expect(service.get('nonexistent.this.and.this.and.this')).toBeUndefined();
              expect(service.get('nonexistent.[].value')).toBeUndefined();
              expect(service.get('[].nonexistent')).toBeUndefined();
            });

            it('should return a default value for a non-existent element', () => {
              expect(service.get('[5].value', 'some_default')).toBe('some_default');
              expect(service.get('nonexistent.this.and.this.and.this', 'some_default')).toBe('some_default');
              expect(service.get('nonexistent.[].value', 'some_default')).toBe('some_default');
              expect(service.get('[].nonexistent', 'some_default')).toBe('some_default');
            });
          });

          describe('two levels deep', () => {
            beforeEach(() => {
              service['data'] = [
                [
                  { name: 'Alice' },
                  { name: 'Bob' },
                  { name: 'Charlie' }
                ],
                [
                  { name: 'Dave' },
                  { name: 'Eve' },
                  { name: 'Frank' }
                ],
                [
                  { name: 'George' },
                  { name: 'Hank' },
                  { name: 'Ian' }
                ]
              ];
            });

            it('should get existed elements according rules', () => {
              expect(service.get('[].[].name')).toBe('Ian');
              expect(service.get('[1].[2].name')).toBe('Frank');
              expect(service.get('[2].[0].name')).toBe('George');
              expect(service.get('[].[1].name')).toBe('Hank');
            });

            it('should return undefined for a non-existent element', () => {
              expect(service.get('[3].[0].name')).toBeUndefined();
              expect(service.get('[].[1].nonexistent')).toBeUndefined();
              expect(service.get('[].[].[].[].nonexistent')).toBeUndefined();
              expect(service.get('nonexistent.and.this.and.this.and.this')).toBeUndefined();
              expect(service.get('nonexistent.[].some.[].value')).toBeUndefined();
            });

            it('should return a default value for a non-existent element', () => {
              expect(service.get('[3].[0].name', 'some_default')).toBe('some_default');
              expect(service.get('[].[1].nonexistent', 'some_default')).toBe('some_default');
              expect(service.get('[].[].[].[].nonexistent', 'some_default')).toBe('some_default');
              expect(service.get('nonexistent.and.this.and.this.and.this', 'some_default')).toBe('some_default');
              expect(service.get('nonexistent.[].some.[].value', 'some_default')).toBe('some_default');
            });
          });

          describe('three levels deep', () => {

            beforeEach(() => {
              service['data'] = [
                [
                  [{price: 23}, {price: 7}, {price: 15} ],
                  [{price: 4}, {price: 19}, {price: 11}],
                  [{price: 26}, {price: 9}, {price: 1}]
                ],
                [
                  [{price: 18}, {price: 3}, {price: 25}],
                  [{price: 13}, {price: 6}, {price: 21}],
                  [{price: 10}, {price: 27}, {price: 16}]
                ],
                [
                  [{price: 8}, {price: 20}, {price: 2}],
                  [{price: 14}, {price: 5}, {price: 24}],
                  [{price: 12}, {price: 22}, {price: 17}]
                ]
              ];
            });

            it('should get existed elements according rules', () => {
              expect(service.get('[].[].[].price')).toBe(17);
              expect(service.get('[2].[2].[2].price')).toBe(17);
              expect(service.get('[2].[0].[1].price')).toBe(20);
              expect(service.get('[0].[0].[0].price')).toBe(23);
              expect(service.get('[2].[].[2].price')).toBe(17);
              expect(service.get('[].[2].[1].price')).toBe(22);
              expect(service.get('[].[].[0].price')).toBe(12);
            });

            it('should return undefined for a non-existent element', () => {
              expect(service.get('[3].[2].[2].price')).toBeUndefined();
              expect(service.get('[].[2].[5].price')).toBeUndefined();
              expect(service.get('[].[].[100].price')).toBeUndefined();
              expect(service.get('[2].[2].[2].nonexistent')).toBeUndefined();
              expect(service.get('[].[].[0].nonexistent')).toBeUndefined();
              expect(service.get('[].[].[].nonexistent')).toBeUndefined();
            });

            it('should return a default value for a non-existent element', () => {
              expect(service.get('[3].[2].[2].price', 'some_default')).toBe('some_default');
              expect(service.get('[].[2].[5].price', 'some_default')).toBe('some_default');
              expect(service.get('[].[].[100].price', 'some_default')).toBe('some_default');
              expect(service.get('[2].[2].[2].nonexistent', 'some_default')).toBe('some_default');
              expect(service.get('[].[].[0].nonexistent', 'some_default')).toBe('some_default');
              expect(service.get('[].[].[].nonexistent', 'some_default')).toBe('some_default');
            });

          });
        });

      });
    });

    /** 
     * Combinations testing
    */
    describe('nesting level 1', () => {

      describe('object_property', () => {
        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });
      });

      describe('array_item', () => {
        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });
      });

    });

    describe('nesting level 2', () => {
      describe('object_property.object_property', () => {
        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });
      });

      describe('object_property.array_item', () => {
        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });
      });

      describe('array_item.object_property', () => {
        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });
      });

      describe('array_item.array_item', () => {
        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });
      }); 

    });

    describe('nesting level 3', () => {
      describe('object_property.object_property.object_property', () => {
        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });
      });

      describe('object_property.object_property.array_item', () => {
        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });
      });

      describe('object_property.array_item.object_property', () => {
        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });
      });

      describe('array_item.object_property.object_property', () => {
        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });
      });

      describe('array_item.object_property.array_item', () => {
        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });
      });

      describe('array_item.array_item.object_property', () => {
        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });
      });

      describe('array_item.array_item.array_item', () => {
        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });
      });

    });

    describe('nesting level 4', () => {

      describe('object_property.object_property.object_property.object_property', () => {

        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });

      });

      describe('object_property.object_property.object_property.array_item', () => {

        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });

      });

      describe('order object_property.object_property.array_item.object_property', () => {

        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });

      });

      describe('order object_property.array_item.object_property.object_property', () => {

        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });

      });

      describe('order array_item.object_property.object_property.object_property', () => {

        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });

      });


      describe('order array_item.object_property.object_property.array_item', () => {

        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });

      });

      describe('order array_item.object_property.array_item.object_property', () => {

        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });

      });

      describe('order array_item.array_item.object_property.object_property', () => {

        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });

      });

      describe('order array_item.array_item.object_property.array_item', () => {

        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });

      });


      describe('order array_item.array_item.array_item.object_property', () => {

        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });

      });

      describe('order array_item.array_item.array_item.array_item', () => {

        it('should get a specified value', () => {
        });

        it('should return undefined for a non-existent', () => {
        });
        
        it('should return a specified default value for a non-existent', () => {
        });

      });

    });


    it('should get a nested property', () => {
      service['data'] = {
        settings: {
          theme: {
            mode: {
              type: 'dark'
            }
          }
        }
      };
      expect(service.get('settings.theme.mode.type')).toBe('dark');
    });

    it('should get an array element', () => {
      service['data'] = {
        users: [
          { name: 'Alice', age: 30 },
          { name: 'Bob', age: 25 }
        ]
      };
      expect(service.get('users.[0].name')).toBe('Alice');
      expect(service.get('users.[1].name')).toBe('Bob');
    });

    it('should get the last element of an array', () => {
      service['data'] = {
        users: [
          { name: 'Alice', age: 30 },
          { name: 'Bob', age: 25 },
          { name: 'Charlie', age: 35 }
        ]
      };
      expect(service.get('users.[].name')).toBe('Charlie');
    });

    it('should get a nested array element', () => {
      expect(service.get('nestedArray.[].[].[].[]')).toBe(123);
    });


    it('should handle arrays in the middle of the path', () => {
      expect(service.get('company.departments.[0].name')).toBe('IT');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string keys', () => {
      service.set('', 'root');
      expect(service.get('')).toBe('root');
    });

    it('should handle numeric keys', () => {
      service.set('0', 'zero');
      expect(service.get('0')).toBe('zero');
    });

    it('should throw error when trying to push to a non-array', () => {
      service['data'] = {
        'notAnArray': {}
      };
      expect(() => service.set('notAnArray.[]', 'value')).toThrow('Cannot push to a non-array');
    });
  });
});